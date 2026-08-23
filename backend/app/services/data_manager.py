import polars as pl
import duckdb
import os
from typing import Optional

class DataManager:
    def __init__(self, storage_dir: str = "storage/datasets"):
        self.storage_dir = storage_dir
        os.makedirs(self.storage_dir, exist_ok=True)
        self.db = duckdb.connect(database=':memory:')

    def load_dataset(self, file_path: str, dataset_id: str) -> pl.DataFrame:
        """Loads a dataset (CSV/Excel) and saves it as the initial Parquet version."""
        if file_path.endswith('.csv'):
            df = pl.read_csv(file_path)
        else:
            raise NotImplementedError("Only CSV supported for now in this skeleton")
        
        # Save initial version
        self.save_version(df, dataset_id, version=1)
        return df

    def save_version(self, df: pl.DataFrame, dataset_id: str, version: int):
        """Saves a dataframe version as a parquet file for rollback capability."""
        version_dir = os.path.join(self.storage_dir, dataset_id)
        os.makedirs(version_dir, exist_ok=True)
        
        file_name = f"v{version}.parquet"
        save_path = os.path.join(version_dir, file_name)
        df.write_parquet(save_path)
        print(f"Saved version {version} of {dataset_id} at {save_path}")

    def load_version(self, dataset_id: str, version: int) -> Optional[pl.DataFrame]:
        """Loads a specific version of a dataset."""
        file_path = os.path.join(self.storage_dir, dataset_id, f"v{version}.parquet")
        if os.path.exists(file_path):
            return pl.read_parquet(file_path)
        return None

    def query_dataset(self, df: pl.DataFrame, query: str) -> pl.DataFrame:
        """Allows querying the dataset using SQL via DuckDB."""
        # DuckDB can query Polars DataFrames directly if we register it
        # However, for simple in-memory, we can just do duckdb.sql
        result = duckdb.sql(f"SELECT * FROM df").pl()
        return result

# Singleton instance
data_manager = DataManager()
