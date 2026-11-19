"""Stores fetched statements and derives coverage, gaps and balance checks."""

import uuid
from collections.abc import Sequence
from dataclasses import dataclass
from datetime import date, datetime, timedelta
from decimal import Decimal
from enum import StrEnum

from sqlalchemy import delete, func, select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from cashflow.camt import CamtEntry, CamtError, CamtReport, parse
from cashflow.models import (
    Account,
    BalanceSnapshot,
    CoverageGap,
    PendingTransaction,
    Transaction,
)
from cashflow.normalize import normalize, with_hashes
from cashflow.sources.base import Balance, BankAccount, Statement

HISTORY_DAYS = 90
"""How far back the bank delivers transactions."""
OVERLAP_DAYS = 14
REFETCH_INTERVAL = timedelta(minutes=15)


class FetchWarning(StrEnum):
    STATEMENT_INCONSISTENT = "statement_inconsistent"
    BALANCE_MISMATCH = "balance_mismatch"


@dataclass(frozen=True)
class Gap:
    start: date
    end: date


def earliest_available(today: date) -> date:
    return today - timedelta(days=HISTORY_DAYS - 1)


def fetch_start(covered_to: date | None, today: date) -> date:
    """First day to request: everything since the last fetch with some overlap, but never more
    than the bank delivers."""
    earliest = earliest_available(today)
    if covered_to is None:
        return earliest
    return max(covered_to - timedelta(days=OVERLAP_DAYS), earliest)


def detect_gap(covered_to: date | None, start: date) -> Gap | None:
    if covered_to is None or covered_to + timedelta(days=1) >= start:
        return None
    return Gap(covered_to + timedelta(days=1), start - timedelta(days=1))


def fetch_due(last_fetched_at: datetime | None, now: datetime) -> bool:
    return last_fetched_at is None or now - last_fetched_at >= REFETCH_INTERVAL


def statement_consistent(report: CamtReport) -> bool:
    if report.opening_balance is None or report.closing_balance is None:
        return True
    booked = sum((e.amount for e in report.entries if e.booked), Decimal(0))
    return report.opening_balance + booked == report.closing_balance


def balance_difference(
    current_balance: Decimal, booked_since_start: Decimal, reported_opening: Decimal
) -> Decimal:
    """Difference between the opening balance calculated back from the current balance and the
    stored transactions, and the opening balance the bank reported."""
    return current_balance - booked_since_start - reported_opening


@dataclass(frozen=True)
class FetchResult:
    new_count: int
    skipped_count: int
    warning: FetchWarning | None
    gap: Gap | None


def upsert_accounts(session: Session, accounts: Sequence[BankAccount]) -> list[Account]:
    stored = {a.iban: a for a in session.scalars(select(Account))}
    result = []
    for bank_account in accounts:
        account = stored.get(bank_account.iban)
        if account is None:
            account = Account(iban=bank_account.iban)
            session.add(account)
        account.name = bank_account.product_name or bank_account.iban
        account.bank_code = bank_account.bank_code
        account.product_name = bank_account.product_name
        account.owner_name = bank_account.owner_name
        account.supports_transactions = bank_account.supports_transactions
        result.append(account)
    session.flush()
    return result


def _reports(documents: Sequence[str], iban: str) -> list[CamtReport]:
    reports = [report for document in documents for report in parse(document)]
    for report in reports:
        if report.iban.replace(" ", "") != iban:
            raise CamtError(f"statement for another account: {report.iban}")
    return reports


def _transaction_row(
    account_id: uuid.UUID, entry: CamtEntry, hash_: str, source: str, now: datetime
) -> dict[str, object]:
    normalized = normalize(entry)
    return {
        "id": uuid.uuid4(),
        "account_id": account_id,
        "booking_date": entry.booking_date,
        "value_date": entry.value_date,
        "amount": entry.amount,
        "currency": entry.currency,
        "counterparty_name": normalized.counterparty_name,
        "counterparty_iban": entry.counterparty_iban,
        "purpose": normalized.purpose,
        "posting_text": entry.posting_text,
        "creditor_id": normalized.creditor_id,
        "mandate_ref": normalized.mandate_ref,
        "end_to_end_ref": normalized.end_to_end_ref,
        "card_payment": normalized.card_payment,
        "raw": {"camt": entry.xml},
        "hash": hash_,
        "source": source,
        "imported_at": now,
    }


def store_statement(
    session: Session,
    account: Account,
    start: date,
    statement: Statement,
    balance: Balance,
    source: str,
    today: date,
    now: datetime,
) -> FetchResult:
    """Stores one fetch of one account. Raises CamtError for unreadable statements."""
    booked_reports = _reports(statement.booked, account.iban)
    pending_reports = _reports(statement.pending, account.iban)
    booked = [e for report in booked_reports for e in report.entries if e.booked]
    pending = [e for report in booked_reports + pending_reports for e in report.entries]
    pending = [e for e in pending if not e.booked]

    rows = [
        _transaction_row(account.id, entry, hash_, source, now)
        for entry, hash_ in with_hashes(account.iban, booked)
    ]
    new_count = 0
    if rows:
        inserted = session.execute(
            insert(Transaction)
            .values(rows)
            .on_conflict_do_nothing(index_elements=["hash"])
            .returning(Transaction.id)
        )
        new_count = len(inserted.all())

    session.execute(delete(PendingTransaction).where(PendingTransaction.account_id == account.id))
    for entry in pending:
        normalized = normalize(entry)
        session.add(
            PendingTransaction(
                account_id=account.id,
                booking_date=entry.booking_date,
                amount=entry.amount,
                counterparty_name=normalized.counterparty_name,
                purpose=normalized.purpose,
                creditor_id=normalized.creditor_id,
                raw={"camt": entry.xml},
                fetched_at=now,
            )
        )

    session.add(
        BalanceSnapshot(
            account_id=account.id, date=balance.date, balance=balance.amount, fetched_at=now
        )
    )

    warning = None
    openings = [r.opening_balance for r in booked_reports if r.opening_balance is not None]
    if not all(statement_consistent(report) for report in booked_reports):
        warning = FetchWarning.STATEMENT_INCONSISTENT
    elif openings:
        session.flush()
        booked_since_start = session.scalar(
            select(func.coalesce(func.sum(Transaction.amount), 0)).where(
                Transaction.account_id == account.id, Transaction.booking_date >= start
            )
        )
        # Reports come in chronological order; the first opening balance is the one at start.
        if balance_difference(balance.amount, Decimal(booked_since_start or 0), openings[0]):
            warning = FetchWarning.BALANCE_MISMATCH

    gap = detect_gap(account.covered_to, start)
    if gap is not None:
        session.add(
            CoverageGap(account_id=account.id, gap_from=gap.start, gap_to=gap.end, detected_at=now)
        )
        account.covered_from = start
    elif account.covered_from is None or account.covered_from > start:
        account.covered_from = start
    account.covered_to = max(today, account.covered_to or today)
    account.last_fetched_at = now

    return FetchResult(
        new_count=new_count, skipped_count=len(rows) - new_count, warning=warning, gap=gap
    )
