import re
from typing import Dict, Any

class CommanderAgent:
    """Understands user objectives, parses outcomes, extracts entities and establishes constraints."""
    
    @staticmethod
    def parse_objective(goal: str) -> Dict[str, Any]:
        # Extract company name or default to Acme
        match = re.search(r"\b(?:at|for|with)\s+([A-Z][a-zA-Z0-9_\-]+)", goal)
        company = match.group(1) if match else "Acme"
        
        # Determine target intent
        is_interview = any(w in goal.lower() for w in ["interview", "prepare", "briefing", "study"])
        urgency = "high" if any(w in goal.lower() for w in ["tomorrow", "today", "urgent", "soon"]) else "normal"
        
        return {
            "target_company": company,
            "mission_type": "INTERVIEW_PREPARATION" if is_interview else "GENERAL_WORKFLOW",
            "urgency": urgency,
            "required_integrations": ["Google Calendar", "Gmail", "GitHub", "Web Research", "Slack"],
            "requires_briefing_doc": True,
            "requires_notification": True,
            "verification_policy": "STRICT_AUDIT",
            "extracted_constraints": {
                "max_retries_per_action": 2,
                "human_approval_on_external_messages": True
            }
        }
