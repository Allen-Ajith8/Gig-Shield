from app.agents.base_agent import BaseAgent
from app.models.dataset import DatasetVersion
import pandas as pd
from typing import Dict, Any

class DataQualityAgent(BaseAgent):
    
    def validate_input(self, inputs: Dict[str, Any]) -> bool:
        return "dataset_id" in inputs and "version_id" in inputs
        
    def execute(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        dataset_id = inputs["dataset_id"]
        version_id = inputs["version_id"]
        
        version = self.db.query(DatasetVersion).filter_by(id=version_id).first()
        df = pd.read_parquet(version.file_path)
        
        findings = []
        actions = []
        
        # 1. Missing values
        for col in df.columns:
            missing_count = df[col].isnull().sum()
            if missing_count > 0:
                pct = (missing_count / len(df)) * 100
                findings.append(f"Column '{col}' has {missing_count} missing values ({pct:.1f}%).")
                actions.append(f"Impute '{col}' using median/mode.")
                
        # 2. Impossible values (e.g., negative age)
        if "age" in df.columns or "Age" in df.columns:
            col = "age" if "age" in df.columns else "Age"
            if pd.api.types.is_numeric_dtype(df[col]):
                impossible = df[df[col] < 0]
                if not impossible.empty:
                    findings.append(f"Column '{col}' has {len(impossible)} negative values.")
                    actions.append(f"Flag {len(impossible)} records in '{col}' for review or replace with NaN.")
                    
        # 3. Class Imbalance (Assuming the last column is target for demo purposes)
        target_col = df.columns[-1]
        val_counts = df[target_col].value_counts(normalize=True) * 100
        min_class_pct = val_counts.min()
        if min_class_pct < 10:
            findings.append(f"Target column '{target_col}' has severe class imbalance (minority class {min_class_pct:.1f}%).")
            actions.append(f"Trigger Synthetic Data Agent for SMOTE oversampling.")
            
        return {
            "findings": findings,
            "actions": actions,
            "quality_issues": len(findings)
        }

    def validate_output(self, outputs: Dict[str, Any]) -> bool:
        return "findings" in outputs and "actions" in outputs
