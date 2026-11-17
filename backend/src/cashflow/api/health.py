from typing import Annotated

from fastapi import APIRouter, Depends, Response, status
from pydantic import BaseModel
from sqlalchemy import Engine, text
from sqlalchemy.exc import SQLAlchemyError

from cashflow.db import get_engine

router = APIRouter()


class Health(BaseModel):
    status: str
    database: str


@router.get("/health")
def health(engine: Annotated[Engine, Depends(get_engine)], response: Response) -> Health:
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
    except SQLAlchemyError:
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
        return Health(status="unavailable", database="unreachable")
    return Health(status="ok", database="ok")
