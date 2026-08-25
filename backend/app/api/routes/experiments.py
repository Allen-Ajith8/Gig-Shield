from fastapi import APIRouter

router = APIRouter(prefix="/api/experiments", tags=["experiments"])

@router.get("/")
async def get_experiments():
    return {
        "runs": [
            {"id": "Exp 01", "name": "Optimized Pipeline", "model": "XGBoost", "feats": "Generated", "pre": "SMOTE", "f1": "92%", "auc": "96%", "time": "18s", "isBest": True}
        ]
    }
