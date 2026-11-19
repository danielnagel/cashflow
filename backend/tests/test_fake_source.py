from collections import Counter
from datetime import date, timedelta
from decimal import Decimal

import pytest

from cashflow.sources.base import (
    BankError,
    BankUnreachableError,
    PinWrongError,
    Statement,
    TanRequiredError,
    TransactionSource,
)
from cashflow.sources.fake import CHECKING, LOAN, SAVINGS, FakeControl, FakeScenario, FakeSource
from tests import camt

TODAY = date(2026, 11, 17)
START = TODAY - timedelta(days=90)


def fetch(source: TransactionSource, iban: str, start: date = START) -> Statement:
    with source.session() as session:
        return session.statement(iban, start)


def test_same_seed_gives_same_transactions() -> None:
    first = fetch(FakeSource(seed=7, today=TODAY), CHECKING.iban)
    second = fetch(FakeSource(seed=7, today=TODAY), CHECKING.iban)

    assert first == second


def test_different_seed_gives_different_transactions() -> None:
    assert fetch(FakeSource(seed=1, today=TODAY), CHECKING.iban) != fetch(
        FakeSource(seed=2, today=TODAY), CHECKING.iban
    )


def test_accounts_include_one_without_transactions() -> None:
    with FakeSource(today=TODAY).session() as session:
        accounts = session.accounts()

    assert [a.product_name for a in accounts] == ["Girokonto", "Tagesgeld", "Darlehen"]
    assert [a.iban for a in accounts if not a.supports_transactions] == [LOAN.iban]


def test_identical_double_booking_is_delivered_twice() -> None:
    entries = camt.read(fetch(FakeSource(today=TODAY), CHECKING.iban).booked[0]).entries
    counts = Counter(camt.serialize(e) for e in entries)

    assert any(count == 2 for count in counts.values())


def test_booked_entries_respect_the_start_date_and_add_up_to_the_balance() -> None:
    source = FakeSource(today=TODAY)
    for iban in (CHECKING.iban, SAVINGS.iban):
        report = camt.read(fetch(source, iban).booked[0])
        with source.session() as session:
            balance = session.balance(iban)

        assert report.entries
        assert all(START <= camt.booking_date(e) <= TODAY for e in report.entries)
        assert {camt.status(e) for e in report.entries} == {"BOOK"}
        total = sum((camt.amount(e) for e in report.entries), Decimal(0))
        assert report.balances["OPBD"] + total == report.balances["CLBD"] == balance.amount


def test_checking_account_looks_like_a_real_one() -> None:
    entries = camt.read(fetch(FakeSource(today=TODAY), CHECKING.iban).booked[0]).entries
    salaries = [e for e in entries if camt.posting_text(e) == "Gehalt/Rente"]
    rent = [e for e in entries if camt.counterparty(e) == "Hausverwaltung Beispiel"]
    debits = [e for e in entries if any(line.startswith("CRED+") for line in camt.purpose(e))]
    cards = [e for e in entries if camt.counterparty(e).startswith("VISA ")]
    amazon = [e for e in entries if camt.counterparty(e).startswith("AMAZON")]

    assert len(salaries) == 3
    assert all(26 <= camt.booking_date(e).day <= 30 for e in salaries)
    assert len(rent) == 3
    assert all(camt.counterparty_iban(e) for e in rent)
    assert len(debits) >= 9
    assert len(cards) > 30
    assert amazon


def test_pending_entries_lie_in_the_future() -> None:
    statement = fetch(FakeSource(today=TODAY), CHECKING.iban)
    pending = camt.read(statement.pending[0]).entries

    assert pending
    assert {camt.status(e) for e in pending} == {"PDNG"}
    assert all(TODAY < camt.booking_date(e) <= TODAY + timedelta(days=10) for e in pending)


def test_pending_entries_are_booked_unchanged_once_their_day_has_come() -> None:
    pending = camt.read(fetch(FakeSource(today=TODAY), CHECKING.iban).pending[0]).entries
    later = camt.read(fetch(FakeSource(today=TODAY + timedelta(days=10)), CHECKING.iban).booked[0])
    booked = Counter(camt.serialize(e) for e in later.entries)

    for entry in pending:
        as_booked = camt.serialize(entry).replace(b">PDNG<", b">BOOK<")
        assert booked[as_booked] >= 1


def test_a_month_looks_the_same_whenever_the_bank_is_asked() -> None:
    def october(today: date) -> list[bytes]:
        entries = camt.read(fetch(FakeSource(today=today), CHECKING.iban).booked[0]).entries
        return [camt.serialize(e) for e in entries if camt.booking_date(e).month == 10]

    assert october(TODAY) == october(TODAY + timedelta(days=20))


def test_wrong_pin_is_rejected_on_the_first_login() -> None:
    control = FakeControl()
    source = FakeSource(today=TODAY, pin="0000", expected_pin="12345", control=control)

    with pytest.raises(PinWrongError), source.session():
        pass
    assert control.logins == 1


@pytest.mark.parametrize(
    ("scenario", "error"),
    [
        (FakeScenario.TAN_REQUIRED, TanRequiredError),
        (FakeScenario.UNREACHABLE, BankUnreachableError),
    ],
)
def test_scenarios_make_the_bank_fail(scenario: FakeScenario, error: type[BankError]) -> None:
    source = FakeSource(today=TODAY, control=FakeControl(scenario=scenario))

    with pytest.raises(error), source.session():
        pass


def test_days_ahead_moves_the_bank_into_the_future() -> None:
    source = FakeSource(today=TODAY, control=FakeControl(days_ahead=3))

    with source.session() as session:
        assert session.balance(CHECKING.iban).date == TODAY + timedelta(days=3)
