import os
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Dict, Any, Optional, List

from app.core.config import settings
from app.core.state import Mission, MissionStatus
from app.engine.orchestrator import orchestrator
from app.engine.event_bus import event_bus
from app.evaluations.runner import evaluation_runner
from app.evaluations.scenarios import EVALUATION_SCENARIOS

app = FastAPI(
    title="NEXUS Mission Control API",
    description="Autonomous goal-driven multi-agent mission control with verification-first reliability.",
    version=settings.APP_VERSION
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount artifacts folder
app.mount("/artifacts", StaticFiles(directory=settings.ARTIFACTS_DIR), name="artifacts")

# Request Models
class CreateMissionRequest(BaseModel):
    goal: str
    mode: Optional[str] = "DEMO" # "DEMO" or "LIVE"
    auto_execute: Optional[bool] = False

class ExecuteMissionRequest(BaseModel):
    auto_approve: Optional[bool] = True

class ApproveTaskRequest(BaseModel):
    task_id: str

@app.get("/api/health")
def root():
    return {
        "service": "NEXUS Mission Control",
        "tagline": "Turn outcomes into verified actions across your apps.",
        "version": settings.APP_VERSION,
        "status": "operational",
        "mode": settings.DEFAULT_MODE
    }

@app.post("/api/missions")
async def create_mission(req: CreateMissionRequest):
    if not req.goal.strip():
        raise HTTPException(status_code=400, detail="Goal cannot be empty")
    
    mission = orchestrator.create_mission(goal=req.goal, mode=req.mode or "DEMO")
    await orchestrator.initialize_and_plan(mission.id)
    
    if req.auto_execute:
        # Launch execution as non-blocking background task
        import asyncio
        asyncio.create_task(orchestrator.execute_mission(mission.id, auto_approve_write_actions=True))
        
    return {
        "mission_id": mission.id,
        "status": mission.status,
        "goal": mission.goal,
        "tasks_count": len(mission.tasks),
        "mission": mission.model_dump(mode="json")
    }

@app.get("/api/missions")
def list_missions():
    return [
        {
            "id": m.id,
            "goal": m.goal,
            "status": m.status,
            "mode": m.mode,
            "created_at": m.created_at.isoformat(),
            "tasks_count": len(m.tasks),
            "verified_count": m.verified_count
        }
        for m in reversed(list(orchestrator.missions.values()))
    ]

@app.get("/api/missions/{mission_id}")
def get_mission(mission_id: str):
    mission = orchestrator.missions.get(mission_id)
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")
    return mission.model_dump(mode="json")

@app.post("/api/missions/{mission_id}/execute")
async def execute_mission(mission_id: str, req: ExecuteMissionRequest = ExecuteMissionRequest()):
    mission = orchestrator.missions.get(mission_id)
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")
    
    # Run execution
    updated = await orchestrator.execute_mission(mission_id, auto_approve_write_actions=req.auto_approve)
    return updated.model_dump(mode="json")

@app.post("/api/missions/{mission_id}/approve")
async def approve_task(mission_id: str, req: ApproveTaskRequest):
    try:
        updated = await orchestrator.approve_task(mission_id, req.task_id)
        return updated.model_dump(mode="json")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/missions/{mission_id}/graph")
def get_mission_graph(mission_id: str):
    mission = orchestrator.missions.get(mission_id)
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")

    nodes = []
    edges = []

    for task_id, task in mission.tasks.items():
        nodes.append({
            "id": task.id,
            "label": task.title,
            "agent": task.agent,
            "tool": task.tool,
            "status": task.status,
            "verification_state": task.verification_state,
            "duration_ms": task.duration_ms,
            "error": task.error
        })
        for dep in task.dependencies:
            edges.append({
                "from": dep,
                "to": task.id
            })

    return {"nodes": nodes, "edges": edges}

@app.get("/api/missions/{mission_id}/report")
def get_mission_report(mission_id: str):
    mission = orchestrator.missions.get(mission_id)
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")
    return mission.final_report

@app.get("/api/integrations")
def get_integrations_status():
    return [
        {
            "id": "google_calendar",
            "name": "Google Calendar",
            "type": "CALENDAR",
            "configured": bool(settings.GOOGLE_CALENDAR_CREDENTIALS_JSON),
            "status": "LIVE" if settings.GOOGLE_CALENDAR_CREDENTIALS_JSON else "DEMO_READY",
            "description": "Scans interviews, agendas, and participant schedules"
        },
        {
            "id": "gmail",
            "name": "Gmail",
            "type": "EMAIL",
            "configured": bool(settings.GMAIL_CREDENTIALS_JSON),
            "status": "LIVE" if settings.GMAIL_CREDENTIALS_JSON else "DEMO_READY",
            "description": "Inspects recruiter threads, role specifications, and attachments"
        },
        {
            "id": "github",
            "name": "GitHub",
            "type": "CODE_REPOSITORY",
            "configured": bool(settings.GITHUB_TOKEN),
            "status": "LIVE" if settings.GITHUB_TOKEN else "DEMO_READY",
            "description": "Analyzes architecture, commits, languages, and technical patterns"
        },
        {
            "id": "slack",
            "name": "Slack",
            "type": "MESSAGING",
            "configured": bool(settings.SLACK_WEBHOOK_URL or settings.SLACK_BOT_TOKEN),
            "status": "LIVE" if (settings.SLACK_WEBHOOK_URL or settings.SLACK_BOT_TOKEN) else "DEMO_READY",
            "description": "Delivers completion briefs with human-in-the-loop verification"
        },
        {
            "id": "n8n",
            "name": "n8n Automation Engine",
            "type": "WORKFLOW_AUTOMATION",
            "configured": bool(settings.N8N_WEBHOOK_URL),
            "status": "WORKFLOW_READY",
            "description": "Deterministic multi-app webhooks and scheduled pipelines"
        }
    ]

@app.post("/api/evaluations/run")
async def run_evaluation_suite(limit: int = Query(default=28, ge=1, le=28)):
    results = await evaluation_runner.run_suite(limit=limit)
    return results

@app.get("/api/evaluations/latest")
async def get_latest_evaluations():
    if not evaluation_runner.latest_results:
        # Run a fast 5-scenario pass if none yet
        results = await evaluation_runner.run_suite(limit=8)
        return results
    return evaluation_runner.latest_results

@app.websocket("/ws/missions/{mission_id}")
async def websocket_endpoint(websocket: WebSocket, mission_id: str):
    await event_bus.connect(mission_id, websocket)
    try:
        while True:
            # Keep alive and listen for client messages
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        event_bus.disconnect(mission_id, websocket)

# Mount static frontend production build if available
frontend_dist = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "nexus-frontend", "dist")
if os.path.exists(frontend_dist):
    app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="frontend")
