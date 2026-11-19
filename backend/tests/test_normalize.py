from dataclasses import replace
from datetime import date
from decimal import Decimal

from cashflow.camt import CamtEntry, parse
from cashflow.normalize import normalize, transaction_hash, with_hashes
from tests.conftest import FIXTURES

IBAN = "DE94123456780000001234"
ENTRIES = parse((FIXTURES / "camt" / "booked.xml").read_text(encoding="utf-8"))[0].entries
RENT, CARD, DEBIT, CREDIT, SALARY, CLOSING = ENTRIES


def entry(**changes: object) -> CamtEntry:
    return replace(CARD, **changes)  # type: ignore[arg-type]


def test_card_payment_loses_prefix_and_padding() -> None:
    result = normalize(CARD)

    assert result.counterparty_name == "BAECKEREI KORN"
    assert result.card_payment is True
    assert normalize(RENT).card_payment is False
    assert normalize(RENT).counterparty_name == "Hausverwaltung Beispiel"


def test_sepa_references_are_parsed_from_the_purpose() -> None:
    result = normalize(DEBIT)

    assert result.creditor_id == "DE98ZZZ09999999999"
    assert result.mandate_ref == "SW-100234"
    assert result.end_to_end_ref == "SW-100234-202610 Abschlag", "values run to the line end"
    assert result.purpose == "Abschlag Strom 10/2026 Vertrag 4711 Kundennr. 100234"


def test_placeholder_reference_and_missing_references() -> None:
    credit = normalize(CREDIT)
    rent = normalize(RENT)

    assert credit.end_to_end_ref is None
    assert credit.purpose == "Anteil Geschenk"
    assert (rent.creditor_id, rent.mandate_ref, rent.end_to_end_ref) == (None, None, None)
    assert normalize(CLOSING).purpose == ""


def test_hash_is_stable_and_built_from_raw_fields() -> None:
    first = transaction_hash(IBAN, CARD, 0)

    assert first == transaction_hash(IBAN, CARD, 0)
    assert len(first) == 64
    assert first != transaction_hash(IBAN, CARD, 1)
    assert first != transaction_hash("DE95123456780000005678", CARD, 0)
    # The padding is part of the raw name: cleaning it up must not go into the hash.
    assert first != transaction_hash(IBAN, entry(counterparty_name="VISA BAECKEREI KORN"), 0)


def test_hash_ignores_fields_outside_the_identity() -> None:
    assert transaction_hash(IBAN, CARD, 0) == transaction_hash(
        IBAN, entry(value_date=date(2026, 9, 30), posting_text="other", xml="<x/>"), 0
    )
    assert transaction_hash(IBAN, CARD, 0) != transaction_hash(
        IBAN, entry(amount=Decimal("-3.51")), 0
    )


def test_identical_entries_get_running_numbers() -> None:
    hashes = [h for _, h in with_hashes(IBAN, [RENT, CARD, CARD, DEBIT])]

    assert len(set(hashes)) == 4
    assert hashes[1] == transaction_hash(IBAN, CARD, 0)
    assert hashes[2] == transaction_hash(IBAN, CARD, 1)


def test_hashes_are_the_same_in_the_next_delivery() -> None:
    first = [h for _, h in with_hashes(IBAN, [RENT, CARD, CARD, DEBIT, SALARY])]
    # The next fetch starts later, so it only overlaps with the end of the first one.
    second = [h for _, h in with_hashes(IBAN, [CARD, CARD, DEBIT, SALARY, CLOSING])]

    assert second[:4] == first[1:]
    assert second[4] not in first
