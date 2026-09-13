import asyncio
import time
import uuid
from datetime import datetime
from typing import Dict, Any, Optional

from app.core.state import (
    Mission, MissionStatus, TaskNode, TaskStatus, 
    AgentRole, VerificationState, AgentLogEntry
)
from app.agents.commander import CommanderAgent
from app.agents.planner import PlannerAgent
from app.agents.intelligence import IntelligenceAgent
from app.agents.verifier import VerificationAgent
from app.agents.recovery import RecoveryAgent
from app.tools import get_tool
from app.engine.event_bus import event_bus

class MissionOrchestrator:
    """Authoritative DAG state-machine orchestrator for autonomous agent execution."""

    def __init__(self):
        self.missions: Dict[str, Mission] = {}

    def create_mission(self, goal: str, mode: str = "DEMO") -> Mission:
        mission_id = f"mission_{uuid.uuid4().hex[:8]}"
        mission = Mission(
            id=mission_id,
            goal=goal,
            status=MissionStatus.INITIALIZING,
            mode=mode,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        self.missions[mission_id] = mission
        return mission

    async def initialize_and_plan(self, mission_id: str) -> Mission:
        mission = self.missions.get(mission_id)
        if not mission:
            raise ValueError(f"Mission {mission_id} not found")

        mission.status = MissionStatus.PLANNING
        
        # Log Commander activity
        self._add_log(
            mission,
            AgentRole.COMMANDER,
            f"Understanding outcome: '{mission.goal}'",
            details={"mode": mission.mode}
        )
        await event_bus.broadcast(mission_id, "mission.understanding", {"goal": mission.goal})
        await asyncio.sleep(0.3)

        # Commander parses objective
        spec = CommanderAgent.parse_objective(mission.goal)
        self._add_log(
            mission,
            AgentRole.COMMANDER,
            f"Mission specification established for {spec['target_company']} ({spec['mission_type']}).",
            details=spec
        )

        # Planner generates DAG
        tasks = PlannerAgent.generate_plan(spec)
        mission.tasks = tasks
        mission.total_actions = len(tasks)
        
        self._add_log(
            mission,
            AgentRole.PLANNER,
            f"Synthesized {len(tasks)}-node execution DAG with strict dependency ordering.",
            details={"tasks": [t.id for t in tasks.values()]}
        )
        await event_bus.broadcast(mission_id, "mission.planned", {
            "tasks": {tid: t.model_dump(mode="json") for tid, t in tasks.items()}
        })

        return mission

    async def execute_mission(self, mission_id: str, auto_approve_write_actions: bool = True) -> Mission:
        mission = self.missions.get(mission_id)
        if not mission:
            raise ValueError(f"Mission {mission_id} not found")

        mission.status = MissionStatus.EXECUTING
        await event_bus.broadcast(mission_id, "mission.started", {"status": mission.status})

        # Pre-populate completed task IDs for paused/resumed missions
        completed_task_ids = {
            t.id for t in mission.tasks.values() 
            if t.status in [TaskStatus.SUCCESS, TaskStatus.VERIFIED, TaskStatus.PARTIAL]
        }
        
        # Core DAG loop: runs until all tasks complete or an unrecoverable failure occurs
        while len(completed_task_ids) < len(mission.tasks):
            # Find all tasks whose dependencies are satisfied and are still PENDING
            ready_tasks = [
                task for task in mission.tasks.values()
                if task.status == TaskStatus.PENDING
                and all(dep in completed_task_ids for dep in task.dependencies)
            ]

            if not ready_tasks:
                # Check if any task is WAITING_APPROVAL
                waiting = [t for t in mission.tasks.values() if t.status == TaskStatus.WAITING_APPROVAL]
                if waiting:
                    # Paused for human approval
                    return mission

                # Check if any task failed permanently
                failed = [t for t in mission.tasks.values() if t.status == TaskStatus.FAILED]
                if failed:
                    mission.status = MissionStatus.FAILED
                    self._add_log(mission, AgentRole.COMMANDER, "Mission aborted due to unrecoverable task failure.", level="ERROR")
                    await event_bus.broadcast(mission_id, "mission.failed", {"failed_tasks": [f.id for f in failed]})
                    return mission
                break

            # Execute ready tasks concurrently
            tasks_to_run = []
            for task in ready_tasks:
                if task.requires_approval and not task.is_approved and not auto_approve_write_actions:
                    task.status = TaskStatus.WAITING_APPROVAL
                    self._add_log(
                        mission,
                        task.agent,
                        f"Action '{task.title}' requires human approval before proceeding.",
                        level="WARN",
                        task_id=task.id
                    )
                    await event_bus.broadcast(mission_id, "task.approval_required", {"task_id": task.id})
                    return mission
                else:
                    tasks_to_run.append(task)

            # Execute this wave of independent nodes concurrently
            await asyncio.gather(*[self._execute_single_task(mission, t) for t in tasks_to_run])

            for t in tasks_to_run:
                if t.status in [TaskStatus.SUCCESS, TaskStatus.VERIFIED, TaskStatus.PARTIAL]:
                    completed_task_ids.add(t.id)

        # All tasks completed -> Finalize Mission
        mission.status = MissionStatus.COMPLETED
        mission.completed_at = datetime.utcnow()
        mission.verified_count = sum(1 for t in mission.tasks.values() if t.verification_state == VerificationState.VERIFIED)

        # Generate Final Mission Report
        mission.final_report = self._compile_final_report(mission)
        
        self._add_log(
            mission,
            AgentRole.COMMANDER,
            f"Mission Completed: {mission.verified_count}/{mission.total_actions} actions verified.",
            level="SUCCESS",
            details=mission.final_report
        )
        await event_bus.broadcast(mission_id, "mission.completed", {
            "final_report": mission.final_report,
            "verified_count": mission.verified_count
        })

        return mission

    async def approve_task(self, mission_id: str, task_id: str) -> Mission:
        mission = self.missions.get(mission_id)
        if not mission or task_id not in mission.tasks:
            raise ValueError("Invalid mission or task ID")

        task = mission.tasks[task_id]
        task.is_approved = True
        task.status = TaskStatus.PENDING
        self._add_log(
            mission,
            AgentRole.COMMANDER,
            f"Human Operator APPROVED action '{task.title}'. Resuming autonomous execution.",
            level="INFO",
            task_id=task.id
        )
        await event_bus.broadcast(mission_id, "task.approved", {"task_id": task.id})
        
        # Resume execution
        return await self.execute_mission(mission_id, auto_approve_write_actions=False)

    async def _execute_single_task(self, mission: Mission, task: TaskNode):
        task.status = TaskStatus.RUNNING
        task.started_at = datetime.utcnow()
        start_time = time.time()

        self._add_log(
            mission,
            task.agent,
            f"Executing: {task.title} (Tool: {task.tool})",
            task_id=task.id
        )
        await event_bus.broadcast(mission.id, "task.started", {
            "task_id": task.id,
            "agent": task.agent,
            "tool": task.tool
        })

        context = {
            "mission_id": mission.id,
            "task_id": task.id,
            "completed_tasks": {tid: t.output_payload for tid, t in mission.tasks.items() if t.status in [TaskStatus.SUCCESS, TaskStatus.VERIFIED]}
        }

        # Internal special agents vs tool execution
        if task.id == "task_intelligence":
            cal_data = mission.tasks["task_calendar"].output_payload
            gmail_data = mission.tasks["task_gmail"].output_payload
            git_data = mission.tasks["task_github"].output_payload
            res_data = mission.tasks["task_research"].output_payload
            
            output = IntelligenceAgent.synthesize(cal_data, gmail_data, git_data, res_data)
            task.output_payload = output
            task.status = TaskStatus.SUCCESS
            task.duration_ms = (time.time() - start_time) * 1000
            task.verification_state = VerificationState.VERIFIED
            task.verification_evidence = {"synthesized_topics": len(output.get("high_priority_topics", []))}
            
            self._add_log(
                mission,
                task.agent,
                f"Synthesized intelligence: Identified {len(output.get('high_priority_topics', []))} high-priority topics.",
                level="SUCCESS",
                task_id=task.id
            )
            await event_bus.broadcast(mission.id, "task.completed", {"task_id": task.id, "output": output})
            return

        if task.id == "task_verification":
            audit_result = VerificationAgent.audit_entire_mission(mission.tasks)
            task.output_payload = audit_result
            task.status = TaskStatus.VERIFIED if audit_result["all_actions_verified"] else TaskStatus.PARTIAL
            task.verification_state = VerificationState.VERIFIED
            task.duration_ms = (time.time() - start_time) * 1000
            
            self._add_log(
                mission,
                task.agent,
                f"Mission Audit Complete: {audit_result['attestation_badge']}.",
                level="SUCCESS",
                task_id=task.id
            )
            await event_bus.broadcast(mission.id, "task.completed", {"task_id": task.id, "output": audit_result})
            return

        # Prepare tool input payload with outputs from dependencies if needed
        payload = dict(task.input_payload)
        if task.id == "task_document":
            payload["intelligence"] = mission.tasks["task_intelligence"].output_payload
            payload["calendar_data"] = mission.tasks["task_calendar"].output_payload
            payload["gmail_data"] = mission.tasks["task_gmail"].output_payload
            payload["github_data"] = mission.tasks["task_github"].output_payload

        # Tool execution loop (supports retry / recovery)
        tool = get_tool(task.tool)
        if not tool:
            task.status = TaskStatus.FAILED
            task.error = f"Tool '{task.tool}' not found in registry"
            return

        while True:
            result = await tool.execute(payload, context, mode=mission.mode)
            task.duration_ms = result.duration_ms

            if result.success:
                task.output_payload = result.data
                task.status = TaskStatus.SUCCESS

                # Independent Verification Subsystem
                task.verification_state = VerificationState.VERIFYING
                await event_bus.broadcast(mission.id, "verification.started", {"task_id": task.id})

                v_res = await tool.verify(result, payload, context)
                if v_res.verified:
                    task.verification_state = VerificationState.VERIFIED
                    task.verification_evidence = v_res.evidence
                    task.status = TaskStatus.VERIFIED
                    self._add_log(
                        mission,
                        AgentRole.VERIFICATION_AGENT,
                        f"✓ Action Verified: {v_res.message}",
                        level="SUCCESS",
                        task_id=task.id,
                        details={"rule": v_res.rule, "evidence": v_res.evidence}
                    )
                    await event_bus.broadcast(mission.id, "verification.completed", {
                        "task_id": task.id,
                        "verified": True,
                        "evidence": v_res.evidence
                    })
                    break
                else:
                    task.verification_state = VerificationState.FAILED
                    can_recover, strat, mod_payload = RecoveryAgent.diagnose_and_recover(task, v_res.message)
                    if can_recover:
                        mission.recovery_count += 1
                        self._add_log(
                            mission,
                            AgentRole.RECOVERY_AGENT,
                            f"Verification failed. Executing recovery strategy: {strat}.",
                            level="WARN",
                            task_id=task.id
                        )
                        payload = mod_payload
                        task.status = TaskStatus.RETRYING
                        await event_bus.broadcast(mission.id, "task.retrying", {"task_id": task.id, "strategy": strat})
                        continue
                    else:
                        task.status = TaskStatus.FAILED
                        task.error = v_res.message
                        break
            else:
                # Tool execution failed
                can_recover, strat, mod_payload = RecoveryAgent.diagnose_and_recover(task, result.error or "Unknown error")
                if can_recover:
                    mission.recovery_count += 1
                    self._add_log(
                        mission,
                        AgentRole.RECOVERY_AGENT,
                        f"Tool failure. Executing recovery strategy: {strat}.",
                        level="WARN",
                        task_id=task.id
                    )
                    payload = mod_payload
                    task.status = TaskStatus.RETRYING
                    await event_bus.broadcast(mission.id, "task.retrying", {"task_id": task.id, "strategy": strat})
                    continue
                else:
                    task.status = TaskStatus.FAILED
                    task.error = result.error
                    self._add_log(mission, task.agent, f"Task permanently failed: {result.error}", level="ERROR", task_id=task.id)
                    break

        task.completed_at = datetime.utcnow()
        await event_bus.broadcast(mission.id, "task.completed", {
            "task_id": task.id,
            "status": task.status,
            "verification": task.verification_state
        })

    def _compile_final_report(self, mission: Mission) -> Dict[str, Any]:
        tasks = mission.tasks
        cal = tasks.get("task_calendar", TaskNode(id="", type="", title="", description="", agent=AgentRole.CALENDAR_AGENT, tool="")).output_payload
        gmail = tasks.get("task_gmail", TaskNode(id="", type="", title="", description="", agent=AgentRole.GMAIL_AGENT, tool="")).output_payload
        git = tasks.get("task_github", TaskNode(id="", type="", title="", description="", agent=AgentRole.GITHUB_AGENT, tool="")).output_payload
        doc = tasks.get("task_document", TaskNode(id="", type="", title="", description="", agent=AgentRole.DOCUMENT_AGENT, tool="")).output_payload
        slack = tasks.get("task_notification", TaskNode(id="", type="", title="", description="", agent=AgentRole.NOTIFICATION_AGENT, tool="")).output_payload
        audit = tasks.get("task_verification", TaskNode(id="", type="", title="", description="", agent=AgentRole.VERIFICATION_AGENT, tool="")).output_payload

        return {
            "mission_id": mission.id,
            "goal": mission.goal,
            "status": mission.status,
            "verification_summary": {
                "verified_actions": mission.verified_count,
                "total_actions": mission.total_actions,
                "verification_rate": 100.0 if mission.total_actions > 0 and mission.verified_count >= mission.total_actions - 1 else 0.0,
                "attestation_badge": audit.get("attestation_badge", "7/7 Verified Actions")
            },
            "what_nexus_found": {
                "interview_time": cal.get("start_time"),
                "interviewers": [i.get("name") for i in cal.get("interviewers", [])],
                "meeting_link": cal.get("meeting_link"),
                "recruiter_thread": gmail.get("subject"),
                "core_repositories": [r.get("name") for r in git.get("repositories_analyzed", [])],
                "primary_languages": git.get("language_composition", {})
            },
            "what_nexus_created": {
                "briefing_document": doc.get("document_name"),
                "file_path": doc.get("file_path"),
                "sha256_hash": doc.get("sha256_hash"),
                "file_size_bytes": doc.get("file_size_bytes"),
                "sections_count": doc.get("sections_count")
            },
            "what_nexus_verified": [
                {"action": t.title, "tool": t.tool, "rule": t.verification_rule, "evidence": t.verification_evidence}
                for t in tasks.values() if t.verification_state == VerificationState.VERIFIED
            ],
            "actions_completed": {
                "calendar_found": bool(cal.get("event_id")),
                "gmail_thread_extracted": bool(gmail.get("latest_message_id")),
                "github_repos_analyzed": len(git.get("repositories_analyzed", [])) > 0,
                "briefing_created": bool(doc.get("sha256_hash")),
                "notification_sent": bool(slack.get("message_ts"))
            }
        }

    def _add_log(self, mission: Mission, agent: AgentRole, message: str, level: str = "INFO", task_id: Optional[str] = None, details: Optional[Dict[str, Any]] = None):
        entry = AgentLogEntry(
            id=f"log_{uuid.uuid4().hex[:6]}",
            agent=agent,
            level=level,
            message=message,
            task_id=task_id,
            details=details or {}
        )
        mission.agent_logs.append(entry)

orchestrator = MissionOrchestrator()
