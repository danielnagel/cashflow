"""Backend tests run against the Postgres from docker-compose.test.yml, never against SQLite,
so that the database roles and their privileges are part of what is tested."""

import os
from collections.abc import Iterator
from pathlib import Path

import pytest
from alembic import command
from alembic.config import Config
from fastapi.testclient import TestClient
from pydantic import SecretStr
from sqlalchemy import Engine, create_engine

from cashflow.config import Mode, Settings
from cashflow.main import create_app

BACKEND_DIR = Path(__file__).resolve().parent.parent
FIXTURES = Path(__file__).resolve().parent / "fixtures"


def db_settings(role: str, password: str, mode: Mode = Mode.PROD) -> Settings:
    return Settings(
        mode=mode,
        db_host=os.environ.get("TEST_DB_HOST", "127.0.0.1"),
        db_port=int(os.environ.get("TEST_DB_PORT", "5442")),
        db_name="cashflow",
        db_user=role,
        db_password=SecretStr(password),
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


def client_for(settings: Settings) -> TestClient:
    return TestClient(create_app(settings))


@pytest.fixture
def client(migrated: None) -> Iterator[TestClient]:
    with client_for(APP) as test_client:
        yield test_client
