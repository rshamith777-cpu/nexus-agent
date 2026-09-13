from typing import Dict, Optional
from app.tools.base import BaseTool
from app.tools.calendar_tool import CalendarFindInterviewTool
from app.tools.gmail_tool import GmailSearchThreadTool
from app.tools.github_tool import GitHubAnalyzeRepositoryTool
from app.tools.research_tool import WebResearchCompanyTool
from app.tools.document_tool import DocumentCreateBriefingTool
from app.tools.slack_tool import SlackSendNotificationTool

_TOOLS: Dict[str, BaseTool] = {
    "calendar.find_interview": CalendarFindInterviewTool(),
    "gmail.search_thread": GmailSearchThreadTool(),
    "github.analyze_repository": GitHubAnalyzeRepositoryTool(),
    "web.research_company": WebResearchCompanyTool(),
    "document.create_briefing": DocumentCreateBriefingTool(),
    "slack.send_notification": SlackSendNotificationTool(),
}

def get_tool(tool_name: str) -> Optional[BaseTool]:
    return _TOOLS.get(tool_name)

def list_tools() -> Dict[str, str]:
    return {name: tool.description for name, tool in _TOOLS.items()}
