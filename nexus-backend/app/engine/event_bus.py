import asyncio
from typing import Dict, List, Any
from fastapi import WebSocket

class EventBus:
    """Pub/Sub event broadcaster for real-time mission execution streaming."""

    def __init__(self):
        self._subscribers: Dict[str, List[WebSocket]] = {}
        self._history: Dict[str, List[Dict[str, Any]]] = {}

    async def connect(self, mission_id: str, websocket: WebSocket):
        await websocket.accept()
        if mission_id not in self._subscribers:
            self._subscribers[mission_id] = []
        self._subscribers[mission_id].append(websocket)
        
        # Send cached history on connect
        if mission_id in self._history:
            for event in self._history[mission_id]:
                await websocket.send_json(event)

    def disconnect(self, mission_id: str, websocket: WebSocket):
        if mission_id in self._subscribers and websocket in self._subscribers[mission_id]:
            self._subscribers[mission_id].remove(websocket)

    async def broadcast(self, mission_id: str, event_type: str, data: Dict[str, Any]):
        event = {
            "type": event_type,
            "mission_id": mission_id,
            "data": data
        }
        if mission_id not in self._history:
            self._history[mission_id] = []
        self._history[mission_id].append(event)

        if mission_id in self._subscribers:
            dead_sockets = []
            for ws in self._subscribers[mission_id]:
                try:
                    await ws.send_json(event)
                except Exception:
                    dead_sockets.append(ws)
            for ds in dead_sockets:
                self._subscribers[mission_id].remove(ds)

    def get_events(self, mission_id: str) -> List[Dict[str, Any]]:
        return self._history.get(mission_id, [])

event_bus = EventBus()
