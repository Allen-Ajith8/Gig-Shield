from app.agents.base_agent import BaseAgent
from app.models.dataset import DatasetVersion, DataProfile
import pandas as pd
from typing import Dict, Any

class ProfilingAgent(BaseAgent):
    
    def validate_input(self, inputs: Dict[str, Any]) -> bool:
        return "dataset_id" in inputs and "version_id" in inputs
        
    def execute(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        dataset_id = inputs["dataset_id"]
        version_id = inputs["version_id"]
        
        # Load dataset
        version = self.db.query(DatasetVersion).filter_by(id=version_id).first()
        if not version:
            raise ValueError(f"Version {version_id} not found")
            
        df = pd.read_parquet(version.file_path)
        
        # Profile dataset deterministically using pandas
        rows, cols = df.shape
        missing_count = df.isnull().sum().sum()
        total_cells = rows * cols
        missing_pct = (missing_count / total_cells) * 100 if total_cells > 0 else 0
        
        duplicates_count = df.duplicated().sum()
        duplicates_pct = (duplicates_count / rows) * 100 if rows > 0 else 0
        
        # Simple outlier detection (z-score > 3 for numeric)
        numeric_df = df.select_dtypes(include=['number'])
        outliers_count = 0
        if not numeric_df.empty:
            z_scores = ((numeric_df - numeric_df.mean()) / numeric_df.std()).abs()
            outliers_count = (z_scores > 3).sum().sum()
            
        outliers_pct = (outliers_count / (rows * len(numeric_df.columns))) * 100 if len(numeric_df.columns) > 0 and rows > 0 else 0
        
        # Simple PII detection by column name heuristics
        pii_keywords = ["email", "phone", "address", "ssn", "name", "ip_address"]
        pii_cols = [c for c in df.columns if any(k in c.lower() for k in pii_keywords)]
        
        metrics = {
            "rows": rows,
            "columns": cols,
            "missing_pct": round(missing_pct, 2),
            "duplicates_pct": round(duplicates_pct, 2),
            "outliers_pct": round(outliers_pct, 2),
            "pii_cols": len(pii_cols),
            "pii_columns_detected": pii_cols
        }
        
        # Calculate health score (100 - penalties)
        score = 100 - (missing_pct * 0.5) - (duplicates_pct * 1.5) - (outliers_pct * 0.2)
        score = max(0, min(100, round(score)))
        
        # Store profile in DB
        profile = DataProfile(
            dataset_version_id=version_id,
            health_score=score,
            metrics=metrics
        )
        self.db.add(profile)
        self.db.commit()
        
        return {
            "health_score": score,
            "metrics": metrics
        }
        
    def validate_output(self, outputs: Dict[str, Any]) -> bool:
        return "health_score" in outputs and "metrics" in outputs
