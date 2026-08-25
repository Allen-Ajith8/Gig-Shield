from app.agents.base_agent import BaseAgent
from app.models.dataset import DatasetVersion
import pandas as pd
from typing import Dict, Any
import time
import os
import joblib
from app.core.config import settings

class ExperimentAgent(BaseAgent):
    
    def validate_input(self, inputs: Dict[str, Any]) -> bool:
        return "dataset_id" in inputs and "version_id" in inputs and "models" in inputs
        
    def execute(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        dataset_id = inputs["dataset_id"]
        version_id = inputs["version_id"]
        models_to_test = inputs["models"]
        
        version = self.db.query(DatasetVersion).filter_by(id=version_id).first()
        df = pd.read_parquet(version.file_path)
        
        # Assume target is 'churn' for the demo, otherwise last column
        target_col = 'churn' if 'churn' in df.columns else df.columns[-1]
        
        # Prepare data
        df = df.dropna()
        X = df.drop(columns=[target_col])
        y = df[target_col]
        
        # Convert categoricals to dummy variables
        X = pd.get_dummies(X, drop_first=True)
        y = y.astype(int) # Ensure target is integer for classifiers
        
        from sklearn.model_selection import train_test_split
        from sklearn.metrics import f1_score, roc_auc_score, precision_score, recall_score
        from sklearn.linear_model import LogisticRegression
        from sklearn.ensemble import RandomForestClassifier
        from xgboost import XGBClassifier
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        results = []
        os.makedirs(settings.models_dir, exist_ok=True)
        
        for model_name in models_to_test:
            start_time = time.time()
            if model_name == "LogisticRegression":
                model = LogisticRegression(max_iter=1000)
            elif model_name == "RandomForest":
                model = RandomForestClassifier(n_estimators=100, random_state=42)
            elif model_name == "XGBoost":
                model = XGBClassifier(use_label_encoder=False, eval_metric='logloss', random_state=42)
            else:
                continue
                
            model.fit(X_train, y_train)
            preds = model.predict(X_test)
            
            # Predict proba for AUC if possible
            if hasattr(model, "predict_proba") and len(set(y)) == 2:
                probs = model.predict_proba(X_test)[:, 1]
                auc = roc_auc_score(y_test, probs)
            else:
                auc = 0.5
                
            f1 = f1_score(y_test, preds, average='weighted')
            prec = precision_score(y_test, preds, average='weighted', zero_division=0)
            rec = recall_score(y_test, preds, average='weighted', zero_division=0)
            t_time = time.time() - start_time
            
            model_path = os.path.join(settings.models_dir, f"{dataset_id}_{model_name}.pkl")
            joblib.dump(model, model_path)
            
            results.append({
                "model": model_name,
                "f1": round(f1, 4),
                "auc": round(auc, 4),
                "precision": round(prec, 4),
                "recall": round(rec, 4),
                "time": round(t_time, 2),
                "path": model_path
            })
            
        return {
            "experiments": results
        }

    def validate_output(self, outputs: Dict[str, Any]) -> bool:
        return "experiments" in outputs
