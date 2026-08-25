from app.agents.base_agent import BaseAgent
from app.models.dataset import DatasetVersion
from app.services.dataset_service import DatasetService
import pandas as pd
from typing import Dict, Any

class SyntheticDataAgent(BaseAgent):
    
    def validate_input(self, inputs: Dict[str, Any]) -> bool:
        return "dataset_id" in inputs and "version_id" in inputs
        
    def execute(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        dataset_id = inputs["dataset_id"]
        version_id = inputs["version_id"]
        
        # Load dataset
        version = self.db.query(DatasetVersion).filter_by(id=version_id).first()
        df = pd.read_parquet(version.file_path)
        
        # We assume 'churn' is the target for demo, otherwise last column
        target_col = 'churn' if 'churn' in df.columns else df.columns[-1]
        
        if not pd.api.types.is_numeric_dtype(df[target_col]) and not pd.api.types.is_bool_dtype(df[target_col]):
            return {"status": "skipped", "reason": "Target column is not numeric/boolean."}
            
        val_counts = df[target_col].value_counts()
        min_class = val_counts.idxmin()
        max_class = val_counts.idxmax()
        
        imbalance_ratio = val_counts[min_class] / val_counts[max_class]
        
        generated_count = 0
        new_version_id = version_id
        
        if imbalance_ratio < 0.2: # Significant imbalance
            try:
                from imblearn.over_sampling import SMOTE
                from sklearn.impute import SimpleImputer
                import numpy as np
                
                # Separate features and target
                X = df.drop(columns=[target_col])
                y = df[target_col]
                
                # Only use numeric columns for SMOTE
                numeric_cols = X.select_dtypes(include=['number']).columns
                if len(numeric_cols) > 0:
                    X_num = X[numeric_cols]
                    
                    # Impute missing values before SMOTE
                    imputer = SimpleImputer(strategy='median')
                    X_num_imputed = imputer.fit_transform(X_num)
                    
                    # Apply SMOTE
                    smote = SMOTE(random_state=42)
                    X_res, y_res = smote.fit_resample(X_num_imputed, y)
                    
                    generated_count = len(y_res) - len(y)
                    
                    if generated_count > 0:
                        # Reconstruct dataframe
                        df_res = pd.DataFrame(X_res, columns=numeric_cols)
                        # Add non-numeric columns back (fill with most frequent for synthetic rows)
                        non_numeric = [c for c in X.columns if c not in numeric_cols]
                        for c in non_numeric:
                            mode_val = df[c].mode()[0] if not df[c].mode().empty else None
                            # Pad the original non-numeric data with mode values for the synthetic rows
                            padded = list(df[c].values) + [mode_val] * generated_count
                            df_res[c] = padded
                            
                        df_res[target_col] = y_res
                        
                        # Save new version
                        ds_service = DatasetService(self.db)
                        new_version = ds_service.save_new_version(
                            dataset_id=dataset_id,
                            parent_version_id=version_id,
                            df=df_res,
                            description=f"Applied SMOTE to balance class '{min_class}'",
                            agent="SyntheticDataAgent"
                        )
                        new_version_id = new_version.id
            except ImportError:
                # Fallback if imblearn not installed
                return {"status": "failed", "reason": "imblearn library not found."}
                
        return {
            "status": "completed" if generated_count > 0 else "skipped",
            "generated_records": generated_count,
            "new_version_id": new_version_id,
            "method": "SMOTE" if generated_count > 0 else "None"
        }

    def validate_output(self, outputs: Dict[str, Any]) -> bool:
        return "status" in outputs
