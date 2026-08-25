from app.agents.base_agent import BaseAgent
from app.models.dataset import DatasetVersion
from app.services.dataset_service import DatasetService
import pandas as pd
from typing import Dict, Any

class FeatureEngineeringAgent(BaseAgent):
    
    def validate_input(self, inputs: Dict[str, Any]) -> bool:
        return "dataset_id" in inputs and "version_id" in inputs
        
    def execute(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        dataset_id = inputs["dataset_id"]
        version_id = inputs["version_id"]
        
        version = self.db.query(DatasetVersion).filter_by(id=version_id).first()
        df = pd.read_parquet(version.file_path)
        
        generated_features = []
        new_version_id = version_id
        
        numeric_cols = df.select_dtypes(include=['number']).columns.tolist()
        
        # Simple heuristic feature generation (e.g., ratios for important columns)
        # If 'balance' and 'age' exist
        col_lower = {c.lower(): c for c in df.columns}
        
        if 'balance' in col_lower and 'age' in col_lower:
            bal_col = col_lower['balance']
            age_col = col_lower['age']
            if df[age_col].dtype in ['int64', 'float64'] and df[bal_col].dtype in ['int64', 'float64']:
                df['balance_per_age'] = df[bal_col] / df[age_col].replace(0, 1) # Avoid div by zero
                generated_features.append("balance_per_age")
                
        # If 'tenure_months' exists
        if 'tenure_months' in col_lower:
            t_col = col_lower['tenure_months']
            df['tenure_years'] = df[t_col] / 12
            generated_features.append("tenure_years")
            
        if generated_features:
            ds_service = DatasetService(self.db)
            new_version = ds_service.save_new_version(
                dataset_id=dataset_id,
                parent_version_id=version_id,
                df=df,
                description=f"Generated features: {', '.join(generated_features)}",
                agent="FeatureEngineeringAgent"
            )
            new_version_id = new_version.id
            
        return {
            "status": "completed" if generated_features else "skipped",
            "features_created": generated_features,
            "new_version_id": new_version_id
        }

    def validate_output(self, outputs: Dict[str, Any]) -> bool:
        return "features_created" in outputs
