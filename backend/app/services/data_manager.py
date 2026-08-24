import polars as pl
import duckdb
import os
import json
from typing import Optional, Dict, Any

class DataManager:
    def __init__(self, storage_dir: str = "storage/datasets"):
        self.storage_dir = storage_dir
        os.makedirs(self.storage_dir, exist_ok=True)
        self.db = duckdb.connect(database=':memory:')

    def load_dataset_from_bytes(self, file_bytes: bytes, filename: str) -> Dict[str, Any]:
        """Loads a dataset from bytes, saves it, and returns metadata."""
        dataset_id = filename.split('.')[0]
        
        # Save temporary file to read with polars
        temp_path = os.path.join(self.storage_dir, filename)
        with open(temp_path, "wb") as f:
            f.write(file_bytes)
            
        try:
            if filename.endswith('.csv'):
                df = pl.read_csv(temp_path)
            elif filename.endswith('.parquet'):
                df = pl.read_parquet(temp_path)
            else:
                raise ValueError("Unsupported file format. Use CSV or Parquet.")
                
            # Save version
            self.save_version(df, dataset_id, version=1)
            
            # Extract metadata
            metadata = self.get_dataset_metadata(df)
            
            return {
                "dataset_id": dataset_id,
                "metadata": metadata,
                "status": "success"
            }
        finally:
            # Clean up temp file
            if os.path.exists(temp_path):
                os.remove(temp_path)

    def save_version(self, df: pl.DataFrame, dataset_id: str, version: int):
        """Saves a dataframe version as a parquet file."""
        version_dir = os.path.join(self.storage_dir, dataset_id)
        os.makedirs(version_dir, exist_ok=True)
        
        file_name = f"v{version}.parquet"
        save_path = os.path.join(version_dir, file_name)
        df.write_parquet(save_path)
        print(f"Saved version {version} of {dataset_id} at {save_path}")

    def load_version(self, dataset_id: str, version: int = 1) -> Optional[pl.DataFrame]:
        """Loads a specific version of a dataset."""
        file_path = os.path.join(self.storage_dir, dataset_id, f"v{version}.parquet")
        if os.path.exists(file_path):
            return pl.read_parquet(file_path)
        return None

    def get_dataset_metadata(self, df: pl.DataFrame) -> Dict[str, Any]:
        """Extracts schema, rows, and basic stats from a dataframe."""
        schema = []
        for col_name, dtype in zip(df.columns, df.dtypes):
            schema.append({
                "column": col_name,
                "type": str(dtype),
                "null_count": df[col_name].null_count()
            })
            
        return {
            "rows": df.height,
            "columns": df.width,
            "schema": schema,
            "head": df.head(5).to_dicts()
        }

    def query_dataset(self, df: pl.DataFrame, query: str) -> pl.DataFrame:
        """Allows querying the dataset using SQL via DuckDB."""
        result = duckdb.sql(f"SELECT * FROM df").pl()
        return result

# Singleton instance
data_manager = DataManager()
