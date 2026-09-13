from typing import Dict, Any, List
from app.core.state import TaskNode, TaskStatus, AgentRole, VerificationState

class PlannerAgent:
    """Decomposes mission specifications into a strictly validated Directed Acyclic Graph (DAG)."""

    @staticmethod
    def generate_plan(spec: Dict[str, Any]) -> Dict[str, TaskNode]:
        company = spec.get("target_company", "Acme")
        tasks: Dict[str, TaskNode] = {}

        # 1. Calendar Task (Root)
        tasks["task_calendar"] = TaskNode(
            id="task_calendar",
            type="CALENDAR_LOOKUP",
            title="Scan Google Calendar for Interview",
            description=f"Query Google Calendar for scheduled technical interview events with {company}.",
            agent=AgentRole.CALENDAR_AGENT,
            tool="calendar.find_interview",
            dependencies=[],
            input_payload={"company": company, "query": f"{company} interview"},
            verification_rule="Valid confirmed event ID, time, and interviewer attendee list"
        )

        # 2. Gmail Task (Root)
        tasks["task_gmail"] = TaskNode(
            id="task_gmail",
            type="GMAIL_SEARCH",
            title="Extract Recruiter Thread & Prep Guide",
            description=f"Search Gmail inbox for recruiter correspondence, interview formats, and role specifications for {company}.",
            agent=AgentRole.GMAIL_AGENT,
            tool="gmail.search_thread",
            dependencies=[],
            input_payload={"company": company, "query": f"{company} recruiter technical interview"},
            verification_rule="Message ID confirmed, valid domain sender, technical requirements extracted"
        )

        # 3. GitHub Task (Root)
        tasks["task_github"] = TaskNode(
            id="task_github",
            type="GITHUB_ANALYZE",
            title="Analyze Company Repositories & Architecture",
            description=f"Inspect public {company} GitHub repositories for code patterns, commit history, and technology breakdown.",
            agent=AgentRole.GITHUB_AGENT,
            tool="github.analyze_repository",
            dependencies=[],
            input_payload={"organization": f"{company.lower()}-corp", "company": company},
            verification_rule=">=2 repositories analyzed, language distribution validated, commits verified"
        )

        # 4. Research Task (Root)
        tasks["task_research"] = TaskNode(
            id="task_research",
            type="WEB_RESEARCH",
            title="Research Engineering Blog & System Scale",
            description=f"Investigate {company}'s publicly discussed architectural challenges, blog articles, and tech culture.",
            agent=AgentRole.RESEARCH_AGENT,
            tool="web.research_company",
            dependencies=[],
            input_payload={"company": company},
            verification_rule="Engineering articles verified with real URLs and takeaway summaries"
        )

        # 5. Intelligence Synthesis Task (Depends on 1, 2, 3, 4)
        tasks["task_intelligence"] = TaskNode(
            id="task_intelligence",
            type="SYNTHESIZE_INTEL",
            title="Synthesize Multi-App Technical Intelligence",
            description="Cross-correlate recruiter syllabus with codebase commits to identify critical knowledge gaps and tailored questions.",
            agent=AgentRole.INTELLIGENCE_AGENT,
            tool="internal.synthesize_intel",
            dependencies=["task_calendar", "task_gmail", "task_github", "task_research"],
            input_payload={"company": company},
            verification_rule="Knowledge gap matrix generated with prioritized technical topics"
        )

        # 6. Document Generation Task (Depends on 5)
        tasks["task_document"] = TaskNode(
            id="task_document",
            type="CREATE_BRIEFING",
            title="Compile Verified Interview Briefing & Study Plan",
            description="Generate comprehensive 7-section markdown & HTML briefing document and compute SHA-256 cryptographic hash.",
            agent=AgentRole.DOCUMENT_AGENT,
            tool="document.create_briefing",
            dependencies=["task_intelligence"],
            input_payload={"company": company},
            verification_rule="File exists on filesystem, size > 2KB, 7 sections complete, SHA-256 attested"
        )

        # 7. Notification Task (Depends on 6)
        tasks["task_notification"] = TaskNode(
            id="task_notification",
            type="SEND_NOTIFICATION",
            title="Dispatch Slack Notification to Team Channel",
            description="Send completion card with briefing summary and verification audit badge to Slack #interview-prep.",
            agent=AgentRole.NOTIFICATION_AGENT,
            tool="slack.send_notification",
            dependencies=["task_document"],
            input_payload={"company": company, "channel": "#interview-prep"},
            requires_approval=True, # Human-in-the-loop approval checkpoint
            verification_rule="Provider HTTP 200 delivery receipt and timestamp (ts) confirmed"
        )

        # 8. Verification Audit Task (Depends on all previous tasks)
        tasks["task_verification"] = TaskNode(
            id="task_verification",
            type="VERIFY_ALL",
            title="Comprehensive Mission Audit & Attestation",
            description="Conduct independent post-mission verification across all 7 executed steps and confirm zero unverified claims.",
            agent=AgentRole.VERIFICATION_AGENT,
            tool="internal.verify_mission",
            dependencies=["task_calendar", "task_gmail", "task_github", "task_research", "task_intelligence", "task_document", "task_notification"],
            input_payload={"company": company},
            verification_rule="100% of consequential actions attested with physical evidence"
        )

        return tasks
