from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from app.models.database import get_db
from app.schemas.dataset import WorkflowStartRequest, WorkflowResponse
from app.models.workflow import WorkflowRun
from app.websocket.workflow_socket import manager

from app.orchestration.orchestrator import run_workflow

router = APIRouter(prefix="/api/workflows", tags=["workflows"])

def run_workflow_bg(workflow_id: str):
    import asyncio
    asyncio.run(run_workflow(workflow_id))

@router.post("/start", response_model=WorkflowResponse)
async def start_workflow(req: WorkflowStartRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    workflow = WorkflowRun(
        dataset_id=req.dataset_id,
        objective=req.objective,
        state="PLANNING"
    )
    db.add(workflow)
    db.commit()
    
    background_tasks.add_task(run_workflow_bg, workflow.id)
    
    return WorkflowResponse(
        workflow_id=workflow.id,
        dataset_id=workflow.dataset_id,
        objective=workflow.objective,
        state=workflow.state
    )

@router.get("/{workflow_id}")
async def get_workflow(workflow_id: str, db: Session = Depends(get_db)):
    workflow = db.query(WorkflowRun).filter_by(id=workflow_id).first()
    return workflow
