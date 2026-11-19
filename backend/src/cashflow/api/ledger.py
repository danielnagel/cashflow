import uuid
from datetime import date
from decimal import Decimal
from typing import Annotated

from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel

from cashflow.api.accounts import supported_account
from cashflow.api.auth import CurrentUser
from cashflow.db import DbSession
from cashflow.queries import (
    Kind,
    Month,
    SortField,
    SortOrder,
    TransactionFilter,
    monthly_summary,
    pending_transactions,
    transactions,
)

router = APIRouter()

MAX_MONTHS = 120
MAX_PAGE_SIZE = 200


class MonthOut(BaseModel):
    month: str
    income: Decimal
    expense: Decimal
    diff: Decimal
    complete: bool


class TransactionOut(BaseModel):
    id: uuid.UUID
    booking_date: date
    value_date: date | None
    amount: Decimal
    currency: str
    counterparty_name: str
    counterparty_iban: str | None
    purpose: str
    posting_text: str
    card_payment: bool
    balance_after: Decimal | None


class PendingOut(BaseModel):
    id: uuid.UUID
    booking_date: date
    amount: Decimal
    counterparty_name: str
    purpose: str


class TransactionList(BaseModel):
    items: list[TransactionOut]
    total: int
    page: int
    page_size: int
    pending: list[PendingOut]


def _month(value: str) -> Month:
    try:
        return Month.parse(value)
    except ValueError:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_CONTENT, detail="invalid_month") from None


@router.get("/summary/monthly")
def summary(
    account_id: uuid.UUID,
    _: CurrentUser,
    session: DbSession,
    from_: Annotated[str, Query(alias="from")],
    to: str,
) -> list[MonthOut]:
    account = supported_account(session, account_id)
    first, last = _month(from_), _month(to)
    months = (last.year - first.year) * 12 + last.month - first.month + 1
    if not 1 <= months <= MAX_MONTHS:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_CONTENT, detail="invalid_range")
    return [
        MonthOut(
            month=str(m.month),
            income=m.income,
            expense=m.expense,
            diff=m.diff,
            complete=m.complete,
        )
        for m in monthly_summary(session, account, first, last)
    ]


@router.get("/transactions")
def list_transactions(
    account_id: uuid.UUID,
    _: CurrentUser,
    session: DbSession,
    month: str | None = None,
    from_date: date | None = None,
    to_date: date | None = None,
    type_: Annotated[Kind, Query(alias="type")] = Kind.ALL,
    q: Annotated[str, Query(max_length=200)] = "",
    sort: SortField = SortField.BOOKING_DATE,
    order: SortOrder = SortOrder.DESC,
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=MAX_PAGE_SIZE)] = 50,
) -> TransactionList:
    supported_account(session, account_id)
    start, end = from_date, to_date
    if month is not None:
        selected = _month(month)
        start, end = selected.first_day, selected.last_day
    where = TransactionFilter(start=start, end=end, kind=type_, search=q)

    result = transactions(session, account_id, where, sort, order, page, page_size)
    pending = pending_transactions(session, account_id, where)
    return TransactionList(
        items=[TransactionOut.model_validate(row, from_attributes=True) for row in result.items],
        total=result.total,
        page=page,
        page_size=page_size,
        pending=[PendingOut.model_validate(p, from_attributes=True) for p in pending],
    )
