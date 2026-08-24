from fastapi import FastAPI, WebSocket, WebSocketDisconnect, UploadFile, File, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import json
import os

from services.data_manager import data_manager
from services.agent_service import agent_service

from app.api.routes_approvals import router as approvals_router
from app.api.routes_incidents import router as incidents_router
from app.api.websocket import manager
from app.config import settings

# ── Logging ─────────────────────────────────────────────────
logging.basicConfig(
    level=getattr(logging, settings.log_level.upper(), logging.INFO),
    format="%(asctime)s %(levelname)-8s %(name)s  %(message)s",
)
logger = logging.getLogger(__name__)

# ── App ─────────────────────────────────────────────────────
app = FastAPI(
    title="Autonomous SRE Platform",
    description="AI-native multi-agent incident resolution backend.",
    version="1.0.0",
)

# ── CORS ────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── REST Routers ────────────────────────────────────────────
app.include_router(incidents_router)
app.include_router(approvals_router)


# ── WebSocket ───────────────────────────────────────────────
@app.websocket("/ws/incidents/{incident_id}")
async def websocket_endpoint(websocket: WebSocket, incident_id: str):
    """
    Subscribe to real-time events for a specific incident.

    The frontend connects here immediately after triggering an incident
    and receives structured JSON events until the incident is resolved
    or the connection is closed.
    """
    await manager.connect(websocket, incident_id)
    try:
        while True:
            # Keep the connection alive; the client can also send messages
            # (e.g., pings) which we silently consume.
            data = await websocket.receive_text()
            logger.debug("WS received from client (%s): %s", incident_id, data)
    except WebSocketDisconnect:
        await manager.disconnect(websocket, incident_id)
    except Exception:
        await manager.disconnect(websocket, incident_id)

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
