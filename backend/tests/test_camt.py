from datetime import date
from decimal import Decimal

import pytest

from cashflow.camt import CamtError, parse
from cashflow.ledger import statement_consistent
from tests.conftest import FIXTURES

BOOKED = (FIXTURES / "camt" / "booked.xml").read_text(encoding="utf-8")
PENDING = (FIXTURES / "camt" / "pending.xml").read_text(encoding="utf-8")


def test_booked_report_with_balances() -> None:
    [report] = parse(BOOKED)

    assert report.iban == "DE94123456780000001234"
    assert report.opening_balance == Decimal("-1500.00")
    assert report.closing_balance == Decimal("-117.45")
    assert [e.amount for e in report.entries] == [
        Decimal("-650.00"),
        Decimal("-3.50"),
        Decimal("-84.00"),
        Decimal("25.00"),
        Decimal("2100.00"),
        Decimal("-4.95"),
    ]
    assert all(e.booked for e in report.entries)
    assert statement_consistent(report)


def test_entry_fields() -> None:
    rent, card, debit, credit, salary, closing = parse(BOOKED)[0].entries

    assert rent.booking_date == date(2026, 10, 1)
    assert rent.counterparty_name == "Hausverwaltung Beispiel"
    assert rent.counterparty_iban == "DE89370400440532013000"
    assert rent.purpose_lines == ("Miete Oktober", "Wohnung 3. OG links")
    assert rent.posting_text == "Überweisung"
    assert rent.currency == "EUR"

    assert card.value_date == date(2026, 10, 1)
    assert card.booking_date == date(2026, 10, 2)
    assert card.counterparty_name.startswith("VISA BAECKEREI KORN  ")
    assert card.counterparty_iban is None

    assert debit.purpose_lines[-1] == "CRED+DE98ZZZ09999999999"
    assert credit.counterparty_name == "MAX MUSTERMANN", "credits name the debtor"
    assert salary.posting_text == "Gehalt/Rente"
    assert (closing.counterparty_name, closing.purpose_lines) == ("", ())
    assert "<" in rent.xml
    assert "Hausverwaltung Beispiel" in rent.xml


def test_pending_entries_are_not_booked() -> None:
    [report] = parse(PENDING)

    assert report.opening_balance is None
    assert report.closing_balance is None
    [entry] = report.entries
    assert entry.booked is False
    assert entry.amount == Decimal("-12.99")
    assert entry.booking_date == date(2026, 11, 5)


def test_inconsistent_balances_are_detected() -> None:
    tampered = BOOKED.replace('<Amt Ccy="EUR">117.45</Amt>', '<Amt Ccy="EUR">117.46</Amt>')

    assert not statement_consistent(parse(tampered)[0])


@pytest.mark.parametrize(
    "document",
    [
        "not xml",
        "<Document><Other/></Document>",
        BOOKED.replace("<CdtDbtInd>DBIT</CdtDbtInd>", "<CdtDbtInd>XXXX</CdtDbtInd>", 1),
        BOOKED.replace("<Sts>BOOK</Sts>", "<Sts>WHAT</Sts>", 1),
    ],
)
def test_unreadable_documents_raise(document: str) -> None:
    with pytest.raises(CamtError):
        parse(document)


def test_entities_are_rejected() -> None:
    document = '<?xml version="1.0"?><!DOCTYPE d [<!ENTITY e "x">]><d>&e;</d>'

    with pytest.raises(CamtError, match="EntitiesForbidden"):
        parse(document)
