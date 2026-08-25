from fastapi import APIRouter

router = APIRouter(prefix="/api/synthetic", tags=["synthetic"])

@router.get("/")
async def get_synthetic_stats():
    return {
        "methods_available": ["SMOTE", "CTGAN"],
        "current_job": {
            "status": "Ready",
            "last_run": "2 hours ago",
            "records_generated": 5000,
            "fidelity_score": 94.2
        }
    }
