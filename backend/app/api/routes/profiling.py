from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.database import get_db
from app.models.dataset import DataProfile, DatasetVersion

router = APIRouter(prefix="/api/stats", tags=["stats"])

@router.get("/")
async def get_dashboard_stats(db: Session = Depends(get_db)):
    # We get the most recent profile for now to show on the dashboard
    profile = db.query(DataProfile).order_by(DataProfile.created_at.desc()).first()
    
    # Defaults if no profile exists yet
    health = {
        "score": 0, "rows": 0, "columns": 0, "missing_pct": 0, "duplicates_pct": 0, "outliers_pct": 0, "pii_cols": 0
    }
    
    if profile:
        m = profile.metrics
        health = {
            "score": profile.health_score,
            "rows": m.get("rows", 0),
            "columns": m.get("columns", 0),
            "missing_pct": m.get("missing_pct", 0),
            "duplicates_pct": m.get("duplicates_pct", 0),
            "outliers_pct": m.get("outliers_pct", 0),
            "pii_cols": m.get("pii_cols", 0)
        }
        
    return {
        "dataset_health": health,
        "active_agents": {
            "total": 0,
            "max": 9,
            "agents": []
        },
        "model_performance": {
            "name": "N/A",
            "f1": 0,
            "auc": 0,
            "precision": 0,
            "recall": 0
        }
    }
