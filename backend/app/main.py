from fastapi import FastAPI, WebSocket, WebSocketDisconnect, UploadFile, File, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import json
import os

from services.data_manager import data_manager
from services.agent_service import agent_service

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

@app.post("/api/dataset/upload")
async def upload_dataset(file: UploadFile = File(...)):
    if not file.filename.endswith(('.csv', '.parquet')):
        raise HTTPException(status_code=400, detail="Only CSV and Parquet files are supported")
    
    contents = await file.read()
    result = data_manager.load_dataset_from_bytes(contents, file.filename)
    return result

@app.get("/api/dataset/{dataset_id}/preview")
async def get_dataset_preview(dataset_id: str):
    df = data_manager.load_version(dataset_id)
    if df is None:
        raise HTTPException(status_code=404, detail="Dataset not found")
        
    metadata = data_manager.get_dataset_metadata(df)
    return {
        "dataset_id": dataset_id,
        "metadata": metadata
    }

@app.get("/api/stats")
async def get_dashboard_stats():
    # Return mock but dynamic-looking stats for the dashboard overview
    return {
        "dataset_health": {
            "score": 87,
            "rows": 125000,
            "columns": 42,
            "missing_pct": 2.4,
            "duplicates_pct": 1.1,
            "outliers_pct": 3.7,
            "pii_cols": 4
        },
        "active_agents": {
            "total": 5,
            "max": 9,
            "agents": [
                {"name": "Master Agent", "status": "ACTIVE"},
                {"name": "Profiling Agent", "status": "ACTIVE"},
                {"name": "Synthetic Data Agent", "status": "ACTIVE"},
                {"name": "ML Agent", "status": "ACTIVE"},
                {"name": "Validation Agent", "status": "ACTIVE"}
            ]
        },
        "model_performance": {
            "name": "XGBoost",
            "f1": 92,
            "auc": 96,
            "precision": 91,
            "recall": 94
        }
    }

class WorkflowRequest(BaseModel):
    goal: str
    dataset_id: str

@app.post("/api/workflow/start")
async def start_workflow(req: WorkflowRequest, background_tasks: BackgroundTasks):
    background_tasks.add_task(agent_service.run_workflow, req.goal, manager, req.dataset_id)
    return {"status": "Workflow started in background", "goal": req.goal}

@app.get("/api/dictionary")
async def get_dictionary():
    return {
        "columns": [
            {"name": "customer_id", "type": "UUID", "description": "Unique identifier", "risk": "High"},
            {"name": "age", "type": "Integer", "description": "Customer age in years", "risk": "Low"},
            {"name": "balance", "type": "Float", "description": "Current account balance", "risk": "Medium"},
            {"name": "churn", "type": "Boolean", "description": "Target variable", "risk": "Low"}
        ]
    }

@app.get("/api/features")
async def get_features():
    return {
        "suggested_features": [
            {"name": "balance_per_age", "formula": "balance / age", "impact": "High", "status": "Pending"},
            {"name": "is_senior", "formula": "age > 65", "impact": "Medium", "status": "Applied"},
            {"name": "tenure_years", "formula": "tenure_months / 12", "impact": "Low", "status": "Applied"}
        ]
    }

@app.get("/api/synthetic")
async def get_synthetic_stats():
    return {
        "methods_available": ["SMOTE", "CTGAN", "Gaussian Copula"],
        "current_job": {
            "status": "Ready",
            "last_run": "2 hours ago",
            "records_generated": 5000,
            "fidelity_score": 94.2
        }
    }

@app.get("/api/experiments")
async def get_experiments():
    return {
        "runs": [
            {"id": "Exp 05", "name": "Optimized Pipeline", "model": "XGBoost", "feats": "42 + 17 generated", "pre": "SMOTE + Scaled", "f1": "92%", "auc": "96%", "time": "18s", "isBest": True},
            {"id": "Exp 04", "name": "Synthetic + Feature Eng", "model": "Random Forest", "feats": "42 + 17 generated", "pre": "SMOTE", "f1": "89%", "auc": "93%", "time": "24s", "isBest": False},
            {"id": "Exp 03", "name": "Class Balancing", "model": "XGBoost", "feats": "42 original", "pre": "SMOTE", "f1": "86%", "auc": "90%", "time": "15s", "isBest": False},
            {"id": "Exp 02", "name": "Feature Engineering", "model": "Logistic Reg", "feats": "42 + 17 generated", "pre": "Scaled", "f1": "82%", "auc": "86%", "time": "4s", "isBest": False},
            {"id": "Exp 01", "name": "Baseline", "model": "Logistic Reg", "feats": "42 original", "pre": "None", "f1": "76%", "auc": "80%", "time": "2s", "isBest": False}
        ]
    }

@app.get("/api/predictions")
async def get_predictions():
    return {
        "batch_status": "Ready",
        "recent_predictions": [
            {"id": "CUST_001", "probability": 0.89, "prediction": "Churn", "confidence": "High"},
            {"id": "CUST_002", "probability": 0.12, "prediction": "Stay", "confidence": "High"},
            {"id": "CUST_003", "probability": 0.45, "prediction": "Stay", "confidence": "Low"},
            {"id": "CUST_004", "probability": 0.76, "prediction": "Churn", "confidence": "Medium"}
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
