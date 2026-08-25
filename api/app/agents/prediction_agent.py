from app.agents.base_agent import BaseAgent
import pandas as pd
from typing import Dict, Any
import joblib

class PredictionAgent(BaseAgent):
    
    def validate_input(self, inputs: Dict[str, Any]) -> bool:
        return "model_path" in inputs and "records" in inputs
        
    def execute(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        model_path = inputs["model_path"]
        records = inputs["records"]
        
        try:
            model = joblib.load(model_path)
        except Exception as e:
            return {"status": "failed", "reason": f"Failed to load model: {e}"}
            
        df = pd.DataFrame(records)
        
        # In a real app we'd apply the exact same feature engineering & imputation pipelines.
        # Assuming the UI passes pre-processed records for this demo.
        preds = model.predict(df)
        
        probs = None
        if hasattr(model, "predict_proba"):
            probs = model.predict_proba(df)[:, 1]
            
        results = []
        for i in range(len(records)):
            results.append({
                "record_index": i,
                "prediction": int(preds[i]),
                "probability": float(probs[i]) if probs is not None else None,
                "confidence": "High" if probs is not None and (probs[i] > 0.8 or probs[i] < 0.2) else "Medium"
            })
            
        return {
            "status": "completed",
            "predictions": results
        }

    def validate_output(self, outputs: Dict[str, Any]) -> bool:
        return "predictions" in outputs
