from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, list[WebSocket]] = {}
        # Also maintain a general broadcast list for the dashboard if needed
        self.general_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket, workflow_id: str = None):
        await websocket.accept()
        if workflow_id:
            if workflow_id not in self.active_connections:
                self.active_connections[workflow_id] = []
            self.active_connections[workflow_id].append(websocket)
        else:
            self.general_connections.append(websocket)

    def disconnect(self, websocket: WebSocket, workflow_id: str = None):
        if workflow_id:
            if workflow_id in self.active_connections and websocket in self.active_connections[workflow_id]:
                self.active_connections[workflow_id].remove(websocket)
        else:
            if websocket in self.general_connections:
                self.general_connections.remove(websocket)

    async def broadcast_to_workflow(self, workflow_id: str, message: dict):
        if workflow_id in self.active_connections:
            for connection in self.active_connections[workflow_id]:
                try:
                    await connection.send_json(message)
                except Exception as e:
                    logger.error(f"Error broadcasting to workflow: {e}")

    async def broadcast_general(self, message: dict):
        for connection in self.general_connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                logger.error(f"Error broadcasting general: {e}")

manager = ConnectionManager()

# This endpoint handles the legacy /ws/agent-logs as well as general dashboard
@router.websocket("/ws/agent-logs")
async def websocket_general(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@router.websocket("/ws/workflow/{workflow_id}")
async def websocket_workflow(websocket: WebSocket, workflow_id: str):
    await manager.connect(websocket, workflow_id)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, workflow_id)
