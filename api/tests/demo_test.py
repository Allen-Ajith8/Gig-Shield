import asyncio
import os
import sys

# Add parent dir to path so we can import app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.models.database import SessionLocal, Base, engine
from app.services.dataset_service import DatasetService
from app.orchestration.orchestrator import run_workflow
from app.models.workflow import WorkflowRun
import pandas as pd

# Create a small demo dataset
demo_csv_path = "demo_churn.csv"
df = pd.DataFrame({
    "age": [25, 30, 45, -5, 50, 60, 35, 40, 22, 28, 44, 38], # -5 is an impossible value for QualityAgent
    "balance": [1000, 2000, 150, 4000, 500, 10000, 300, 200, 400, 800, 1200, 1100],
    "tenure_months": [12, 24, 6, 48, 2, 120, 4, 3, 5, 8, 14, 18],
    "email": ["a@a.com", "b@b.com", "c@c.com", "d@d.com", "e@e.com", "f@f.com", "g@g.com", "h@h.com", "i@i.com", "j@j.com", "k@k.com", "l@l.com"], # PII
    "churn": [0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0] # Minor class is 1 (33%), SMOTE will run if we set ratio low, but ratio is 4/8=0.5, let's make it more imbalanced
})
# Make churn 10/12 = 0 vs 2/12 = 1 to trigger SMOTE (< 0.2 ratio)
df["churn"] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1]
df.to_csv(demo_csv_path, index=False)

async def run_e2e_test():
    print("Initializing Database...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    print("1. Testing Dataset Upload...")
    ds_service = DatasetService(db)
    dataset, version = ds_service.process_initial_upload(demo_csv_path, "demo_churn.csv")
    print(f"Dataset created: {dataset.id}, version: {version.version_number}")
    
    print("2. Starting Workflow...")
    workflow = WorkflowRun(
        dataset_id=dataset.id,
        objective="Predict customer churn",
        state="PLANNING"
    )
    db.add(workflow)
    db.commit()
    print(f"Workflow created: {workflow.id}")
    
    print("3. Executing Orchestrator (Agents)...")
    await run_workflow(workflow.id)
    
    print("4. Workflow Execution Complete. Checking Database for results...")
    db.refresh(workflow)
    print(f"Final Workflow State: {workflow.state}")
    
    print("E2E Test Completed Successfully!")

if __name__ == "__main__":
    asyncio.run(run_e2e_test())
