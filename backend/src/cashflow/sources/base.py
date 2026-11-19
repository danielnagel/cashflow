from contextlib import AbstractContextManager
from dataclasses import dataclass
from datetime import date
from decimal import Decimal
from typing import Protocol


@dataclass(frozen=True)
class BankAccount:
    iban: str
    bic: str
    bank_code: str
    account_number: str
    product_name: str
    owner_name: str
    supports_transactions: bool


@dataclass(frozen=True)
class Balance:
    amount: Decimal
    currency: str
    date: date


@dataclass(frozen=True)
class Statement:
    """Raw camt.052 documents as delivered by the bank."""

    booked: list[str]
    pending: list[str]


class BankError(Exception):
    """Base of all errors the bank or the connection to it can cause."""


class PinWrongError(BankError):
    """The bank rejected the PIN. It must not be used again."""


class TanRequiredError(BankError):
    """The bank asked for a TAN approval, which cashflow does not support."""


class AccountLockedError(BankError):
    """The bank has temporarily locked the online banking access."""


class BankUnreachableError(BankError):
    """The bank's server could not be reached or did not answer properly."""


class BankRejectedError(BankError):
    """The bank answered with an error that has no more specific meaning."""


class BankSession(Protocol):
    """One dialog with the bank. Read-only by design: there are no methods that move money."""

    def accounts(self) -> list[BankAccount]: ...

    def balance(self, iban: str) -> Balance: ...

    def statement(self, iban: str, start: date) -> Statement: ...


class TransactionSource(Protocol):
    def session(self) -> AbstractContextManager[BankSession]: ...
