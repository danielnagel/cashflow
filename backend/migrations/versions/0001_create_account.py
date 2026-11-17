"""create account

Revision ID: 0001
Revises:
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "0001"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "account",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("iban", sa.String(length=34), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("bank_code", sa.String(length=11), nullable=False),
        sa.Column("product_name", sa.String(), nullable=False),
        sa.Column("owner_name", sa.String(), nullable=False),
        sa.Column("supports_transactions", sa.Boolean(), nullable=False),
        sa.Column("covered_from", sa.Date(), nullable=True),
        sa.Column("covered_to", sa.Date(), nullable=True),
        sa.Column("last_fetched_at", sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint("id", name=op.f("pk_account")),
        sa.UniqueConstraint("iban", name=op.f("uq_account_iban")),
    )


def downgrade() -> None:
    op.drop_table("account")
