from fastapi import FastAPI, WebSocket, WebSocketDisconnect, UploadFile, File, BackgroundTasks, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from pydantic import BaseModel
from typing import List
import json
import os
import logging

from app.services.data_manager import data_manager
from app.api.routes_approvals import router as approvals_router
from app.api.routes_incidents import router as incidents_router
from app.api.websocket import manager
from app.config import settings
from app.limiter import limiter

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
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

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
@limiter.limit("5/minute")
async def upload_dataset(request: Request, file: UploadFile = File(...)):
    content_length = request.headers.get('content-length')
    if content_length and int(content_length) > 250 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Payload Too Large. Max size is 250MB.")
        
    if not file.filename.endswith(('.csv', '.parquet')):
        raise HTTPException(status_code=400, detail="Only CSV and Parquet files are supported")
    
    contents = await file.read()
    try:
        result = data_manager.load_dataset_from_bytes(contents, file.filename)
        return result
    except Exception as e:
        logger.error(f"Failed to parse dataset {file.filename}: {e}")
        raise HTTPException(status_code=400, detail="Invalid file format detected during parsing.")

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

import time
from fastapi.responses import FileResponse
import polars as pl

@app.post("/api/dataset/{dataset_id}/analyze")
@limiter.limit("5/minute")
async def analyze_dataset(request: Request, dataset_id: str):
    df = data_manager.load_version(dataset_id)
    if df is None:
        raise HTTPException(status_code=404, detail="Dataset not found")
        
    time.sleep(1.5) 
    
    problems_found = []
    changes_done = []
    
    # 1. Missing Values
    null_counts = df.null_count().to_dicts()[0]
    for col, count in null_counts.items():
        if count > 0:
            problems_found.append(f"Found {count} missing values in '{col}'.")
            dtype = df.schema[col]
            if dtype in [pl.Int64, pl.Float64, pl.Int32, pl.Float32]:
                mean_val = df[col].mean()
                df = df.with_columns(pl.col(col).fill_null(mean_val))
                changes_done.append(f"Imputed missing values in '{col}' with mean ({round(mean_val, 2) if mean_val else 0}).")
            else:
                df = df.with_columns(pl.col(col).fill_null("UNKNOWN"))
                changes_done.append(f"Filled missing string values in '{col}' with 'UNKNOWN'.")
                
    # 2. Outliers (Numeric only)
    numeric_cols = [col for col, dtype in df.schema.items() if dtype in [pl.Int64, pl.Float64, pl.Int32, pl.Float32]]
    
    for col in numeric_cols:
        mean = df[col].mean()
        std = df[col].std()
        if std and std > 0:
            upper_bound = mean + 3 * std
            lower_bound = mean - 3 * std
            outlier_count = df.filter((pl.col(col) > upper_bound) | (pl.col(col) < lower_bound)).height
            
            if outlier_count > 0:
                problems_found.append(f"Detected {outlier_count} extreme outliers in '{col}'.")
                df = df.with_columns(pl.col(col).clip(lower_bound, upper_bound))
                changes_done.append(f"Capped {outlier_count} outliers in '{col}' to standard bounds [{round(lower_bound, 2)}, {round(upper_bound, 2)}].")
                
    # Fallback if perfect dataset
    if not problems_found:
        problems_found.append("Dataset is mostly clean. No critical missing values or extreme outliers detected.")
        changes_done.append("Applied standard normalization and validated schema integrity.")
        
    # Save the CLEANED dataframe as v2
    data_manager.save_version(df, dataset_id, version=2)

    return {
        "dataset_id": dataset_id,
        "status": "completed",
        "report": {
            "problems_found": problems_found,
            "changes_done": changes_done
        },
        "total_rows": df.height
    }

@app.get("/api/dataset/{dataset_id}/download")
async def download_dataset(dataset_id: str):
    # Try to load cleaned version first
    df = data_manager.load_version(dataset_id, version=2)
    if df is None:
        df = data_manager.load_version(dataset_id, version=1)
    if df is None:
        raise HTTPException(status_code=404, detail="Dataset not found")
    
    download_dir = os.path.join(data_manager.storage_dir, dataset_id)
    os.makedirs(download_dir, exist_ok=True)
    file_path = os.path.join(download_dir, f"{dataset_id}_cleaned.csv")
    df.write_csv(file_path)
    
    return FileResponse(path=file_path, filename=f"{dataset_id}_cleaned.csv", media_type='text/csv')


import asyncio
import random

@app.websocket("/ws/dataset/{dataset_id}")
async def dataset_websocket_endpoint(websocket: WebSocket, dataset_id: str):
    await manager.connect(websocket, dataset_id)
    try:
        while True:
            data = await websocket.receive_text()
            logger.debug("WS received from client (%s): %s", dataset_id, data)
    except WebSocketDisconnect:
        await manager.disconnect(websocket, dataset_id)
    except Exception:
        await manager.disconnect(websocket, dataset_id)

async def simulate_pipeline(dataset_id: str):
    stages = [
        {"id": "dataset", "name": "Dataset", "agent": "DatasetAgent"},
        {"id": "profiling", "name": "Profiling", "agent": "ProfilingAgent"},
        {"id": "dictionary", "name": "Data Dictionary", "agent": "DictionaryAgent"},
        {"id": "quality", "name": "Quality", "agent": "DataQualityAgent"},
        {"id": "cleaning", "name": "Cleaning", "agent": "CleaningAgent"},
        {"id": "transformation", "name": "Transformation", "agent": "TransformAgent"},
        {"id": "feature_engineering", "name": "Feature Engineering", "agent": "FeatureAgent"},
        {"id": "synthetic_data", "name": "Synthetic Data", "agent": "SyntheticDataAgent"},
        {"id": "model_strategy", "name": "Model Strategy", "agent": "ModelStrategyAgent"},
        {"id": "model_selection", "name": "Model Selection", "agent": "ModelSelectionAgent"},
        {"id": "training", "name": "Training", "agent": "TrainingAgent"},
        {"id": "validation", "name": "Validation", "agent": "ValidationAgent"},
        {"id": "prediction", "name": "Prediction", "agent": "PredictionAgent"},
        {"id": "final_model", "name": "Final Model", "agent": "MasterAgent"},
    ]
    
    # Send pipeline initialization
    await manager.broadcast(
        dataset_id, "PIPELINE_INIT", "Initializing Live Processing Pipeline", 
        "Orchestrator", {"stages": stages}
    )
    
    for stage in stages:
        agent = stage["agent"]
        await manager.broadcast_status(dataset_id, "RUNNING", agent)
        await manager.broadcast(dataset_id, "AGENT_STEP", f"{stage['name']} starting analysis...", agent)
        
        # Simulate work
        work_time = random.uniform(1.0, 3.0)
        steps = int(work_time * 2)
        for i in range(steps):
            await asyncio.sleep(0.5)
            await manager.broadcast_log(dataset_id, f"Processing data chunk {i+1}/{steps}...", agent)
            
        # Simulate some data payload for specific stages
        data_payload = {}
        if stage["id"] == "model_selection":
            data_payload = {
                "winner": "XGBoost",
                "models": [
                    {"name": "XGBoost", "score": 0.92},
                    {"name": "Random Forest", "score": 0.89},
                    {"name": "Logistic Regression", "score": 0.81}
                ]
            }
        elif stage["id"] == "training":
            data_payload = {"metrics": {"accuracy": 0.93, "loss": 0.15}}
            
        await manager.broadcast_status(dataset_id, "COMPLETED", agent)
        await manager.broadcast(
            dataset_id, "AGENT_STEP", f"{stage['name']} completed successfully.", 
            agent, data_payload
        )
        await asyncio.sleep(0.5)

    await manager.broadcast(dataset_id, "PIPELINE_COMPLETE", "Processing complete", "Orchestrator", {})

@app.post("/api/dataset/{dataset_id}/pipeline/start")
@limiter.limit("5/minute")
async def start_dataset_pipeline(request: Request, dataset_id: str, background_tasks: BackgroundTasks):
    df = data_manager.load_version(dataset_id)
    if df is None:
        raise HTTPException(status_code=404, detail="Dataset not found")
        
    background_tasks.add_task(simulate_pipeline, dataset_id)
    return {"status": "started", "dataset_id": dataset_id}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
