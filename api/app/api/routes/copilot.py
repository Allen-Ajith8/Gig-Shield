from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/api/copilot", tags=["copilot"])

class ChatRequest(BaseModel):
    message: str
    workflow_id: str = None
    dataset_id: str = None

@router.post("/chat")
async def copilot_chat(req: ChatRequest):
    # DEV ONLY: Stub for copilot interaction
    # In a full implementation, this uses LangChain + Ollama 
    # to query the Audit DB and Dataset Profiles to generate evidence-based answers.
    
    response = f"I am the AgentIQ Copilot. I'm currently in stub mode. You asked: '{req.message}'. I am backed by the SQLite database and can query workflow states and agent logs to answer."
    
    return {
        "reply": response,
        "evidence": []
    }
