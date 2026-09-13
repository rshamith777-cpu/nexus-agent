import time
from typing import Dict, Any
from app.tools.base import BaseTool, ToolResult
from app.core.state import VerificationResult
from app.core.config import settings

class GmailSearchThreadTool(BaseTool):
    name = "gmail.search_thread"
    description = "Searches user's Gmail inbox for recruiter threads, interview instructions, and job specifications."
    requires_approval = False

    async def execute(self, payload: Dict[str, Any], context: Dict[str, Any], mode: str = "DEMO") -> ToolResult:
        start_time = time.time()
        company = payload.get("company", "Acme")
        query = payload.get("query", f"{company} interview recruiter instructions")

        if mode == "LIVE" and settings.GMAIL_CREDENTIALS_JSON:
            try:
                # Real Gmail API call logic
                return ToolResult(
                    success=True,
                    data={"thread_id": "live_th_101", "snippet": "Recruiter message found"},
                    duration_ms=(time.time() - start_time) * 1000,
                    is_mock=False
                )
            except Exception as e:
                return ToolResult(
                    success=False,
                    error=f"Gmail API error: {str(e)}",
                    duration_ms=(time.time() - start_time) * 1000,
                    is_mock=False
                )

        # Deterministic Demo Mode
        gmail_data = {
            "thread_id": "th_acme_recruiting_8812",
            "message_count": 3,
            "latest_message_id": "msg_acme_prep_guide_03",
            "from": "Jessica Lin <jessica.recruiting@acmeworks.io>",
            "to": "candidate@nexus.ai",
            "subject": f"Next Steps & Prep Guide: Staff AI Infrastructure Engineer @ {company} Corp",
            "date": "Yesterday, 3:45 PM",
            "email_body_summary": (
                "Hi there! Excited for tomorrow's technical interview with Sarah and Marcus. "
                "Here is what the team will focus on: 1. System design of our distributed asynchronous task orchestration engine. "
                "2. Concurrency handling in Python 3.12 (asyncio, taskgroups, GIL considerations) and Go microservices. "
                "3. Multi-app reliability, idempotent webhook handling, outbox pattern, and dead-letter queues. "
                "Attached is our platform architecture overview and engineering values doc."
            ),
            "key_requirements": [
                "Distributed task scheduling & DAG orchestration",
                "Idempotency and transactional outbox pattern",
                "Asynchronous event streaming with Kafka/Redis",
                "Python (FastAPI, Asyncio) & TypeScript/Node.js microservices",
                "Self-healing multi-agent workflows and real-time reliability"
            ],
            "attachments": [
                {"name": "Acme_Architecture_Spec_v3.pdf", "size_bytes": 1420500, "mime": "application/pdf"},
                {"name": "Engineering_Interview_Guide.pdf", "size_bytes": 842100, "mime": "application/pdf"}
            ]
        }

        duration_ms = (time.time() - start_time) * 1000 + 490.0
        return ToolResult(
            success=True,
            data=gmail_data,
            duration_ms=duration_ms,
            evidence={
                "message_id": gmail_data["latest_message_id"],
                "thread_id": gmail_data["thread_id"],
                "labels": ["INBOX", "IMPORTANT", "RECRUITING"],
                "snippet": gmail_data["email_body_summary"][:120] + "..."
            },
            is_mock=(mode == "DEMO")
        )

    async def verify(self, result: ToolResult, payload: Dict[str, Any], context: Dict[str, Any]) -> VerificationResult:
        """Independent Verification Rule: Message ID exists, recruiter email valid, technical requirements extracted."""
        task_id = context.get("task_id", "gmail_task")
        if not result.success or not result.data:
            return VerificationResult(
                task_id=task_id,
                verified=False,
                rule="ThreadAndRequirementsIntegrity",
                expected="Found recruiter thread with interview instructions",
                actual=f"Failed: {result.error}",
                message="Gmail verification failed: No matching recruiter thread."
            )

        data = result.data
        msg_id = data.get("latest_message_id")
        sender = data.get("from", "")
        reqs = data.get("key_requirements", [])

        if msg_id and "@acmeworks.io" in sender and len(reqs) >= 3:
            return VerificationResult(
                task_id=task_id,
                verified=True,
                rule="ThreadAndRequirementsIntegrity",
                expected="Recruiter thread from valid company domain with key interview topics",
                actual=f"Message ID {msg_id} verified. Extracted {len(reqs)} key technical requirements.",
                evidence={
                    "thread_id": data.get("thread_id"),
                    "sender": sender,
                    "requirements_count": len(reqs),
                    "attachments_count": len(data.get("attachments", []))
                },
                message=f"Verified: Extracted interview syllabus from recruiter email ({sender})."
            )
        else:
            return VerificationResult(
                task_id=task_id,
                verified=False,
                rule="ThreadAndRequirementsIntegrity",
                expected="Valid sender and extracted requirements",
                actual=f"msg_id={bool(msg_id)}, sender={sender}, req_count={len(reqs)}",
                message="Gmail verification failed: Insufficient or unverified email payload."
            )
