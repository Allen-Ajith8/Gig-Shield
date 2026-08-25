from sqlalchemy import Column, String, Integer, DateTime, JSON, ForeignKey, Float, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.models.database import Base
import uuid

class Dataset(Base):
    __tablename__ = "datasets"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    filename = Column(String, nullable=False)
    original_path = Column(String, nullable=False)
    rows = Column(Integer)
    columns = Column(Integer)
    status = Column(String, default="received")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    versions = relationship("DatasetVersion", back_populates="dataset")
    workflows = relationship("WorkflowRun", back_populates="dataset")

class DatasetVersion(Base):
    __tablename__ = "dataset_versions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    dataset_id = Column(String, ForeignKey("datasets.id"))
    version_number = Column(Integer, nullable=False)
    parent_version_id = Column(String, ForeignKey("dataset_versions.id"), nullable=True)
    description = Column(String)
    file_path = Column(String, nullable=False)
    rows = Column(Integer)
    columns = Column(Integer)
    agent = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    dataset = relationship("Dataset", back_populates="versions")
    
class DataProfile(Base):
    __tablename__ = "data_profiles"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    dataset_version_id = Column(String, ForeignKey("dataset_versions.id"))
    health_score = Column(Float)
    metrics = Column(JSON) # e.g. missing_pct, duplicates_pct
    created_at = Column(DateTime, default=datetime.utcnow)

class DataDictionary(Base):
    __tablename__ = "data_dictionary"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    dataset_version_id = Column(String, ForeignKey("dataset_versions.id"))
    column_name = Column(String, nullable=False)
    data_type = Column(String)
    description = Column(String)
    example = Column(String)
    missing_pct = Column(Float)
    unique_count = Column(Integer)
    privacy_risk = Column(String)
    ml_relevance = Column(String)
