import os
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
import pandas as pd

from app.models.database import get_db
from app.models.dataset import Dataset, DatasetVersion
from app.schemas.dataset import DatasetResponse
from app.core.config import settings
from app.services.dataset_service import DatasetService

router = APIRouter(prefix="/api/datasets", tags=["datasets"])

@router.post("/upload", response_model=DatasetResponse)
async def upload_dataset(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith(('.csv', '.parquet', '.xlsx', '.json')):
        raise HTTPException(status_code=400, detail="Unsupported file format")

    os.makedirs(settings.upload_dir, exist_ok=True)
    
    # Save original file
    original_path = os.path.join(settings.upload_dir, file.filename)
    with open(original_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    dataset_service = DatasetService(db)
    dataset, version = dataset_service.process_initial_upload(original_path, file.filename)
    
    return DatasetResponse(
        dataset_id=dataset.id,
        filename=dataset.filename,
        rows=dataset.rows,
        columns=dataset.columns,
        version=version.version_number,
        status=dataset.status
    )

@router.get("/{dataset_id}/preview")
async def get_dataset_preview(dataset_id: str, db: Session = Depends(get_db)):
    dataset_service = DatasetService(db)
    # Find latest version
    latest_version = db.query(DatasetVersion).filter_by(dataset_id=dataset_id).order_by(DatasetVersion.version_number.desc()).first()
    if not latest_version:
        raise HTTPException(status_code=404, detail="Dataset not found")
        
    df = dataset_service.load_version(latest_version.id)
    # Return basic metadata and 5 rows
    return {
        "dataset_id": dataset_id,
        "metadata": {
            "columns": df.columns.tolist(),
            "preview_data": df.head(5).to_dict(orient="records")
        }
    }
