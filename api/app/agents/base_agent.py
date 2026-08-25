from abc import ABC, abstractmethod
from typing import Dict, Any, List
from datetime import datetime

class BaseAgent(ABC):
    def __init__(self, workflow_id: str, db_session):
        self.workflow_id = workflow_id
        self.db = db_session
        self.agent_id = self.__class__.__name__
        self.name = self.__class__.__name__
        self.description = "Base Agent"
        self.status = "INITIALIZED"
        self.confidence = 1.0
        self.started_at = None
        self.completed_at = None
        self.error = None
        
    @abstractmethod
    def validate_input(self, inputs: Dict[str, Any]) -> bool:
        pass
        
    @abstractmethod
    def execute(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        pass
        
    @abstractmethod
    def validate_output(self, outputs: Dict[str, Any]) -> bool:
        pass
        
    def run(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        self.started_at = datetime.utcnow()
        self.status = "RUNNING"
        
        try:
            if not self.validate_input(inputs):
                raise ValueError("Invalid input")
                
            outputs = self.execute(inputs)
            
            if not self.validate_output(outputs):
                raise ValueError("Invalid output")
                
            self.status = "COMPLETED"
            self.completed_at = datetime.utcnow()
            return {
                "agent": self.name,
                "status": self.status,
                "confidence": self.confidence,
                "outputs": outputs
            }
        except Exception as e:
            self.status = "FAILED"
            self.error = str(e)
            self.completed_at = datetime.utcnow()
            raise e
