from collections import Counter
from datetime import date, timedelta
from decimal import Decimal

from cashflow.sources.base import Statement, TransactionSource
from cashflow.sources.fake import CHECKING, LOAN, SAVINGS, FakeSource
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
