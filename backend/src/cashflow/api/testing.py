"""Endpoints that let E2E tests control the backend. Only registered in e2e mode."""

from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy import Engine

from cashflow.db import get_engine
from cashflow.models import Base

router = APIRouter()


@router.post("/reset", status_code=status.HTTP_204_NO_CONTENT)
def reset(engine: Annotated[Engine, Depends(get_engine)]) -> None:
    with engine.begin() as connection:
        for table in reversed(Base.metadata.sorted_tables):
            connection.execute(table.delete())
