from fastapi import APIRouter

router = APIRouter(prefix="/api/features", tags=["features"])

@router.get("/")
async def get_features():
    # DEV ONLY: Placeholder
    return {
        "suggested_features": [
            {"name": "balance_per_age", "formula": "balance / age", "impact": "High", "status": "Pending"}
        ]
    }
