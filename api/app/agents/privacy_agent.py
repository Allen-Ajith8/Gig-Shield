from app.agents.base_agent import BaseAgent
from app.models.dataset import DatasetVersion
import pandas as pd
from typing import Dict, Any

class PrivacyAgent(BaseAgent):
    
    def validate_input(self, inputs: Dict[str, Any]) -> bool:
        return "dataset_id" in inputs and "version_id" in inputs
        
    def execute(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        dataset_id = inputs["dataset_id"]
        version_id = inputs["version_id"]
        
        version = self.db.query(DatasetVersion).filter_by(id=version_id).first()
        df = pd.read_parquet(version.file_path)
        
        pii_columns = []
        pii_keywords = ["email", "phone", "address", "ssn", "name", "ip_address", "credit_card", "password"]
        
        for col in df.columns:
            # Check column names
            if any(k in col.lower() for k in pii_keywords):
                pii_columns.append(col)
                continue
                
        # We could also do regex checking on string columns here for emails/phone numbers
        
        score = 100 - (len(pii_columns) * 10)
        score = max(0, score)
        
        actions = []
        if pii_columns:
            actions.append(f"Anonymize {len(pii_columns)} columns using hashing or dropping before model training.")
            
        return {
            "privacy_score": score,
            "pii_columns": pii_columns,
            "actions": actions
        }

    def validate_output(self, outputs: Dict[str, Any]) -> bool:
        return "privacy_score" in outputs
