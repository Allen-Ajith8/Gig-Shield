from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any
from app.agents.prediction_agent import PredictionAgent
import os
from app.core.config import settings

router = APIRouter(prefix="/api/predictions", tags=["predictions"])

class PredictionRequest(BaseModel):
    dataset_id: str
    model_name: str
    records: List[Dict[str, Any]]

@router.post("/")
async def run_prediction(req: PredictionRequest):
    model_path = os.path.join(settings.models_dir, f"{req.dataset_id}_{req.model_name}.pkl")
    
    agent = PredictionAgent("manual", None)
    res = agent.run({
        "model_path": model_path,
        "records": req.records
    })
    
    return res["outputs"]

@router.get("/")
async def get_predictions():
    return {
        "batch_status": "Ready",
        "recent_predictions": [
            {"id": "CUST_001", "probability": "89%", "prediction": "Churn", "confidence": "High"}
        ]
    }
