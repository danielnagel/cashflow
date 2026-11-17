import uuid
from datetime import date, datetime

from sqlalchemy import DateTime, MetaData, String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

NAMING_CONVENTION = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s",
}


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
    last_fetched_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
