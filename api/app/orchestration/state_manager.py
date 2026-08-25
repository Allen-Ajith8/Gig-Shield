from sqlalchemy.orm import Session
from app.models.workflow import WorkflowRun, WorkflowStep, AgentMessage
from app.websocket.workflow_socket import manager
from datetime import datetime
import json
import logging

logger = logging.getLogger(__name__)

class StateManager:
    def __init__(self, db: Session, workflow_id: str):
        self.db = db
        self.workflow_id = workflow_id
        self.workflow = self.db.query(WorkflowRun).filter_by(id=workflow_id).first()

    def update_workflow_state(self, new_state: str):
        self.workflow.state = new_state
        self.workflow.updated_at = datetime.utcnow()
        self.db.commit()

    def log_agent_step(self, agent_name: str, status: str, inputs: dict = None, outputs: dict = None, error: str = None):
        # Create or update a workflow step
        step = self.db.query(WorkflowStep).filter_by(workflow_id=self.workflow_id, agent_name=agent_name).first()
        if not step:
            step = WorkflowStep(
                workflow_id=self.workflow_id,
                agent_name=agent_name,
                status=status,
                started_at=datetime.utcnow() if status == "RUNNING" else None,
                inputs=inputs
            )
            self.db.add(step)
        else:
            step.status = status
            if status in ["COMPLETED", "FAILED"]:
                step.completed_at = datetime.utcnow()
            if outputs:
                step.outputs = outputs
            if error:
                step.error = error

        self.db.commit()

    async def broadcast_agent_message(self, sender: str, receiver: str, message: str, message_type: str = "info", priority: str = "low"):
        # Persist message
        agent_msg = AgentMessage(
            workflow_id=self.workflow_id,
            sender_agent=sender,
            receiver_agent=receiver,
            message=message,
            message_type=message_type
        )
        self.db.add(agent_msg)
        self.db.commit()

        # Broadcast via WebSocket
        time_str = agent_msg.timestamp.strftime("%H:%M:%S")
        ws_msg = {
            "type": "agent_log",
            "time": time_str,
            "agent": sender,
            "receiver": receiver,
            "msg": message,
            "color": self._get_color_for_type(message_type),
            "priority": priority
        }
        await manager.broadcast_to_workflow(self.workflow_id, ws_msg)
        # Also broadcast to general if needed
        await manager.broadcast_general(ws_msg)
        
    def _get_color_for_type(self, message_type: str) -> str:
        colors = {
            "info": "text-slate-300",
            "success": "text-emerald-400",
            "warning": "text-amber-400",
            "error": "text-red-400",
            "critical": "text-pink-400"
        }
        return colors.get(message_type, "text-indigo-400")
