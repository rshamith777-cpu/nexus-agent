import time
from typing import Dict, Any, Tuple
from app.core.state import TaskNode

class RecoveryAgent:
    """Diagnoses task execution or verification failures, modifies queries, and devises recovery strategies."""

    @staticmethod
    def diagnose_and_recover(task: TaskNode, failure_reason: str) -> Tuple[bool, str, Dict[str, Any]]:
        """
        Returns:
            can_recover: bool
            strategy_name: str
            modified_payload: Dict[str, Any]
        """
        task.retry_count += 1
        if task.retry_count > task.max_retries:
            return False, "MAX_RETRIES_EXCEEDED", {}

        reason_lower = failure_reason.lower()

        # Strategy 1: Broaden search query if search was too narrow
        if "not found" in reason_lower or "empty" in reason_lower or "no matching" in reason_lower:
            new_payload = dict(task.input_payload)
            if "query" in new_payload:
                old_query = new_payload["query"]
                # Simplify to base terms
                simplified = " ".join(old_query.split()[:2])
                new_payload["query"] = simplified
                return True, "BROADEN_SEARCH_QUERY", new_payload
            if "organization" in new_payload:
                # Fallback to general repo lookup
                new_payload["fallback_to_trending"] = True
                return True, "FALLBACK_ORGANIZATION_SCOPE", new_payload

        # Strategy 2: Rate limiting or transient timeout -> Backoff
        if "rate limit" in reason_lower or "429" in reason_lower or "timeout" in reason_lower:
            backoff_seconds = (2 ** task.retry_count) * 0.5
            time.sleep(backoff_seconds)
            return True, "EXPONENTIAL_BACKOFF_RETRY", task.input_payload

        # Strategy 3: Provider unavailable -> Fallback provider
        if "slack" in task.tool and ("failure" in reason_lower or "unreachable" in reason_lower):
            # Fallback to internal dispatch
            new_payload = dict(task.input_payload)
            new_payload["channel"] = "#general-alerts"
            return True, "FALLBACK_NOTIFICATION_CHANNEL", new_payload

        # Default retry
        return True, "STANDARD_RETRY_WITH_TELEMETRY", task.input_payload
