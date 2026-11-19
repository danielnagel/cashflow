import uuid
from datetime import date, datetime
from decimal import Decimal

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from cashflow.api.auth import CurrentUser
from cashflow.db import DbSession
from cashflow.fetching import AccountState, AccountStatus, ErrorCode
from cashflow.ledger import FetchWarning
from cashflow.models import Account, FetchRun
from cashflow.queries import gaps_of, latest_balance
from cashflow.runtime import Runtime, RuntimeDep

router = APIRouter()


class FetchState(BaseModel):
    state: AccountState
    error: ErrorCode | None


class LastRun(BaseModel):
    finished_at: datetime
    new_count: int
    skipped_count: int
    warning: FetchWarning | None


class GapOut(BaseModel):
    start: date
    end: date


class BalanceOut(BaseModel):
    amount: Decimal
    date: date


class AccountOut(BaseModel):
    id: uuid.UUID
    iban: str
    name: str
    product_name: str
    owner_name: str
    covered_from: date | None
    covered_to: date | None
    fetch: FetchState
    last_run: LastRun | None
    gaps: list[GapOut]
    balance: BalanceOut | None


class AccountList(BaseModel):
    selected_id: uuid.UUID | None
    accounts: list[AccountOut]


class SelectAccount(BaseModel):
    account_id: uuid.UUID


def supported_account(session: Session, account_id: uuid.UUID) -> Account:
    account = session.get(Account, account_id)
    if account is None or not account.supports_transactions:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="account_not_found")
    return account


def _last_run(session: Session, account_id: uuid.UUID) -> LastRun | None:
    run = session.scalar(
        select(FetchRun)
        .where(FetchRun.account_id == account_id, FetchRun.status == "ok")
        .order_by(FetchRun.finished_at.desc())
        .limit(1)
    )
    if run is None or run.finished_at is None:
        return None
    return LastRun(
        finished_at=run.finished_at,
        new_count=run.new_count,
        skipped_count=run.skipped_count,
        warning=FetchWarning(run.warning) if run.warning else None,
    )


def _account_out(session: Session, account: Account, fetch: AccountStatus) -> AccountOut:
    snapshot = latest_balance(session, account.id)
    return AccountOut(
        id=account.id,
        iban=account.iban,
        name=account.name,
        product_name=account.product_name,
        owner_name=account.owner_name,
        covered_from=account.covered_from,
        covered_to=account.covered_to,
        fetch=FetchState(state=fetch.state, error=fetch.error),
        last_run=_last_run(session, account.id),
        gaps=[GapOut(start=g.gap_from, end=g.gap_to) for g in gaps_of(session, account.id)],
        balance=BalanceOut(amount=snapshot.balance, date=snapshot.date) if snapshot else None,
    )


def _selected(runtime: Runtime, accounts: list[Account]) -> uuid.UUID | None:
    selected = runtime.bank.selected_account_id
    return selected if any(a.id == selected for a in accounts) else None


@router.get("/accounts")
def list_accounts(_: CurrentUser, runtime: RuntimeDep, session: DbSession) -> AccountList:
    accounts = list(
        session.scalars(select(Account).where(Account.supports_transactions).order_by(Account.iban))
    )
    states = runtime.fetcher.status().accounts
    return AccountList(
        selected_id=_selected(runtime, accounts),
        accounts=[_account_out(session, a, states.get(a.id, AccountStatus())) for a in accounts],
    )


@router.put("/session/account", status_code=status.HTTP_204_NO_CONTENT)
def select_account(
    body: SelectAccount, _: CurrentUser, runtime: RuntimeDep, session: DbSession
) -> None:
    supported_account(session, body.account_id)
    runtime.bank.selected_account_id = body.account_id
    runtime.fetcher.start(only_if_due=True)
