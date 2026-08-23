"""
Application configuration loaded from environment variables via pydantic-settings.
"""

from __future__ import annotations

import json
from typing import List, Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Central configuration for the Autonomous SRE backend."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # ── LLM Provider ────────────────────────────────────────
    llm_provider: Literal["openai", "anthropic", "google"] = "openai"
    openai_api_key: str = ""
    anthropic_api_key: str = ""
    google_api_key: str = ""
    llm_model_name: str = "gpt-4o"

    # ── Application ─────────────────────────────────────────
    app_env: Literal["development", "production"] = "development"
    log_level: str = "INFO"
    cors_origins: str = '["http://localhost:3000","http://localhost:5173"]'

    # ── Sandbox ─────────────────────────────────────────────
    sandbox_mode: Literal["mock", "docker"] = "mock"

    # ── Helpers ─────────────────────────────────────────────
    @property
    def cors_origin_list(self) -> List[str]:
        """Parse the JSON-encoded CORS_ORIGINS string into a Python list."""
        try:
            return json.loads(self.cors_origins)
        except (json.JSONDecodeError, TypeError):
            return ["*"]


# Singleton – import this everywhere
settings = Settings()
