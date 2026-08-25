from app.agents.base_agent import BaseAgent
from typing import Dict, Any

class MLStrategyAgent(BaseAgent):
    
    def validate_input(self, inputs: Dict[str, Any]) -> bool:
        return "dataset_id" in inputs and "version_id" in inputs
        
    def execute(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        # Based on data size and target, decide which models to run
        # For simplicity, we just recommend a standard suite
        
        models_to_test = ["LogisticRegression", "RandomForest", "XGBoost"]
        
        return {
            "selected_models": models_to_test,
            "strategy": "classification",
            "cv_folds": 3
        }

    def validate_output(self, outputs: Dict[str, Any]) -> bool:
        return "selected_models" in outputs
