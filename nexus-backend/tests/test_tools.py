import pytest
from app.tools.calendar_tool import CalendarFindInterviewTool
from app.tools.gmail_tool import GmailSearchThreadTool
from app.tools.github_tool import GitHubAnalyzeRepositoryTool
from app.tools.document_tool import DocumentCreateBriefingTool
from app.tools.slack_tool import SlackSendNotificationTool

@pytest.mark.asyncio
async def test_calendar_tool_execution_and_verification():
    tool = CalendarFindInterviewTool()
    payload = {"company": "Acme", "query": "Acme interview"}
    context = {"mission_id": "test_m1", "task_id": "task_calendar"}
    
    result = await tool.execute(payload, context, mode="DEMO")
    assert result.success is True
    assert "evt_acme" in result.data["event_id"]
    assert len(result.data["interviewers"]) >= 2
    
    v_res = await tool.verify(result, payload, context)
    assert v_res.verified is True
    assert "Verified:" in v_res.message

@pytest.mark.asyncio
async def test_gmail_tool_execution_and_verification():
    tool = GmailSearchThreadTool()
    payload = {"company": "Acme"}
    context = {"mission_id": "test_m1", "task_id": "task_gmail"}
    
    result = await tool.execute(payload, context, mode="DEMO")
    assert result.success is True
    assert len(result.data["key_requirements"]) >= 3
    
    v_res = await tool.verify(result, payload, context)
    assert v_res.verified is True

@pytest.mark.asyncio
async def test_github_tool_execution_and_verification():
    tool = GitHubAnalyzeRepositoryTool()
    payload = {"organization": "acme-corp", "company": "Acme"}
    context = {"mission_id": "test_m1", "task_id": "task_github"}
    
    result = await tool.execute(payload, context, mode="DEMO")
    assert result.success is True
    assert len(result.data["repositories_analyzed"]) >= 2
    
    v_res = await tool.verify(result, payload, context)
    assert v_res.verified is True

@pytest.mark.asyncio
async def test_document_tool_execution_and_verification():
    tool = DocumentCreateBriefingTool()
    payload = {
        "company": "Acme",
        "calendar_data": {"start_time": "Tomorrow 10 AM", "interviewers": [{"name": "Sarah", "role": "Architect"}]},
        "gmail_data": {"key_requirements": ["Kafka", "Asyncio", "Idempotency"]},
        "github_data": {"repositories_analyzed": [{"name": "repo1"}]}
    }
    context = {"mission_id": "test_m1", "task_id": "task_document"}
    
    result = await tool.execute(payload, context, mode="DEMO")
    assert result.success is True
    assert result.data["sha256_hash"] is not None
    assert result.data["file_size_bytes"] > 2000
    
    v_res = await tool.verify(result, payload, context)
    assert v_res.verified is True

@pytest.mark.asyncio
async def test_slack_tool_execution_and_verification():
    tool = SlackSendNotificationTool()
    payload = {"company": "Acme", "channel": "#interview-prep"}
    context = {"mission_id": "test_m1", "task_id": "task_notification"}
    
    result = await tool.execute(payload, context, mode="DEMO")
    assert result.success is True
    assert result.data["http_status"] == 200
    
    v_res = await tool.verify(result, payload, context)
    assert v_res.verified is True
