import pytest
from app.engine.orchestrator import MissionOrchestrator
from app.core.state import MissionStatus, TaskStatus, VerificationState

@pytest.mark.asyncio
async def test_full_mission_planning_and_execution():
    orch = MissionOrchestrator()
    mission = orch.create_mission(
        goal="Prepare me for tomorrow's technical interview at Acme. Find details, analyze repo, create briefing, notify me.",
        mode="DEMO"
    )
    assert mission.status == MissionStatus.INITIALIZING
    
    # Plan
    planned_mission = await orch.initialize_and_plan(mission.id)
    assert planned_mission.status == MissionStatus.PLANNING
    assert len(planned_mission.tasks) == 8
    
    # Execute with auto-approval
    completed_mission = await orch.execute_mission(mission.id, auto_approve_write_actions=True)
    assert completed_mission.status == MissionStatus.COMPLETED
    assert completed_mission.verified_count >= 7
    assert completed_mission.final_report["verification_summary"]["verified_actions"] >= 7
    assert completed_mission.final_report["actions_completed"]["briefing_created"] is True

@pytest.mark.asyncio
async def test_human_approval_gate():
    orch = MissionOrchestrator()
    mission = orch.create_mission(
        goal="Prepare me for tomorrow's technical interview at Acme.",
        mode="DEMO"
    )
    await orch.initialize_and_plan(mission.id)
    
    # Execute with human approval gate active (auto_approve=False)
    mission_paused = await orch.execute_mission(mission.id, auto_approve_write_actions=False)
    
    # Notification task requires approval, so it should pause on WAITING_APPROVAL
    notif_task = mission_paused.tasks["task_notification"]
    assert notif_task.status == TaskStatus.WAITING_APPROVAL
    
    # Human Operator approves
    mission_resumed = await orch.approve_task(mission.id, "task_notification")
    assert mission_resumed.status == MissionStatus.COMPLETED
    assert mission_resumed.tasks["task_notification"].is_approved is True
    assert mission_resumed.tasks["task_notification"].status == TaskStatus.VERIFIED
