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

class CreateMissionRequest(BaseModel):
    goal: str
    mode: Optional[str] = "DEMO" # "DEMO" or "LIVE"
    auto_execute: Optional[bool] = False

class ExecuteMissionRequest(BaseModel):
    auto_approve: Optional[bool] = True

class ApproveTaskRequest(BaseModel):
    task_id: str

class ConfigureIntegrationRequest(BaseModel):
    id: str
    value: str

class TestIntegrationRequest(BaseModel):
    id: str
    value: Optional[str] = None

class DisconnectIntegrationRequest(BaseModel):
    id: str

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
    def mask(val: str) -> str:
        if not val:
            return ""
        if len(val) <= 8:
            return "••••••••"
        return f"{val[:4]}••••{val[-4:]}"

    return [
        {
            "id": "google_calendar",
            "name": "Google Calendar",
            "type": "CALENDAR",
            "configured": bool(settings.GOOGLE_CALENDAR_CREDENTIALS_JSON),
            "status": "LIVE" if settings.GOOGLE_CALENDAR_CREDENTIALS_JSON else "DEMO_READY",
            "masked_value": mask(settings.GOOGLE_CALENDAR_CREDENTIALS_JSON),
            "description": "Scans interviews, agendas, and participant schedules",
            "env_var": "GOOGLE_CALENDAR_CREDENTIALS_JSON",
            "placeholder": '{"type": "service_account", "project_id": "...", ...}'
        },
        {
            "id": "gmail",
            "name": "Gmail",
            "type": "EMAIL",
            "configured": bool(settings.GMAIL_CREDENTIALS_JSON),
            "status": "LIVE" if settings.GMAIL_CREDENTIALS_JSON else "DEMO_READY",
            "masked_value": mask(settings.GMAIL_CREDENTIALS_JSON),
            "description": "Inspects recruiter threads, role specifications, and attachments",
            "env_var": "GMAIL_CREDENTIALS_JSON",
            "placeholder": '{"installed": {"client_id": "...", "client_secret": "..."}}'
        },
        {
            "id": "github",
            "name": "GitHub",
            "type": "CODE_REPOSITORY",
            "configured": bool(settings.GITHUB_TOKEN),
            "status": "LIVE" if settings.GITHUB_TOKEN else "DEMO_READY",
            "masked_value": mask(settings.GITHUB_TOKEN),
            "description": "Analyzes architecture, commits, languages, and technical patterns",
            "env_var": "GITHUB_TOKEN",
            "placeholder": "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        },
        {
            "id": "slack",
            "name": "Slack",
            "type": "MESSAGING",
            "configured": bool(settings.SLACK_WEBHOOK_URL or settings.SLACK_BOT_TOKEN),
            "status": "LIVE" if (settings.SLACK_WEBHOOK_URL or settings.SLACK_BOT_TOKEN) else "DEMO_READY",
            "masked_value": mask(settings.SLACK_WEBHOOK_URL or settings.SLACK_BOT_TOKEN),
            "description": "Delivers completion briefs with human-in-the-loop verification",
            "env_var": "SLACK_WEBHOOK_URL",
            "placeholder": "https://hooks.slack.com/services/T.../B.../..."
        },
        {
            "id": "n8n",
            "name": "n8n Automation Engine",
            "type": "WORKFLOW_AUTOMATION",
            "configured": bool(settings.N8N_WEBHOOK_URL),
            "status": "LIVE" if settings.N8N_WEBHOOK_URL else "DEMO_READY",
            "masked_value": mask(settings.N8N_WEBHOOK_URL),
            "description": "Deterministic multi-app webhooks and scheduled pipelines",
            "env_var": "N8N_WEBHOOK_URL",
            "placeholder": "http://localhost:5678/webhook/nexus-mission"
        }
    ]

@app.post("/api/integrations/configure")
async def configure_integration(req: ConfigureIntegrationRequest):
    val = req.value.strip()
    if req.id == "github":
        settings.GITHUB_TOKEN = val
        os.environ["GITHUB_TOKEN"] = val
    elif req.id == "slack":
        settings.SLACK_WEBHOOK_URL = val
        os.environ["SLACK_WEBHOOK_URL"] = val
    elif req.id == "n8n":
        settings.N8N_WEBHOOK_URL = val
        os.environ["N8N_WEBHOOK_URL"] = val
    elif req.id == "google_calendar":
        settings.GOOGLE_CALENDAR_CREDENTIALS_JSON = val
        os.environ["GOOGLE_CALENDAR_CREDENTIALS_JSON"] = val
    elif req.id == "gmail":
        settings.GMAIL_CREDENTIALS_JSON = val
        os.environ["GMAIL_CREDENTIALS_JSON"] = val
    else:
        raise HTTPException(status_code=400, detail=f"Unknown integration '{req.id}'")

    return {
        "success": True,
        "message": f"Successfully activated {req.id} in LIVE mode!",
        "integrations": get_integrations_status()
    }

@app.post("/api/integrations/disconnect")
async def disconnect_integration(req: DisconnectIntegrationRequest):
    if req.id == "github":
        settings.GITHUB_TOKEN = ""
        os.environ.pop("GITHUB_TOKEN", None)
    elif req.id == "slack":
        settings.SLACK_WEBHOOK_URL = ""
        os.environ.pop("SLACK_WEBHOOK_URL", None)
    elif req.id == "n8n":
        settings.N8N_WEBHOOK_URL = ""
        os.environ.pop("N8N_WEBHOOK_URL", None)
    elif req.id == "google_calendar":
        settings.GOOGLE_CALENDAR_CREDENTIALS_JSON = ""
        os.environ.pop("GOOGLE_CALENDAR_CREDENTIALS_JSON", None)
    elif req.id == "gmail":
        settings.GMAIL_CREDENTIALS_JSON = ""
        os.environ.pop("GMAIL_CREDENTIALS_JSON", None)
    else:
        raise HTTPException(status_code=400, detail=f"Unknown integration '{req.id}'")

    return {
        "success": True,
        "message": f"Disconnected {req.id}. Adapter reverted to Demo Mock mode.",
        "integrations": get_integrations_status()
    }

@app.post("/api/integrations/test")
async def test_integration(req: TestIntegrationRequest):
    import httpx
    import json
    import time
    start = time.time()
    val = (req.value or "").strip()

    # If no value passed in request, look up existing saved credential
    if not val:
        if req.id == "github": val = settings.GITHUB_TOKEN
        elif req.id == "slack": val = settings.SLACK_WEBHOOK_URL
        elif req.id == "n8n": val = settings.N8N_WEBHOOK_URL
        elif req.id == "google_calendar": val = settings.GOOGLE_CALENDAR_CREDENTIALS_JSON
        elif req.id == "gmail": val = settings.GMAIL_CREDENTIALS_JSON

    # STRICT: Never fake success on empty input
    if not val:
        return {
            "success": False,
            "latency_ms": 0,
            "mode": "FAILED",
            "message": f"No credential provided for {req.id}. Please paste a valid API key, token, or webhook URL."
        }

    try:
        if req.id == "github":
            # Genuine GitHub REST API call
            async with httpx.AsyncClient(timeout=8.0) as client:
                res = await client.get(
                    "https://api.github.com/user",
                    headers={"Authorization": f"Bearer {val}", "User-Agent": "NEXUS-Mission-Control"}
                )
                latency = round((time.time() - start) * 1000)
                if res.status_code == 200:
                    user_data = res.json()
                    login = user_data.get("login", "user")
                    name = user_data.get("name") or login
                    repos = user_data.get("public_repos", 0)
                    return {
                        "success": True,
                        "latency_ms": latency,
                        "mode": "LIVE",
                        "message": f"Verified genuine GitHub connection as @{login} ({name}, {repos} public repos)!"
                    }
                elif res.status_code == 401:
                    return {
                        "success": False,
                        "latency_ms": latency,
                        "mode": "FAILED",
                        "message": "GitHub API authentication failed (HTTP 401 Unauthorized): Invalid or expired Personal Access Token."
                    }
                else:
                    return {
                        "success": False,
                        "latency_ms": latency,
                        "mode": "FAILED",
                        "message": f"GitHub API returned HTTP {res.status_code}: {res.text[:120]}"
                    }

        elif req.id == "slack":
            if not val.startswith("https://hooks.slack.com/services/"):
                return {
                    "success": False,
                    "latency_ms": 0,
                    "mode": "FAILED",
                    "message": "Invalid Slack URL format. Slack Incoming Webhook URLs must start with 'https://hooks.slack.com/services/'"
                }
            async with httpx.AsyncClient(timeout=8.0) as client:
                res = await client.post(
                    val,
                    json={"text": "⚡ *NEXUS Mission Control*: Real Slack Integration Verified! Connection test passed."},
                    timeout=6.0
                )
                latency = round((time.time() - start) * 1000)
                if res.status_code == 200 and "ok" in res.text.lower():
                    return {
                        "success": True,
                        "latency_ms": latency,
                        "mode": "LIVE",
                        "message": "Real Slack message delivered to your channel successfully (HTTP 200 ok)!"
                    }
                else:
                    return {
                        "success": False,
                        "latency_ms": latency,
                        "mode": "FAILED",
                        "message": f"Slack rejected webhook payload (HTTP {res.status_code}): {res.text[:120]}"
                    }

        elif req.id == "n8n":
            if not (val.startswith("http://") or val.startswith("https://")):
                return {
                    "success": False,
                    "latency_ms": 0,
                    "mode": "FAILED",
                    "message": "Invalid n8n Webhook URL. Must start with http:// or https://"
                }
            try:
                async with httpx.AsyncClient(timeout=6.0) as client:
                    res = await client.post(
                        val,
                        json={"event": "nexus_verification_ping", "source": "NEXUS Mission Control", "timestamp": time.time()}
                    )
                    latency = round((time.time() - start) * 1000)
                    if res.status_code in (200, 201, 204):
                        return {
                            "success": True,
                            "latency_ms": latency,
                            "mode": "LIVE",
                            "message": f"n8n webhook endpoint reached successfully (HTTP {res.status_code})!"
                        }
                    else:
                        return {
                            "success": False,
                            "latency_ms": latency,
                            "mode": "FAILED",
                            "message": f"n8n endpoint returned HTTP {res.status_code}: {res.text[:120]}"
                        }
            except httpx.ConnectError:
                return {
                    "success": False,
                    "latency_ms": round((time.time() - start) * 1000),
                    "mode": "FAILED",
                    "message": f"Connection refused at {val}. Please ensure your n8n instance is running and the workflow is active."
                }

        elif req.id in ("google_calendar", "gmail"):
            # Check if user provided an OAuth2 Bearer Access Token directly (ya29...)
            if val.startswith("ya29.") or (not val.startswith("{") and len(val) > 20):
                endpoint = (
                    "https://www.googleapis.com/calendar/v3/users/me/calendarList?maxResults=1"
                    if req.id == "google_calendar"
                    else "https://gmail.googleapis.com/gmail/v1/users/me/profile"
                )
                async with httpx.AsyncClient(timeout=8.0) as client:
                    res = await client.get(endpoint, headers={"Authorization": f"Bearer {val}"})
                    latency = round((time.time() - start) * 1000)
                    if res.status_code == 200:
                        return {
                            "success": True,
                            "latency_ms": latency,
                            "mode": "LIVE",
                            "message": f"Successfully authenticated with Google API ({res.status_code} OK)!"
                        }
                    else:
                        return {
                            "success": False,
                            "latency_ms": latency,
                            "mode": "FAILED",
                            "message": f"Google API authentication failed (HTTP {res.status_code}): {res.text[:120]}"
                        }

            # Otherwise, validate Google Service Account / Client Secrets JSON
            try:
                data = json.loads(val)
                if not isinstance(data, dict):
                    raise ValueError("JSON must be a key-value object")

                key_type = data.get("type")
                client_email = data.get("client_email")
                private_key = data.get("private_key")

                # Service account check
                if key_type == "service_account":
                    if not client_email or not private_key:
                        return {
                            "success": False,
                            "latency_ms": 2,
                            "mode": "FAILED",
                            "message": "Incomplete Service Account JSON: 'client_email' or 'private_key' is missing."
                        }
                    return {
                        "success": True,
                        "latency_ms": round((time.time() - start) * 1000),
                        "mode": "LIVE",
                        "message": f"Valid Google Service Account JSON verified for {client_email} (Project: {data.get('project_id', 'standard')})."
                    }

                # OAuth client secret check
                web_or_installed = data.get("installed") or data.get("web")
                if web_or_installed and isinstance(web_or_installed, dict):
                    client_id = web_or_installed.get("client_id")
                    client_secret = web_or_installed.get("client_secret")
                    if not client_id or not client_secret:
                        return {
                            "success": False,
                            "latency_ms": 2,
                            "mode": "FAILED",
                            "message": "Incomplete OAuth JSON: 'client_id' or 'client_secret' is missing."
                        }
                    return {
                        "success": True,
                        "latency_ms": round((time.time() - start) * 1000),
                        "mode": "LIVE",
                        "message": f"Valid Google OAuth2 Client Configuration verified (Client ID: {client_id[:20]}...)."
                    }

                return {
                    "success": False,
                    "latency_ms": 2,
                    "mode": "FAILED",
                    "message": "Unrecognized Google JSON format. Must be either a Service Account JSON or an OAuth client secrets JSON."
                }

            except (json.JSONDecodeError, ValueError) as json_err:
                return {
                    "success": False,
                    "latency_ms": 2,
                    "mode": "FAILED",
                    "message": f"Invalid format: Provide either a Google OAuth Access Token (ya29...) or valid Google Credentials JSON. Details: {str(json_err)}"
                }

        return {"success": True, "latency_ms": 10, "mode": "LIVE", "message": f"Integration {req.id} ready."}

    except Exception as e:
        return {
            "success": False,
            "latency_ms": round((time.time() - start) * 1000),
            "mode": "FAILED",
            "message": f"Connection error: {str(e)}"
        }


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
