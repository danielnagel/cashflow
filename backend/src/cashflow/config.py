from enum import StrEnum

from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlalchemy import URL


class Mode(StrEnum):
    DEV = "dev"
    PROD = "prod"
    E2E = "e2e"


class SourceKind(StrEnum):
    FINTS = "fints"
    FAKE = "fake"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(frozen=True)

    mode: Mode = Mode.PROD
    transaction_source: SourceKind = SourceKind.FINTS

    db_host: str = "cashflow-db"
    db_port: int = 5432
    db_name: str = "cashflow"
    db_user: str = "cashflow_app"
    db_password: SecretStr = SecretStr("")

    fints_blz: str = ""
    fints_server: str = ""
    fints_login: SecretStr = SecretStr("")
    fints_product_id: SecretStr = SecretStr("")

    fake_seed: int = 1

    @property
    def database_url(self) -> URL:
        return URL.create(
            "postgresql+psycopg",
            username=self.db_user,
            password=self.db_password.get_secret_value(),
            host=self.db_host,
            port=self.db_port,
            database=self.db_name,
        )
