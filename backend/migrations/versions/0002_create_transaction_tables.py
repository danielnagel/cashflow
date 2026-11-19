"""create transaction tables

Revision ID: 0002
Revises: 0001
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0002"
down_revision: str | None = "0001"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "app_user",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("username", sa.String(), nullable=False),
        sa.Column("password_hash", sa.String(), nullable=False),
        sa.Column("totp_secret", sa.String(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_app_user")),
        sa.UniqueConstraint("username", name=op.f("uq_app_user_username")),
    )
    op.create_table(
        "balance_snapshot",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("account_id", sa.Uuid(), nullable=False),
        sa.Column("date", sa.Date(), nullable=False),
        sa.Column("balance", sa.Numeric(precision=12, scale=2), nullable=False),
        sa.Column("fetched_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(
            ["account_id"], ["account.id"], name=op.f("fk_balance_snapshot_account_id_account")
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_balance_snapshot")),
    )
    op.create_index(
        op.f("ix_balance_snapshot_account_id"), "balance_snapshot", ["account_id"], unique=False
    )
    op.create_table(
        "coverage_gap",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("account_id", sa.Uuid(), nullable=False),
        sa.Column("gap_from", sa.Date(), nullable=False),
        sa.Column("gap_to", sa.Date(), nullable=False),
        sa.Column("detected_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(
            ["account_id"], ["account.id"], name=op.f("fk_coverage_gap_account_id_account")
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_coverage_gap")),
    )
    op.create_index(
        op.f("ix_coverage_gap_account_id"), "coverage_gap", ["account_id"], unique=False
    )
    op.create_table(
        "fetch_run",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("account_id", sa.Uuid(), nullable=True),
        sa.Column("started_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("finished_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("status", sa.String(), nullable=False),
        sa.Column("new_count", sa.Integer(), nullable=False),
        sa.Column("skipped_count", sa.Integer(), nullable=False),
        sa.Column("error", sa.String(), nullable=True),
        sa.Column("warning", sa.String(), nullable=True),
        sa.CheckConstraint(
            "status IN ('running', 'ok', 'error')", name=op.f("ck_fetch_run_status")
        ),
        sa.ForeignKeyConstraint(
            ["account_id"], ["account.id"], name=op.f("fk_fetch_run_account_id_account")
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_fetch_run")),
    )
    op.create_index(op.f("ix_fetch_run_account_id"), "fetch_run", ["account_id"], unique=False)
    op.create_table(
        "pending_transaction",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("account_id", sa.Uuid(), nullable=False),
        sa.Column("booking_date", sa.Date(), nullable=False),
        sa.Column("amount", sa.Numeric(precision=12, scale=2), nullable=False),
        sa.Column("counterparty_name", sa.String(), nullable=False),
        sa.Column("purpose", sa.String(), nullable=False),
        sa.Column("creditor_id", sa.String(), nullable=True),
        sa.Column("raw", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("fetched_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(
            ["account_id"], ["account.id"], name=op.f("fk_pending_transaction_account_id_account")
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_pending_transaction")),
    )
    op.create_index(
        op.f("ix_pending_transaction_account_id"),
        "pending_transaction",
        ["account_id"],
        unique=False,
    )
    op.create_table(
        "transaction",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("seq", sa.BigInteger(), sa.Identity(always=False), nullable=False),
        sa.Column("account_id", sa.Uuid(), nullable=False),
        sa.Column("booking_date", sa.Date(), nullable=False),
        sa.Column("value_date", sa.Date(), nullable=True),
        sa.Column("amount", sa.Numeric(precision=12, scale=2), nullable=False),
        sa.Column("currency", sa.String(length=3), nullable=False),
        sa.Column("counterparty_name", sa.String(), nullable=False),
        sa.Column("counterparty_iban", sa.String(length=34), nullable=True),
        sa.Column("purpose", sa.String(), nullable=False),
        sa.Column("posting_text", sa.String(), nullable=False),
        sa.Column("creditor_id", sa.String(), nullable=True),
        sa.Column("mandate_ref", sa.String(), nullable=True),
        sa.Column("end_to_end_ref", sa.String(), nullable=True),
        sa.Column("card_payment", sa.Boolean(), nullable=False),
        sa.Column("raw", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("hash", sa.String(length=64), nullable=False),
        sa.Column("source", sa.String(), nullable=False),
        sa.Column("imported_at", sa.DateTime(timezone=True), nullable=False),
        sa.CheckConstraint(
            "source IN ('fints', 'pdf', 'fake')", name=op.f("ck_transaction_source")
        ),
        sa.ForeignKeyConstraint(
            ["account_id"], ["account.id"], name=op.f("fk_transaction_account_id_account")
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_transaction")),
        sa.UniqueConstraint("hash", name=op.f("uq_transaction_hash")),
        sa.UniqueConstraint("seq", name=op.f("uq_transaction_seq")),
    )
    op.create_index(
        "ix_transaction_account_id_booking_date",
        "transaction",
        ["account_id", "booking_date"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index("ix_transaction_account_id_booking_date", table_name="transaction")
    op.drop_table("transaction")
    op.drop_index(op.f("ix_pending_transaction_account_id"), table_name="pending_transaction")
    op.drop_table("pending_transaction")
    op.drop_index(op.f("ix_fetch_run_account_id"), table_name="fetch_run")
    op.drop_table("fetch_run")
    op.drop_index(op.f("ix_coverage_gap_account_id"), table_name="coverage_gap")
    op.drop_table("coverage_gap")
    op.drop_index(op.f("ix_balance_snapshot_account_id"), table_name="balance_snapshot")
    op.drop_table("balance_snapshot")
    op.drop_table("app_user")
