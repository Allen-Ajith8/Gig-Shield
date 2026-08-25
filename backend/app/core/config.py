import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_name: str = "AgentIQ Backend"
    database_url: str = "sqlite:///./agentiq.db"
    upload_dir: str = "uploads"
    models_dir: str = "models"
    generated_dir: str = "generated"
    
    # LLM Settings
    llm_provider: str = "ollama"
    llm_model: str = "llama3.1:8b"
    llm_api_base: str = "http://localhost:11434"
    llm_api_key: str = ""

    # CORS
    cors_origins: list[str] = ["*"]

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
