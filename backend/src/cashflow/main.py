import logging
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from datetime import UTC, datetime

from fastapi import FastAPI

from cashflow.api import accounts, auth, bank, health, ledger, testing
from cashflow.auth import Clock
from cashflow.config import Mode, Settings
from cashflow.db import make_engine
from cashflow.runtime import Runtime


def configure_logging() -> None:
    # Debug output of python-fints contains raw FinTS messages including the PIN.
    logging.getLogger("fints").setLevel(logging.WARNING)


def utc_now() -> datetime:
    return datetime.now(UTC)


def create_app(settings: Settings | None = None, clock: Clock = utc_now) -> FastAPI:
    settings = settings or Settings()
    configure_logging()
    engine = make_engine(settings)
    runtime = Runtime(settings, engine, clock)

    @asynccontextmanager
    async def lifespan(_: FastAPI) -> AsyncIterator[None]:
        if settings.mode is Mode.E2E:
            testing.ensure_test_user(runtime)
        yield
        runtime.fetcher.join()
        engine.dispose()

    app = FastAPI(
        title="cashflow", docs_url=None, redoc_url=None, openapi_url=None, lifespan=lifespan
    )
    app.state.settings = settings
    app.state.engine = engine
    app.state.runtime = runtime

    app.include_router(health.router, prefix="/api")
    app.include_router(auth.router, prefix="/api/auth")
    app.include_router(bank.router, prefix="/api")
    app.include_router(accounts.router, prefix="/api")
    app.include_router(ledger.router, prefix="/api")
    if settings.mode is Mode.E2E:
        app.include_router(testing.router, prefix="/api/_test")
    return app
