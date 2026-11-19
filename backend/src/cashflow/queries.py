"""Read side: monthly summaries and transaction lists with the balance after each booking."""

import calendar
import uuid
from collections.abc import Sequence
from dataclasses import dataclass
from datetime import date
from decimal import Decimal
from enum import StrEnum
from typing import Any

from sqlalchemy import ColumnElement, case, func, literal, or_, select
from sqlalchemy.orm import Session

from cashflow.models import Account, BalanceSnapshot, CoverageGap, PendingTransaction, Transaction


@dataclass(frozen=True, order=True)
class Month:
    year: int
    month: int

    @classmethod
    def parse(cls, value: str) -> "Month":
        year, month = value.split("-")
        if len(year) != 4 or len(month) != 2:
            raise ValueError(value)
        result = cls(int(year), int(month))
        if not 1 <= result.month <= 12:
            raise ValueError(value)
        return result

    @classmethod
    def of(cls, day: date) -> "Month":
        return cls(day.year, day.month)

    @property
    def first_day(self) -> date:
        return date(self.year, self.month, 1)

    @property
    def last_day(self) -> date:
        return date(self.year, self.month, calendar.monthrange(self.year, self.month)[1])

    def next(self) -> "Month":
        return Month(self.year + 1, 1) if self.month == 12 else Month(self.year, self.month + 1)

    def __str__(self) -> str:
        return f"{self.year:04d}-{self.month:02d}"


class Kind(StrEnum):
    ALL = "all"
    INCOME = "income"
    EXPENSE = "expense"


class SortField(StrEnum):
    BOOKING_DATE = "booking_date"
    AMOUNT = "amount"
    COUNTERPARTY = "counterparty_name"


class SortOrder(StrEnum):
    ASC = "asc"
    DESC = "desc"


@dataclass(frozen=True)
class MonthSummary:
    month: Month
    income: Decimal
    expense: Decimal
    complete: bool

    @property
    def diff(self) -> Decimal:
        return self.income - self.expense


def month_complete(
    month: Month, covered_from: date | None, covered_to: date | None, gaps: Sequence[CoverageGap]
) -> bool:
    """A month is complete once it is over and every day of it was delivered by the bank."""
    if covered_from is None or covered_to is None:
        return False
    if covered_from > month.first_day or covered_to <= month.last_day:
        return False
    return not any(g.gap_from <= month.last_day and g.gap_to >= month.first_day for g in gaps)


def monthly_summary(
    session: Session, account: Account, first: Month, last: Month
) -> list[MonthSummary]:
    month_start = func.date_trunc("month", Transaction.booking_date)
    rows = session.execute(
        select(
            month_start,
            func.coalesce(func.sum(case((Transaction.amount > 0, Transaction.amount))), 0),
            func.coalesce(func.sum(case((Transaction.amount < 0, -Transaction.amount))), 0),
        )
        .where(
            Transaction.account_id == account.id,
            Transaction.booking_date >= first.first_day,
            Transaction.booking_date <= last.last_day,
        )
        .group_by(month_start)
    ).all()
    totals = {Month.of(row[0]): (Decimal(row[1]), Decimal(row[2])) for row in rows}
    gaps = gaps_of(session, account.id)

    result = []
    month = first
    while month <= last:
        income, expense = totals.get(month, (Decimal(0), Decimal(0)))
        complete = month_complete(month, account.covered_from, account.covered_to, gaps)
        result.append(MonthSummary(month, income, expense, complete))
        month = month.next()
    return result


def gaps_of(session: Session, account_id: uuid.UUID) -> list[CoverageGap]:
    return list(
        session.scalars(
            select(CoverageGap)
            .where(CoverageGap.account_id == account_id)
            .order_by(CoverageGap.gap_from)
        )
    )


def latest_balance(session: Session, account_id: uuid.UUID) -> BalanceSnapshot | None:
    return session.scalar(
        select(BalanceSnapshot)
        .where(BalanceSnapshot.account_id == account_id)
        .order_by(BalanceSnapshot.fetched_at.desc(), BalanceSnapshot.date.desc())
        .limit(1)
    )


@dataclass(frozen=True)
class TransactionFilter:
    start: date | None = None
    end: date | None = None
    kind: Kind = Kind.ALL
    search: str = ""


def _escape_like(value: str) -> str:
    return value.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")


def _conditions(
    columns: Any, account_id: uuid.UUID, where: TransactionFilter
) -> list[ColumnElement[bool]]:
    conditions: list[ColumnElement[bool]] = [columns.account_id == account_id]
    if where.start is not None:
        conditions.append(columns.booking_date >= where.start)
    if where.end is not None:
        conditions.append(columns.booking_date <= where.end)
    if where.kind is Kind.INCOME:
        conditions.append(columns.amount > 0)
    elif where.kind is Kind.EXPENSE:
        conditions.append(columns.amount < 0)
    search = where.search.strip()
    if search:
        pattern = f"%{_escape_like(search)}%"
        conditions.append(
            or_(
                columns.counterparty_name.ilike(pattern, escape="\\"),
                columns.purpose.ilike(pattern, escape="\\"),
            )
        )
    return conditions


@dataclass(frozen=True)
class TransactionRow:
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


@dataclass(frozen=True)
class TransactionPage:
    items: list[TransactionRow]
    total: int


def transactions(
    session: Session,
    account_id: uuid.UUID,
    where: TransactionFilter,
    sort: SortField,
    order: SortOrder,
    page: int,
    page_size: int,
) -> TransactionPage:
    snapshot = latest_balance(session, account_id)
    later = func.sum(Transaction.amount).over(
        order_by=(Transaction.booking_date.desc(), Transaction.seq.desc()), rows=(None, -1)
    )
    # Balance after a booking: the latest known balance minus everything booked after it.
    balance_after = (
        literal(snapshot.balance) - func.coalesce(later, 0)
        if snapshot is not None
        else literal(None, type_=Transaction.amount.type)
    )
    ledger = (
        select(Transaction, balance_after.label("balance_after"))
        .where(Transaction.account_id == account_id)
        .subquery()
    )
    conditions = _conditions(ledger.c, account_id, where)

    total = session.scalar(select(func.count()).select_from(ledger).where(*conditions)) or 0

    column = ledger.c[sort.value]
    keys = [column, ledger.c.booking_date, ledger.c.seq]
    ordering = [key.desc() if order is SortOrder.DESC else key.asc() for key in keys]
    rows = session.execute(
        select(ledger)
        .where(*conditions)
        .order_by(*ordering)
        .offset((page - 1) * page_size)
        .limit(page_size)
    ).all()

    return TransactionPage(
        items=[
            TransactionRow(
                id=row.id,
                booking_date=row.booking_date,
                value_date=row.value_date,
                amount=row.amount,
                currency=row.currency,
                counterparty_name=row.counterparty_name,
                counterparty_iban=row.counterparty_iban,
                purpose=row.purpose,
                posting_text=row.posting_text,
                card_payment=row.card_payment,
                balance_after=row.balance_after,
            )
            for row in rows
        ],
        total=total,
    )


def pending_transactions(
    session: Session, account_id: uuid.UUID, where: TransactionFilter
) -> list[PendingTransaction]:
    conditions = _conditions(PendingTransaction, account_id, where)
    return list(
        session.scalars(
            select(PendingTransaction)
            .where(*conditions)
            .order_by(PendingTransaction.booking_date, PendingTransaction.id)
        )
    )
