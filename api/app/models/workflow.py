from sqlalchemy import Column, String, Integer, DateTime, JSON, ForeignKey, Float, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.models.database import Base
import uuid

class WorkflowRun(Base):
    __tablename__ = "workflow_runs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    dataset_id = Column(String, ForeignKey("datasets.id"))
    objective = Column(String)
    state = Column(String, default="CREATED")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    dataset = relationship("Dataset", back_populates="workflows")
    steps = relationship("WorkflowStep", back_populates="workflow")
    messages = relationship("AgentMessage", back_populates="workflow")

class WorkflowStep(Base):
    __tablename__ = "workflow_steps"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    workflow_id = Column(String, ForeignKey("workflow_runs.id"))
    agent_name = Column(String)
    status = Column(String, default="PENDING")
    started_at = Column(DateTime)
    completed_at = Column(DateTime)
    inputs = Column(JSON)
    outputs = Column(JSON)
    error = Column(String)

    workflow = relationship("WorkflowRun", back_populates="steps")

class AgentMessage(Base):
    __tablename__ = "agent_messages"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    workflow_id = Column(String, ForeignKey("workflow_runs.id"))
    sender_agent = Column(String)
    receiver_agent = Column(String)
    message = Column(String)
    message_type = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)

    workflow = relationship("WorkflowRun", back_populates="messages")
