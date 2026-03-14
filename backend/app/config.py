import os
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # When USE_SQLITE=1 (set by run-local if PostgreSQL is not available), use SQLite so it works without Postgres
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/exam_platform"
    SECRET_KEY: str = "super-secret-change-me-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    CORS_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"

    @property
    def cors_origin_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    @property
    def database_url(self) -> str:
        if os.getenv("USE_SQLITE", "").strip().lower() in ("1", "true", "yes"):
            return "sqlite:///./exam_platform.db"
        return self.DATABASE_URL

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
