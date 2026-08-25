from app.agents.base_agent import BaseAgent
from app.models.dataset import DatasetVersion, DataDictionary
import pandas as pd
from typing import Dict, Any
import requests

class DictionaryAgent(BaseAgent):
    
    def validate_input(self, inputs: Dict[str, Any]) -> bool:
        return "dataset_id" in inputs and "version_id" in inputs
        
    def execute(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        dataset_id = inputs["dataset_id"]
        version_id = inputs["version_id"]
        
        version = self.db.query(DatasetVersion).filter_by(id=version_id).first()
        df = pd.read_parquet(version.file_path)
        
        cols_info = []
        
        for col in df.columns:
            dtype = str(df[col].dtype)
            missing_pct = (df[col].isnull().sum() / len(df)) * 100
            unique_count = df[col].nunique()
            example_val = str(df[col].dropna().iloc[0]) if not df[col].dropna().empty else ""
            
            # Basic heuristics
            privacy_risk = "High" if any(k in col.lower() for k in ["email", "phone", "ssn", "name"]) else "Low"
            ml_relevance = "High" if missing_pct < 50 and unique_count > 1 else "Low"
            
            # Call LLM to generate semantic description
            # Placeholder for actual LLM call to save time, this can be expanded
            semantic_desc = self._generate_description(col, dtype, example_val)
            
            entry = DataDictionary(
                dataset_version_id=version_id,
                column_name=col,
                data_type=dtype,
                description=semantic_desc,
                example=example_val,
                missing_pct=round(missing_pct, 2),
                unique_count=unique_count,
                privacy_risk=privacy_risk,
                ml_relevance=ml_relevance
            )
            self.db.add(entry)
            cols_info.append({
                "name": col, "type": dtype, "desc": semantic_desc
            })
            
        self.db.commit()
        return {"columns_processed": len(cols_info)}

    def _generate_description(self, col_name: str, dtype: str, example: str) -> str:
        # Here we would call Ollama or OpenAI
        # e.g., requests.post("http://localhost:11434/api/generate", json={"model": "llama3", "prompt": ...})
        # Deterministic fallback for now
        return f"Semantic feature representing the {col_name.replace('_', ' ')} of the entity."

    def validate_output(self, outputs: Dict[str, Any]) -> bool:
        return "columns_processed" in outputs
