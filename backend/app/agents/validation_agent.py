from app.agents.base_agent import BaseAgent
from typing import Dict, Any

class ValidationAgent(BaseAgent):
    
    def validate_input(self, inputs: Dict[str, Any]) -> bool:
        return "experiments" in inputs
        
    def execute(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        experiments = inputs["experiments"]
        
        if not experiments:
            return {"status": "failed", "reason": "No experiments to validate."}
            
        # Select best model based on F1 Score
        best_exp = max(experiments, key=lambda x: x["f1"])
        
        return {
            "status": "completed",
            "best_model": best_exp["model"],
            "best_metrics": {
                "f1": best_exp["f1"],
                "auc": best_exp["auc"]
            },
            "model_path": best_exp["path"]
        }

    def validate_output(self, outputs: Dict[str, Any]) -> bool:
        return "best_model" in outputs
