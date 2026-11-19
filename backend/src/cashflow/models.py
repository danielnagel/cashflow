import uuid
from datetime import date, datetime
from decimal import Decimal
from typing import Any

from sqlalchemy import (
    BigInteger,
    CheckConstraint,
    DateTime,
    ForeignKey,
    Identity,
    Index,
    MetaData,
    Numeric,
    String,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

NAMING_CONVENTION = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s",
}

Money = Numeric(12, 2)
Timestamp = DateTime(timezone=True)


class Base(DeclarativeBase):
    metadata = MetaData(naming_convention=NAMING_CONVENTION)


class Account(Base):
    __tablename__ = "account"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    iban: Mapped[str] = mapped_column(String(34), unique=True)
    name: Mapped[str]
    bank_code: Mapped[str] = mapped_column(String(11))
    product_name: Mapped[str]
    owner_name: Mapped[str]
    supports_transactions: Mapped[bool]
    covered_from: Mapped[date | None]
    covered_to: Mapped[date | None]
    last_fetched_at: Mapped[datetime | None] = mapped_column(Timestamp)


class AppUser(Base):
    __tablename__ = "app_user"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    username: Mapped[str] = mapped_column(unique=True)
    password_hash: Mapped[str]
    totp_secret: Mapped[str]
    """Encrypted with the key from TOTP_ENCRYPTION_KEY."""
    created_at: Mapped[datetime] = mapped_column(Timestamp)


class Transaction(Base):
    __tablename__ = "transaction"
    __table_args__ = (
        CheckConstraint("source IN ('fints', 'pdf', 'fake')", name="source"),
        Index("ix_transaction_account_id_booking_date", "account_id", "booking_date"),
    )

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    seq: Mapped[int] = mapped_column(BigInteger, Identity(), unique=True)
    """Insertion order; orders transactions of the same day for the running balance."""
    account_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("account.id"))
    booking_date: Mapped[date]
    value_date: Mapped[date | None]
    amount: Mapped[Decimal] = mapped_column(Money)
    currency: Mapped[str] = mapped_column(String(3))
    counterparty_name: Mapped[str]
    counterparty_iban: Mapped[str | None] = mapped_column(String(34))
    purpose: Mapped[str]
    posting_text: Mapped[str]
    creditor_id: Mapped[str | None]
    mandate_ref: Mapped[str | None]
    end_to_end_ref: Mapped[str | None]
    card_payment: Mapped[bool]
    raw: Mapped[dict[str, Any]] = mapped_column(JSONB)
    hash: Mapped[str] = mapped_column(String(64), unique=True)
    source: Mapped[str]
    imported_at: Mapped[datetime] = mapped_column(Timestamp)


class PendingTransaction(Base):
    """Replaced completely by every fetch of the account."""

    __tablename__ = "pending_transaction"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    account_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("account.id"), index=True)
    booking_date: Mapped[date]
    amount: Mapped[Decimal] = mapped_column(Money)
    counterparty_name: Mapped[str]
    purpose: Mapped[str]
    creditor_id: Mapped[str | None]
    raw: Mapped[dict[str, Any]] = mapped_column(JSONB)
    fetched_at: Mapped[datetime] = mapped_column(Timestamp)


class BalanceSnapshot(Base):
    __tablename__ = "balance_snapshot"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    account_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("account.id"), index=True)
    date: Mapped[date]
    balance: Mapped[Decimal] = mapped_column(Money)
    fetched_at: Mapped[datetime] = mapped_column(Timestamp)


class FetchRun(Base):
    """One fetch of one account. Failures before an account is reached have no account."""

    __tablename__ = "fetch_run"
    __table_args__ = (CheckConstraint("status IN ('running', 'ok', 'error')", name="status"),)

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    account_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("account.id"), index=True)
    started_at: Mapped[datetime] = mapped_column(Timestamp)
    finished_at: Mapped[datetime | None] = mapped_column(Timestamp)
    status: Mapped[str]
    new_count: Mapped[int] = mapped_column(default=0)
    skipped_count: Mapped[int] = mapped_column(default=0)
    error: Mapped[str | None]
    warning: Mapped[str | None]


class CoverageGap(Base):
    """A period without transactions because the bank no longer delivered it."""

    __tablename__ = "coverage_gap"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    account_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("account.id"), index=True)
    gap_from: Mapped[date]
    gap_to: Mapped[date]
    detected_at: Mapped[datetime] = mapped_column(Timestamp)
