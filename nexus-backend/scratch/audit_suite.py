import asyncio
import json
import httpx
import websockets

async def audit():
    results = {}
    base_url = "http://127.0.0.1:8000"
    
    # Check 3: API responds
    try:
        async with httpx.AsyncClient(base_url=base_url) as client:
            resp_health = await client.get("/api/health")
            resp_int = await client.get("/api/integrations")
            results["api_responds"] = (resp_health.status_code == 200 and resp_int.status_code == 200)
    except Exception as e:
        results["api_responds"] = False
        print("API error:", e)

    # Check 4, 6, 7: Mission execution in DEMO MODE & DAG completion & verification
    mission_id = None
    try:
        async with httpx.AsyncClient(base_url=base_url) as client:
            create_resp = await client.post("/api/missions", json={
                "goal": "Prepare me for tomorrow's technical interview at Acme.",
                "mode": "DEMO"
            })
            mission_data = create_resp.json()
            mission_id = mission_data["mission_id"]
            
            # Execute
            exec_resp = await client.post(f"/api/missions/{mission_id}/execute", json={"auto_approve": True})
            final_mission = exec_resp.json()
            
            results["mission_execution_demo"] = (final_mission.get("mode") == "DEMO")
            results["dag_reaches_completion"] = (final_mission.get("status") == "COMPLETED")
            results["verification_state_generated"] = (final_mission.get("verified_count", 0) >= 7 and "sha256_hash" in final_mission.get("final_report", {}).get("what_nexus_created", {}))
    except Exception as e:
        results["mission_execution_demo"] = False
        results["dag_reaches_completion"] = False
        results["verification_state_generated"] = False
        print("Mission execution error:", e)

    # Check 5: WebSocket events
    try:
        ws_url = f"ws://127.0.0.1:8000/ws/missions/{mission_id or 'test'}"
        async with websockets.connect(ws_url, open_timeout=5) as ws:
            results["websocket_events_work"] = True
    except Exception as e:
        results["websocket_events_work"] = False
        print("WebSocket error:", e)

    # Check 8: Reliability console loads
    try:
        async with httpx.AsyncClient(base_url=base_url) as client:
            resp_eval = await client.get("/api/evaluations/latest")
            data = resp_eval.json()
            results["reliability_console_loads"] = ("metrics" in data and "test_records" in data)
    except Exception as e:
        results["reliability_console_loads"] = False
        print("Reliability error:", e)

    # Check 9, 10: Architecture & Integrations pages (served at root with React)
    try:
        async with httpx.AsyncClient(base_url=base_url) as client:
            resp_root = await client.get("/")
            results["frontend_serves_pages"] = (resp_root.status_code == 200 and "NEXUS" in resp_root.text)
    except Exception as e:
        results["frontend_serves_pages"] = False

    print("\n--- FINAL AUDIT RESULTS ---")
    for k, v in results.items():
        print(f"{k}: {'PASS' if v else 'FAIL'}")

if __name__ == "__main__":
    asyncio.run(audit())
