"""Deterministic stand-in for the bank, used in development and in all automated tests.

The generated ledger mimics a typical German checking account: salary at the end of the month,
rent and savings by standing order, SEPA direct debits with creditor ID and mandate, Visa card
payments and, every month, two identical bakery payments on the same day.

Every month is generated from its own seed, so a month looks the same no matter on which day the
bank is asked. Direct debits and card payments of the next days are delivered as pending and
turn into the identical booked entry once their day has come.
"""

import calendar
import random
from collections.abc import Iterator
from contextlib import contextmanager
from dataclasses import dataclass, field, replace
from datetime import date, datetime, time, timedelta
from decimal import Decimal
from enum import StrEnum
from zoneinfo import ZoneInfo

from cashflow.sources import camt_writer
from cashflow.sources.base import (
    Balance,
    BankAccount,
    BankSession,
    BankUnreachableError,
    PinWrongError,
    Statement,
    TanRequiredError,
)
from cashflow.sources.camt_writer import Entry

BIC = "EXMPDEFFXXX"
BANK_CODE = "12345678"
EPOCH = date(2025, 1, 1)
"""The generated ledgers start here with their opening balance."""
PENDING_DAYS = 10

CHECKING = BankAccount(
    iban="DE94123456780000001234",
    bic=BIC,
    bank_code=BANK_CODE,
    account_number="0000001234",
    product_name="Girokonto",
    owner_name="Erika Mustermann",
    supports_transactions=True,
)
SAVINGS = BankAccount(
    iban="DE95123456780000005678",
    bic=BIC,
    bank_code=BANK_CODE,
    account_number="0000005678",
    product_name="Tagesgeld",
    owner_name="Erika Mustermann",
    supports_transactions=True,
)
LOAN = BankAccount(
    iban="DE93123456780000009012",
    bic=BIC,
    bank_code=BANK_CODE,
    account_number="0000009012",
    product_name="Darlehen",
    owner_name="Erika Mustermann",
    supports_transactions=False,
)
ACCOUNTS = (CHECKING, SAVINGS, LOAN)

DIRECT_DEBIT = ("NDDT", ("PMNT", "IDDT", "ESDD"), "Lastschrifteinzug")
TRANSFER_OUT = ("NTRF", ("PMNT", "ICDT", "ESCT"), "Überweisung")
STANDING_ORDER_OUT = ("NMSC", ("PMNT", "ICDT", "SDVA"), "Dauerauftrag/Terminueberweisung")
STANDING_ORDER_IN = ("NMSC", ("PMNT", "RCDT", "SDVA"), "Gutschrift aus Dauerauftrag")
SALARY = ("NMSC", ("PMNT", "RCDT", "ESCT"), "Gehalt/Rente")
CLOSING = ("NMSC", ("ACMT", "MCOP", "OTHR"), "Abschluss")


@dataclass(frozen=True)
class _Subscription:
    name: str
    creditor_id: str
    mandate: str
    amount: Decimal
    day: int
    purpose: str


SUBSCRIPTIONS = (
    _Subscription(
        "Stadtwerke Beispielstadt",
        "DE98ZZZ09999999999",
        "SW-100234",
        Decimal("84.00"),
        10,
        "Abschlag Strom",
    ),
    _Subscription(
        "Mobilfunk Muster GmbH",
        "DE12ZZZ00000123456",
        "MM-778899",
        Decimal("19.99"),
        15,
        "Mobilfunk Rechnung",
    ),
    _Subscription(
        "Streamingdienst Europe B.V.",
        "NL55ZZZ123456780000",
        "STR-4455",
        Decimal("12.99"),
        5,
        "Mitgliedschaft",
    ),
)
CARD_MERCHANTS = (
    ("REWE MARKT GMBH", "BEISPIELSTADT", Decimal("15"), Decimal("95")),
    ("EDEKA CENTER", "BEISPIELSTADT", Decimal("10"), Decimal("80")),
    ("ALDI SUED", "BEISPIELSTADT", Decimal("8"), Decimal("60")),
    ("ARAL STATION", "BEISPIELSTADT", Decimal("40"), Decimal("90")),
    ("DROGERIEMARKT", "BEISPIELSTADT", Decimal("5"), Decimal("35")),
)
BAKERY = "BAECKEREI KORN"


class FakeScenario(StrEnum):
    OK = "ok"
    TAN_REQUIRED = "tan_required"
    UNREACHABLE = "unreachable"


@dataclass
class FakeControl:
    """Lets the E2E tests steer the fake bank."""

    scenario: FakeScenario = FakeScenario.OK
    days_ahead: int = 0
    """Shifts the bank's today into the future, e.g. to get pending entries booked."""
    logins: int = 0


def _day(year: int, month: int, day: int) -> date:
    return date(year, month, min(day, calendar.monthrange(year, month)[1]))


def _months(start: date, end: date) -> Iterator[tuple[int, int]]:
    year, month = start.year, start.month
    while (year, month) <= (end.year, end.month):
        yield year, month
        year, month = (year + 1, 1) if month == 12 else (year, month + 1)


@dataclass
class _Ledger:
    opening: Decimal
    entries: list[Entry] = field(default_factory=list)


class _Month:
    def __init__(self, seed: int, year: int, month: int) -> None:
        # Test data, not crypto.
        self.random = random.Random(f"cashflow-fake-{seed}-{year}-{month:02d}")  # noqa: S311
        self.year = year
        self.month = month

    def day(self, day: int) -> date:
        return _day(self.year, self.month, day)

    def reference(self) -> str:
        return str(self.random.randint(100000, 999999))

    def money(self, low: Decimal, high: Decimal) -> Decimal:
        cents = self.random.randint(int(low * 100), int(high * 100))
        return Decimal(cents) / 100

    def entry(
        self,
        kind: tuple[str, tuple[str, str, str], str],
        booking_date: date,
        amount: Decimal,
        name: str,
        purpose: tuple[str, ...],
        iban: str | None = None,
    ) -> Entry:
        code, domain, posting_text = kind
        return Entry(
            booking_date=booking_date,
            value_date=booking_date,
            amount=amount,
            posting_text=posting_text,
            proprietary_code=code,
            domain=domain,
            counterparty_name=name,
            purpose=purpose,
            reference=self.reference(),
            counterparty_iban=iban,
            counterparty_bic=BIC if iban else None,
        )

    def card_payment(self, booking_date: date, merchant: str, city: str, amount: Decimal) -> Entry:
        hour, minute = self.random.randint(7, 21), self.random.randint(0, 59)
        card_purpose = (
            f"NR XXXX 4321 {city} DE",
            "KAUFUMSATZ",
            f"{booking_date:%d.%m} {hour:02d}.{minute:02d}",
            str(self.random.randint(100000, 999999)),
            f"ARN{self.random.randint(10**22, 10**23 - 1)}",
            "Apple Pay",
        )
        return self.entry(
            DIRECT_DEBIT, booking_date, -amount, f"VISA {merchant}".ljust(60), card_purpose
        )

    def direct_debit(self, booking_date: date, subscription: _Subscription) -> Entry:
        purpose = (
            f"{subscription.purpose} {booking_date:%m/%Y}",
            f"EREF+{subscription.mandate}-{booking_date:%Y%m}",
            f"MREF+{subscription.mandate}",
            f"CRED+{subscription.creditor_id}",
        )
        return self.entry(
            DIRECT_DEBIT, booking_date, -subscription.amount, subscription.name, purpose
        )

    def generate(self, checking: _Ledger, savings: _Ledger) -> None:
        rent_day = self.day(1)
        checking.entries.append(
            self.entry(
                STANDING_ORDER_OUT,
                rent_day,
                Decimal("-950.00"),
                "Hausverwaltung Beispiel",
                ("Miete Wohnung 3. OG",),
                iban="DE89370400440532013000",
            )
        )
        checking.entries.append(
            self.entry(
                STANDING_ORDER_OUT,
                rent_day,
                Decimal("-200.00"),
                CHECKING.owner_name,
                ("Sparen",),
                iban=SAVINGS.iban,
            )
        )
        savings.entries.append(
            self.entry(
                STANDING_ORDER_IN, rent_day, Decimal("200.00"), CHECKING.owner_name, ("Sparen",)
            )
        )

        checking.entries.append(
            self.entry(
                SALARY,
                self.day(self.random.randint(26, 30)),
                Decimal("3245.67"),
                "Muster Software GmbH",
                (
                    f"LOHN / GEHALT {self.month:02d}/{self.year % 100:02d}",
                    f"EREF+{self.year}{self.month:02d}SAL",
                ),
            )
        )

        for subscription in SUBSCRIPTIONS:
            checking.entries.append(self.direct_debit(self.day(subscription.day), subscription))

        for _ in range(self.random.randint(2, 4)):
            checking.entries.append(
                self.entry(
                    DIRECT_DEBIT,
                    self.day(self.random.randint(1, 28)),
                    -self.money(Decimal("9"), Decimal("120")),
                    "AMAZON PAYMENTS EUROPE S.C.A.",
                    (f"302-{self.random.randint(1_000_000, 9_999_999)}", "Amazon.de"),
                )
            )

        for _ in range(self.random.randint(10, 16)):
            merchant, city, low, high = self.random.choice(CARD_MERCHANTS)
            checking.entries.append(
                self.card_payment(
                    self.day(self.random.randint(1, 28)), merchant, city, self.money(low, high)
                )
            )

        twin = self.card_payment(
            self.day(self.random.randint(1, 28)), BAKERY, "BEISPIELSTADT", Decimal("3.50")
        )
        checking.entries.extend([twin, twin])

        if self.month == 12:
            savings.entries.append(
                self.entry(
                    CLOSING,
                    self.day(31),
                    self.money(Decimal("20"), Decimal("80")),
                    "Abschluss",
                    ("Zinsen",),
                )
            )


def _ledgers(seed: int, until: date) -> dict[str, _Ledger]:
    checking = _Ledger(opening=Decimal("1500.00"))
    savings = _Ledger(opening=Decimal("5000.00"))
    for year, month in _months(EPOCH, until):
        _Month(seed, year, month).generate(checking, savings)
    for ledger in (checking, savings):
        ledger.entries.sort(key=lambda e: e.booking_date)
    return {CHECKING.iban: checking, SAVINGS.iban: savings}


class _FakeSession:
    def __init__(self, seed: int, today: date) -> None:
        self._today = today
        self._ledgers = _ledgers(seed, today + timedelta(days=PENDING_DAYS))
        self._created = datetime.combine(today, time(12))

    def accounts(self) -> list[BankAccount]:
        return list(ACCOUNTS)

    def _booked(self, iban: str) -> list[Entry]:
        return [e for e in self._ledgers[iban].entries if e.booking_date <= self._today]

    def _pending(self, iban: str) -> list[Entry]:
        until = self._today + timedelta(days=PENDING_DAYS)
        return [
            replace(e, pending=True)
            for e in self._ledgers[iban].entries
            if self._today < e.booking_date <= until and e.proprietary_code == DIRECT_DEBIT[0]
        ]

    def _balance_until(self, iban: str, before: date) -> Decimal:
        ledger = self._ledgers[iban]
        return ledger.opening + sum(
            (e.amount for e in self._booked(iban) if e.booking_date < before), Decimal(0)
        )

    def balance(self, iban: str) -> Balance:
        return Balance(
            amount=self._balance_until(iban, self._today + timedelta(days=1)),
            currency="EUR",
            date=self._today,
        )

    def statement(self, iban: str, start: date) -> Statement:
        account = next(a for a in ACCOUNTS if a.iban == iban)
        booked = [e for e in self._booked(iban) if e.booking_date >= start]
        report_id = f"{account.account_number}-{start:%Y%m%d}-{self._today:%Y%m%d}"
        booked_xml = camt_writer.render(
            iban=iban,
            bic=account.bic,
            report_id=report_id,
            created=self._created,
            entries=booked,
            opening=(self._balance_until(iban, start), start),
            closing=(self.balance(iban).amount, self._today),
        )
        pending_xml = camt_writer.render(
            iban=iban,
            bic=account.bic,
            report_id=f"{report_id}-P",
            created=self._created,
            entries=self._pending(iban),
        )
        return Statement(booked=[booked_xml], pending=[pending_xml])


class FakeSource:
    def __init__(
        self,
        seed: int = 1,
        today: date | None = None,
        pin: str = "",
        expected_pin: str = "",
        control: FakeControl | None = None,
    ) -> None:
        self.seed = seed
        self._today = today
        self._pin = pin
        self._expected_pin = expected_pin
        self.control = control or FakeControl()

    @contextmanager
    def session(self) -> Iterator[BankSession]:
        self.control.logins += 1
        if self._pin != self._expected_pin:
            raise PinWrongError
        if self.control.scenario is FakeScenario.TAN_REQUIRED:
            raise TanRequiredError
        if self.control.scenario is FakeScenario.UNREACHABLE:
            raise BankUnreachableError
        today = self._today or datetime.now(ZoneInfo("Europe/Berlin")).date()
        yield _FakeSession(self.seed, today + timedelta(days=self.control.days_ahead))
