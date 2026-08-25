import pandas as pd
import uuid
import os
from sqlalchemy.orm import Session
from app.models.dataset import Dataset, DatasetVersion
from app.core.config import settings

class DatasetService:
    def __init__(self, db: Session):
        self.db = db

    def process_initial_upload(self, file_path: str, filename: str):
        # Load dataset to get dimensions
        if filename.endswith(".csv"):
            df = pd.read_csv(file_path)
        elif filename.endswith(".parquet"):
            df = pd.read_parquet(file_path)
        elif filename.endswith(".xlsx"):
            df = pd.read_excel(file_path)
        elif filename.endswith(".json"):
            df = pd.read_json(file_path)
        else:
            raise ValueError("Unsupported format")

        rows, columns = df.shape

        dataset = Dataset(
            filename=filename,
            original_path=file_path,
            rows=rows,
            columns=columns,
            status="received"
        )
        self.db.add(dataset)
        self.db.flush()

        # Save standard parquet version 1
        os.makedirs(settings.generated_dir, exist_ok=True)
        v1_path = os.path.join(settings.generated_dir, f"{dataset.id}_v1.parquet")
        df.to_parquet(v1_path)

        version = DatasetVersion(
            dataset_id=dataset.id,
            version_number=1,
            description="Original uploaded dataset",
            file_path=v1_path,
            rows=rows,
            columns=columns,
            agent="User"
        )
        self.db.add(version)
        self.db.commit()

        return dataset, version

    def load_version(self, version_id: str) -> pd.DataFrame:
        version = self.db.query(DatasetVersion).filter_by(id=version_id).first()
        if not version:
            raise ValueError("Version not found")
        return pd.read_parquet(version.file_path)

    def save_new_version(self, dataset_id: str, parent_version_id: str, df: pd.DataFrame, description: str, agent: str):
        # Determine next version number
        latest_version = self.db.query(DatasetVersion).filter_by(dataset_id=dataset_id).order_by(DatasetVersion.version_number.desc()).first()
        next_v = latest_version.version_number + 1 if latest_version else 1
        
        path = os.path.join(settings.generated_dir, f"{dataset_id}_v{next_v}.parquet")
        df.to_parquet(path)
        
        rows, columns = df.shape
        new_v = DatasetVersion(
            dataset_id=dataset_id,
            version_number=next_v,
            parent_version_id=parent_version_id,
            description=description,
            file_path=path,
            rows=rows,
            columns=columns,
            agent=agent
        )
        self.db.add(new_v)
        self.db.commit()
        
        return new_v
