from enum import StrEnum

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

from cashflow.api.auth import CurrentUser
from cashflow.fetching import ErrorCode, StartResult
from cashflow.runtime import RuntimeDep

router = APIRouter()


class BankState(StrEnum):
    UNLOCKED = "unlocked"
    LOCKED = "locked"


class BankStatus(BaseModel):
    state: BankState
    fetching: bool
    error: ErrorCode | None


class UnlockRequest(BaseModel):
    pin: str = Field(min_length=1, max_length=64)


class FetchStarted(BaseModel):
    result: StartResult


@router.get("/bank/status")
def bank_status(_: CurrentUser, runtime: RuntimeDep) -> BankStatus:
    fetch = runtime.fetcher.status()
    return BankStatus(
        state=BankState.UNLOCKED if runtime.bank.unlocked else BankState.LOCKED,
        fetching=fetch.running,
        error=fetch.error,
    )


@router.post("/bank/unlock", status_code=status.HTTP_202_ACCEPTED)
def unlock(body: UnlockRequest, _: CurrentUser, runtime: RuntimeDep) -> FetchStarted:
    runtime.bank.unlock(body.pin)
    # The fetch is what checks the PIN: a rejected PIN is forgotten right away.
    return FetchStarted(result=runtime.fetcher.start())


@router.post("/bank/lock", status_code=status.HTTP_204_NO_CONTENT)
def lock(_: CurrentUser, runtime: RuntimeDep) -> None:
    runtime.bank.lock()


@router.post("/fetch", status_code=status.HTTP_202_ACCEPTED)
def fetch(_: CurrentUser, runtime: RuntimeDep) -> FetchStarted:
    result = runtime.fetcher.start()
    if result is StartResult.LOCKED:
        raise HTTPException(status.HTTP_409_CONFLICT, detail="bank_locked")
    if result is StartResult.RUNNING:
        raise HTTPException(status.HTTP_409_CONFLICT, detail="fetch_running")
    return FetchStarted(result=result)
