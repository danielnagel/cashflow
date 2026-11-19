"""Endpoints that let E2E tests control the backend. Only registered in e2e mode."""

from datetime import timedelta

from fastapi import APIRouter, status
from pydantic import BaseModel, Field
from sqlalchemy import Engine, select, update
from sqlalchemy.orm import Session

from cashflow.auth import create_user
from cashflow.models import Account, AppUser, Base
from cashflow.runtime import Runtime, RuntimeDep
from cashflow.sources.fake import FakeScenario

# Known credentials of the user the E2E tests log in with; the e2e stack is never public.
TEST_USERNAME = "e2e"
TEST_PASSWORD = "e2e-password"  # noqa: S105
TEST_TOTP_SECRET = "JBSWY3DPEHPK3PXPJBSWY3DPEHPK3PXP"  # noqa: S105

router = APIRouter()


def ensure_test_user(runtime: Runtime) -> None:
    engine: Engine = runtime.engine
    with Session(engine) as session:
        exists = session.scalar(select(AppUser.id).where(AppUser.username == TEST_USERNAME))
    if exists is None:
        create_user(
            engine, runtime.cipher, TEST_USERNAME, TEST_PASSWORD, TEST_TOTP_SECRET, runtime.clock()
        )


class BankControl(BaseModel):
    scenario: FakeScenario = FakeScenario.OK
    days_ahead: int = Field(default=0, ge=0, le=60)


class BankControlState(BankControl):
    logins: int


class AgeRequest(BaseModel):
    days: int = Field(ge=1, le=1000)


@router.post("/reset", status_code=status.HTTP_204_NO_CONTENT)
def reset(runtime: RuntimeDep) -> None:
    """Empties the database and forgets everything in memory, then recreates the test user."""
    runtime.reset()
    with runtime.engine.begin() as connection:
        for table in reversed(Base.metadata.sorted_tables):
            connection.execute(table.delete())
    ensure_test_user(runtime)


@router.put("/bank", status_code=status.HTTP_204_NO_CONTENT)
def control_bank(body: BankControl, runtime: RuntimeDep) -> None:
    runtime.fake_control.scenario = body.scenario
    runtime.fake_control.days_ahead = body.days_ahead


@router.get("/bank")
def bank_state(runtime: RuntimeDep) -> BankControlState:
    control = runtime.fake_control
    return BankControlState(
        scenario=control.scenario, days_ahead=control.days_ahead, logins=control.logins
    )


@router.post("/age", status_code=status.HTTP_204_NO_CONTENT)
def age(body: AgeRequest, runtime: RuntimeDep) -> None:
    """Pretends the last fetch of every account happened the given number of days earlier."""
    shift = timedelta(days=body.days)
    with runtime.engine.begin() as connection:
        connection.execute(
            update(Account).values(
                covered_from=Account.covered_from - body.days,
                covered_to=Account.covered_to - body.days,
                last_fetched_at=Account.last_fetched_at - shift,
            )
        )
