from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import json

app = FastAPI(title="Agentic Data Intelligence API")

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

@app.get("/")
def read_root():
    return {"message": "Agentic Data Intelligence API is running"}

@app.websocket("/ws/agent-logs")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Just keeping the connection alive and listening for client messages if any
            data = await websocket.receive_text()
            await manager.broadcast(f"Client message: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.post("/api/upload")
async def upload_dataset():
    # Placeholder for file upload
    return {"status": "Dataset uploaded and versioned"}

@app.post("/api/workflow/start")
async def start_workflow(goal: str):
    # Placeholder for triggering LangGraph Master Agent
    # In reality, this would run the graph and yield events to the WebSocket
    return {"status": "Workflow started", "goal": goal}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
