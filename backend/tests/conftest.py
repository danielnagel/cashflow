"""Backend tests run against the Postgres from docker-compose.test.yml, never against SQLite,
so that the database roles and their privileges are part of what is tested."""

import os
from collections.abc import Iterator
from datetime import UTC, datetime, timedelta
from pathlib import Path

import pyotp
import pytest
from alembic import command
from alembic.config import Config
from fastapi.testclient import TestClient
from httpx2 import Response
from pydantic import SecretStr
from sqlalchemy import Engine, create_engine

from cashflow.auth import create_user, secret_cipher
from cashflow.config import Mode, Settings, SourceKind
from cashflow.main import create_app
from cashflow.models import Base
from cashflow.runtime import Runtime

BACKEND_DIR = Path(__file__).resolve().parent.parent
FIXTURES = Path(__file__).resolve().parent / "fixtures"

TOTP_KEY = "test-key-for-totp-secrets-0123456789"
USERNAME = "erika"
PASSWORD = "correct horse battery staple"
TOTP_SECRET = "KRSXG5CTMVRXEZLUKN2XAZLSKNSWG4TF"
FAKE_PIN = "12345"
NOW = datetime(2026, 11, 17, 9, 0, tzinfo=UTC)


def db_settings(role: str, password: str, mode: Mode = Mode.PROD) -> Settings:
    return Settings(
        mode=mode,
        transaction_source=SourceKind.FAKE,
        db_host=os.environ.get("TEST_DB_HOST", "127.0.0.1"),
        db_port=int(os.environ.get("TEST_DB_PORT", "5442")),
        db_name="cashflow",
        db_user=role,
        db_password=SecretStr(password),
        totp_encryption_key=SecretStr(TOTP_KEY),
        fake_pin=SecretStr(FAKE_PIN),
    )


OWNER = db_settings("cashflow_owner", os.environ.get("TEST_DB_OWNER_PASSWORD", "test-owner"))
APP = db_settings("cashflow_app", os.environ.get("TEST_DB_APP_PASSWORD", "test-app"))


def alembic_config() -> Config:
    config = Config(BACKEND_DIR / "alembic.ini")
    config.attributes["url"] = OWNER.database_url
    config.attributes["configure_logging"] = False
    return config


@pytest.fixture(scope="session")
def migrated() -> None:
    config = alembic_config()
    command.downgrade(config, "base")
    command.upgrade(config, "head")


@pytest.fixture
def owner_engine(migrated: None) -> Iterator[Engine]:
    engine = create_engine(OWNER.database_url)
    yield engine
    engine.dispose()


@pytest.fixture
def app_engine(migrated: None) -> Iterator[Engine]:
    engine = create_engine(APP.database_url)
    yield engine
    engine.dispose()


@pytest.fixture
def clean(app_engine: Engine) -> Engine:
    with app_engine.begin() as connection:
        for table in reversed(Base.metadata.sorted_tables):
            connection.execute(table.delete())
    return app_engine


class FrozenClock:
    def __init__(self, now: datetime) -> None:
        self.now = now

    def __call__(self) -> datetime:
        return self.now

    def advance(self, delta: timedelta) -> None:
        self.now += delta


@pytest.fixture
def clock() -> FrozenClock:
    return FrozenClock(NOW)


def client_for(settings: Settings, clock: FrozenClock | None = None) -> TestClient:
    app = create_app(settings, clock) if clock else create_app(settings)
    # The session cookie is Secure, so the client has to talk https.
    return TestClient(app, base_url="https://testserver")


@pytest.fixture
def client(migrated: None) -> Iterator[TestClient]:
    with client_for(APP) as test_client:
        yield test_client


@pytest.fixture
def api(clean: Engine, clock: FrozenClock) -> Iterator[TestClient]:
    """App with the fake bank, a frozen clock and one user; nothing logged in yet."""
    create_user(clean, secret_cipher(TOTP_KEY), USERNAME, PASSWORD, TOTP_SECRET, clock())
    with client_for(APP, clock) as test_client:
        yield test_client


def runtime_of(client: TestClient) -> Runtime:
    runtime: Runtime = client.app.state.runtime  # type: ignore[attr-defined]
    return runtime


def totp_code(when: datetime) -> str:
    return pyotp.TOTP(TOTP_SECRET).at(when)


def login(
    client: TestClient,
    clock: FrozenClock,
    password: str = PASSWORD,
    code: str | None = None,
) -> Response:
    return client.post(
        "/api/auth/login",
        json={"username": USERNAME, "password": password, "code": code or totp_code(clock())},
    )


def wait_for_fetch(client: TestClient) -> None:
    runtime_of(client).fetcher.join(timeout=30)
