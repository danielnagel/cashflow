import logging
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI

from cashflow.api import health, testing
from cashflow.config import Mode, Settings
from cashflow.db import make_engine


def configure_logging() -> None:
    # Debug output of python-fints contains raw FinTS messages including the PIN.
    logging.getLogger("fints").setLevel(logging.WARNING)


def create_app(settings: Settings | None = None) -> FastAPI:
    settings = settings or Settings()
    configure_logging()
    engine = make_engine(settings)

    @asynccontextmanager
    async def lifespan(_: FastAPI) -> AsyncIterator[None]:
        yield
        engine.dispose()

    app = FastAPI(
        title="cashflow", docs_url=None, redoc_url=None, openapi_url=None, lifespan=lifespan
    )
    app.state.settings = settings
    app.state.engine = engine

    app.include_router(health.router, prefix="/api")
    if settings.mode is Mode.E2E:
        app.include_router(testing.router, prefix="/api/_test")
    return app
