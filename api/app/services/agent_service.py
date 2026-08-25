import asyncio
import json
from datetime import datetime

class AgentService:
    def __init__(self):
        self.running_workflows = {}

    async def run_workflow(self, goal: str, manager, dataset_id: str = "customer_churn_Q3"):
        workflow_id = f"wf_{int(datetime.now().timestamp())}"
        self.running_workflows[workflow_id] = True
        
        # Simulate an agentic workflow through various stages
        stages = [
            {"agent": "Master Agent", "msg": f"Received goal: {goal}. Analyzing dataset {dataset_id}.", "delay": 2, "color": "text-brand-light"},
            {"agent": "Profiling Agent", "msg": "Starting deep profile of dataset columns.", "delay": 2, "color": "text-blue-400"},
            {"agent": "Profiling Agent", "msg": "Class imbalance detected in target variable.", "delay": 2, "color": "text-blue-400"},
            {"agent": "Master Agent", "msg": "Activating Synthetic Data Agent for class balancing.", "delay": 1, "color": "text-brand-light"},
            {"agent": "Synthetic Data Agent", "msg": "Generating 5,000 synthetic records...", "delay": 3, "color": "text-brand-dark"},
            {"agent": "Synthetic Data Agent", "msg": "5,000 records generated successfully.", "delay": 1, "color": "text-brand-dark"},
            {"agent": "Validation Agent", "msg": "Verifying synthetic distribution...", "delay": 2, "color": "text-emerald-400"},
            {"agent": "Validation Agent", "msg": "Distribution similarity: 94%. Validated.", "delay": 1, "color": "text-emerald-400"},
            {"agent": "ML Agent", "msg": "Starting feature selection and model training...", "delay": 3, "color": "text-amber-400"},
            {"agent": "ML Agent", "msg": "XGBoost model achieved 92% F1 score.", "delay": 2, "color": "text-amber-400"},
            {"agent": "Master Agent", "msg": "Workflow complete. Ready for predictions.", "delay": 1, "color": "text-brand-light"}
        ]
        
        for stage in stages:
            if not self.running_workflows.get(workflow_id):
                break
                
            await asyncio.sleep(stage["delay"])
            
            # Format the message
            now = datetime.now().strftime("%H:%M:%S")
            message_obj = {
                "type": "agent_log",
                "time": now,
                "agent": stage["agent"],
                "msg": stage["msg"],
                "color": stage["color"]
            }
            
            await manager.broadcast(json.dumps(message_obj))
            
        return workflow_id

agent_service = AgentService()
