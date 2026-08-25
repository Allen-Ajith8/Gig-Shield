from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.database import get_db
from app.models.dataset import DataDictionary, DatasetVersion

router = APIRouter(prefix="/api/dictionary", tags=["dictionary"])

@router.get("/")
async def get_dictionary(db: Session = Depends(get_db)):
    # Since dataset_id isn't in this route path currently in frontend, we grab the latest
    latest_version = db.query(DatasetVersion).order_by(DatasetVersion.created_at.desc()).first()
    if not latest_version:
        return {"columns": []}
        
    entries = db.query(DataDictionary).filter_by(dataset_version_id=latest_version.id).all()
    
    return {
        "columns": [
            {
                "name": e.column_name,
                "type": e.data_type,
                "description": e.description,
                "risk": e.privacy_risk
            } for e in entries
        ]
    }
