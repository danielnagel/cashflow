from datetime import UTC, date, datetime, timedelta
from decimal import Decimal

import pytest

from cashflow.ledger import Gap, balance_difference, detect_gap, fetch_due, fetch_start
from cashflow.models import CoverageGap
from cashflow.queries import Month, month_complete

TODAY = date(2026, 11, 17)


def test_first_fetch_asks_for_90_days() -> None:
    start = fetch_start(None, TODAY)

    assert start == date(2026, 8, 20)
    assert (TODAY - start).days + 1 == 90


def test_later_fetches_overlap_by_14_days() -> None:
    assert fetch_start(date(2026, 11, 10), TODAY) == date(2026, 10, 27)


def test_later_fetches_never_ask_for_more_than_the_bank_has() -> None:
    assert fetch_start(date(2026, 8, 1), TODAY) == date(2026, 8, 20)


def test_no_gap_while_the_last_fetch_is_recent_enough() -> None:
    assert detect_gap(None, date(2026, 8, 20)) is None
    assert detect_gap(date(2026, 11, 10), date(2026, 10, 27)) is None
    assert detect_gap(date(2026, 8, 19), date(2026, 8, 20)) is None


def test_gap_between_last_coverage_and_the_oldest_available_day() -> None:
    start = fetch_start(date(2026, 8, 1), TODAY)

    assert detect_gap(date(2026, 8, 1), start) == Gap(date(2026, 8, 2), date(2026, 8, 19))


@pytest.mark.parametrize(
    ("minutes_ago", "due"), [(None, True), (5, False), (14.9, False), (15, True), (600, True)]
)
def test_fetch_is_due_after_15_minutes(minutes_ago: float | None, due: bool) -> None:
    now = datetime(2026, 11, 17, 9, 0, tzinfo=UTC)
    last = None if minutes_ago is None else now - timedelta(minutes=minutes_ago)

    assert fetch_due(last, now) is due


def test_balance_calculated_back_matches_the_reported_opening_balance() -> None:
    # Opening -1500.00, transactions since then -617.45 in sum (net +1382.55), balance -117.45.
    assert balance_difference(Decimal("-117.45"), Decimal("1382.55"), Decimal("-1500.00")) == 0


def test_balance_difference_shows_missing_or_duplicate_transactions() -> None:
    missing_card_payment = Decimal("1382.55") + Decimal("3.50")

    difference = balance_difference(Decimal("-117.45"), missing_card_payment, Decimal("-1500.00"))

    assert difference == Decimal("-3.50")


def gap(start: date, end: date) -> CoverageGap:
    return CoverageGap(gap_from=start, gap_to=end)


def test_month_is_complete_only_when_fully_covered_and_over() -> None:
    october = Month(2026, 10)

    assert month_complete(october, date(2026, 8, 20), TODAY, [])
    assert not month_complete(october, date(2026, 10, 2), TODAY, []), "starts too late"
    assert not month_complete(october, date(2026, 8, 20), date(2026, 10, 31), []), "not over"
    assert not month_complete(Month(2026, 11), date(2026, 8, 20), TODAY, [])
    assert not month_complete(october, None, None, [])
    assert not month_complete(
        october, date(2026, 8, 20), TODAY, [gap(date(2026, 10, 30), date(2026, 11, 2))]
    )
    assert month_complete(
        october, date(2026, 8, 20), TODAY, [gap(date(2026, 9, 1), date(2026, 9, 30))]
    )


def test_month_parsing() -> None:
    assert Month.parse("2026-03") == Month(2026, 3)
    assert str(Month(2026, 3)) == "2026-03"
    assert Month(2026, 12).next() == Month(2027, 1)
    assert Month(2024, 2).last_day == date(2024, 2, 29)
    for invalid in ("2026-13", "2026-3", "26-03", "march"):
        with pytest.raises(ValueError, match=r"."):
            Month.parse(invalid)
