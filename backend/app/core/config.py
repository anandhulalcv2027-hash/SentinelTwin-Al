from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Application
    app_name: str = Field(alias="APP_NAME")
    app_version: str = Field(alias="APP_VERSION")
    app_env: str = Field(alias="APP_ENV")
    debug: bool = Field(alias="DEBUG")

    # API
    api_v1_prefix: str = Field(alias="API_V1_PREFIX")

    # PostgreSQL
    database_url_override: str | None = Field(
        default=None,
        alias="DATABASE_URL",
    )
    postgres_host: str = Field(
        default="localhost",
        alias="POSTGRES_HOST",
    )
    postgres_port: int = Field(
        default=5432,
        alias="POSTGRES_PORT",
    )
    postgres_db: str = Field(
        default="sentineltwin",
        alias="POSTGRES_DB",
    )
    postgres_user: str = Field(
        default="postgres",
        alias="POSTGRES_USER",
    )
    postgres_password: str = Field(
        default="postgres",
        alias="POSTGRES_PASSWORD",
    )
    postgres_sslmode: str | None = Field(
        default=None,
        alias="POSTGRES_SSLMODE",
    )

    # Security
    secret_key: str = Field(alias="SECRET_KEY")
    access_token_expire_minutes: int = Field(
        alias="ACCESS_TOKEN_EXPIRE_MINUTES"
    )
    refresh_token_expire_days: int = Field(
        default=14,
        alias="REFRESH_TOKEN_EXPIRE_DAYS",
    )
    algorithm: str = Field(alias="ALGORITHM")

    # Google Sign-In
    google_client_id: str = Field(alias="GOOGLE_CLIENT_ID")

    # MailerSend
    mailersend_api_key: str = Field(
        default="",
        alias="MAILERSEND_API_KEY",
    )
    mailersend_from_email: str = Field(
        default="",
        alias="MAILERSEND_FROM_EMAIL",
    )
    mailersend_from_name: str = Field(
        default="SentinelTwin AI",
        alias="MAILERSEND_FROM_NAME",
    )

    # SMTP
    smtp_host: str = Field(
        default="",
        alias="SMTP_HOST",
    )
    smtp_port: int = Field(
        default=587,
        alias="SMTP_PORT",
    )
    smtp_username: str = Field(
        default="",
        alias="SMTP_USERNAME",
    )
    smtp_password: str = Field(
        default="",
        alias="SMTP_PASSWORD",
    )
    smtp_from_email: str = Field(
        default="",
        alias="SMTP_FROM_EMAIL",
    )
    smtp_from_name: str = Field(
        default="SentinelTwin AI",
        alias="SMTP_FROM_NAME",
    )
    smtp_use_tls: bool = Field(
        default=True,
        alias="SMTP_USE_TLS",
    )

    # Email
    email_provider: str = Field(
        default="smtp",
        alias="EMAIL_PROVIDER",
    )

    email_verification_required: bool = Field(
        default=True,
        alias="EMAIL_VERIFICATION_REQUIRED",
    )

    # Frontend
    frontend_url: str = Field(
        default="http://localhost:5173",
        alias="FRONTEND_URL",
    )

    # Frontend / local development
    cors_origins: str = Field(
        default="http://localhost:5173,http://localhost:5174",
        alias="CORS_ORIGINS",
    )

    # Public API
    public_api_url: str = Field(
        default="http://127.0.0.1:8000",
        alias="PUBLIC_API_URL",
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    @property
    def database_url(self) -> str:
        if self.database_url_override:
            url = self.database_url_override.strip()
            if url.startswith("postgres://"):
                url = "postgresql+psycopg://" + url[len("postgres://"):]
            elif url.startswith("postgresql://") and not url.startswith("postgresql+"):
                url = "postgresql+psycopg://" + url[len("postgresql://"):]
            return url

        ssl_param = f"?sslmode={self.postgres_sslmode}" if self.postgres_sslmode else ""
        return (
            f"postgresql+psycopg://"
            f"{self.postgres_user}:{self.postgres_password}"
            f"@{self.postgres_host}:{self.postgres_port}"
            f"/{self.postgres_db}{ssl_param}"
        )

    @property
    def cors_origin_list(self) -> list[str]:
        return [
            origin.strip()
            for origin in self.cors_origins.split(",")
            if origin.strip()
        ]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()