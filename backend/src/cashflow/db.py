from fastapi import Request
from sqlalchemy import Engine, create_engine

from cashflow.config import Settings


def make_engine(settings: Settings) -> Engine:
    return create_engine(settings.database_url, pool_pre_ping=True)


def get_engine(request: Request) -> Engine:
    engine: Engine = request.app.state.engine
    return engine
