from decimal import Decimal

from tests import camt
from tests.conftest import FIXTURES

BOOKED = (FIXTURES / "camt" / "booked.xml").read_text(encoding="utf-8")
PENDING = (FIXTURES / "camt" / "pending.xml").read_text(encoding="utf-8")


def test_booked_fixture_is_readable() -> None:
    report = camt.read(BOOKED)

    assert report.iban == "DE94123456780000001234"
    assert len(report.entries) == 6
    assert {camt.status(e) for e in report.entries} == {"BOOK"}


def test_booked_fixture_balances_add_up_and_can_be_negative() -> None:
    report = camt.read(BOOKED)
    total = sum((camt.amount(e) for e in report.entries), Decimal(0))

    assert report.balances["OPBD"] == Decimal("-1500.00")
    assert report.balances["CLBD"] == Decimal("-117.45")
    assert report.balances["OPBD"] + total == report.balances["CLBD"]


def test_booked_fixture_covers_the_ing_entry_kinds() -> None:
    by_name = {camt.counterparty(e).strip(): e for e in camt.read(BOOKED).entries}

    card = by_name["VISA BAECKEREI KORN"]
    assert camt.counterparty(card) != "VISA BAECKEREI KORN", "card names are padded with spaces"
    assert camt.counterparty_iban(by_name["Hausverwaltung Beispiel"]) == "DE89370400440532013000"
    references = {line.split("+")[0] for line in camt.purpose(by_name["Stadtwerke Beispielstadt"])}
    assert references >= {"EREF", "MREF", "CRED"}
    assert camt.posting_text(by_name["Muster Software GmbH"]) == "Gehalt/Rente"
    assert camt.amount(by_name["Muster Software GmbH"]) > 0
    assert camt.purpose(by_name[""]) == []


def test_pending_fixture_is_readable() -> None:
    report = camt.read(PENDING)

    assert report.balances == {}
    assert [camt.status(e) for e in report.entries] == ["PDNG"]
    assert camt.amount(report.entries[0]) == Decimal("-12.99")
