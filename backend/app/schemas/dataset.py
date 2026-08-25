from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class DatasetResponse(BaseModel):
    dataset_id: str
    filename: str
    rows: int
    columns: int
    version: int
    status: str

    class Config:
        from_attributes = True

class WorkflowStartRequest(BaseModel):
    dataset_id: str
    objective: str

class WorkflowResponse(BaseModel):
    workflow_id: str
    dataset_id: str
    objective: str
    state: str
