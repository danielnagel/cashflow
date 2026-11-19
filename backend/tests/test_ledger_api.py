"""Monthly summary and transaction list against values calculated by hand from the fixtures."""

import uuid
from datetime import date
from decimal import Decimal
from typing import Any

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import Engine
from sqlalchemy.orm import Session

from cashflow.ledger import FetchWarning, store_statement
from cashflow.models import Account
from cashflow.sources.base import Balance, Statement
from tests.conftest import FIXTURES, FrozenClock, login

BOOKED = (FIXTURES / "camt" / "booked.xml").read_text(encoding="utf-8")
PENDING = (FIXTURES / "camt" / "pending.xml").read_text(encoding="utf-8")
IBAN = "DE94123456780000001234"
TODAY = date(2026, 11, 17)


def store(
    engine: Engine,
    clock: FrozenClock,
    booked: str = BOOKED,
    balance: Decimal = Decimal("-117.45"),
) -> tuple[uuid.UUID, FetchWarning | None]:
    with Session(engine) as session, session.begin():
        account = session.query(Account).filter_by(iban=IBAN).one_or_none()
        if account is None:
            account = Account(
                iban=IBAN,
                name="Girokonto",
                bank_code="12345678",
                product_name="Girokonto",
                owner_name="Erika Mustermann",
                supports_transactions=True,
            )
            session.add(account)
            session.flush()
        result = store_statement(
            session,
            account,
            date(2026, 10, 1),
            Statement(booked=[booked], pending=[PENDING]),
            Balance(balance, "EUR", date(2026, 10, 31)),
            "fake",
            TODAY,
            clock(),
        )
        return account.id, result.warning


@pytest.fixture
def account(api: TestClient, clean: Engine, clock: FrozenClock) -> str:
    login(api, clock)
    account_id, warning = store(clean, clock)
    assert warning is None
    return str(account_id)


def transactions(api: TestClient, account: str, **params: str | int) -> dict[str, Any]:
    response = api.get("/api/transactions", params={"account_id": account, **params})
    assert response.status_code == 200, response.text
    result: dict[str, Any] = response.json()
    return result


def test_monthly_summary(api: TestClient, account: str) -> None:
    response = api.get(
        "/api/summary/monthly", params={"account_id": account, "from": "2026-09", "to": "2026-11"}
    )

    assert response.json() == [
        {"month": "2026-09", "income": "0", "expense": "0", "diff": "0", "complete": False},
        {
            "month": "2026-10",
            "income": "2125.00",
            "expense": "742.45",
            "diff": "1382.55",
            "complete": True,
        },
        {"month": "2026-11", "income": "0", "expense": "0", "diff": "0", "complete": False},
    ]


def test_transactions_of_a_month_with_balance_after_each_booking(
    api: TestClient, account: str
) -> None:
    result = transactions(api, account, month="2026-10")

    assert result["total"] == 6
    assert [(t["booking_date"], t["amount"], t["balance_after"]) for t in result["items"]] == [
        ("2026-10-30", "-4.95", "-117.45"),
        ("2026-10-28", "2100.00", "-112.50"),
        ("2026-10-12", "25.00", "-2212.50"),
        ("2026-10-05", "-84.00", "-2237.50"),
        ("2026-10-02", "-3.50", "-2153.50"),
        ("2026-10-01", "-650.00", "-2150.00"),
    ]
    card = result["items"][4]
    assert card["counterparty_name"] == "BAECKEREI KORN"
    assert card["card_payment"] is True
    assert result["pending"] == []


def test_pending_transactions_are_listed_separately(api: TestClient, account: str) -> None:
    result = transactions(api, account, month="2026-11")

    assert result["items"] == []
    assert [(p["booking_date"], p["amount"]) for p in result["pending"]] == [
        ("2026-11-05", "-12.99")
    ]
    assert result["pending"][0]["counterparty_name"] == "Streamingdienst Europe B.V."


def test_filter_by_kind(api: TestClient, account: str) -> None:
    income = transactions(api, account, month="2026-10", type="income")
    expense = transactions(api, account, month="2026-10", type="expense")

    assert [t["amount"] for t in income["items"]] == ["2100.00", "25.00"]
    assert expense["total"] == 4
    assert all(Decimal(t["amount"]) < 0 for t in expense["items"])
    assert transactions(api, account, month="2026-11", type="income")["pending"] == []


@pytest.mark.parametrize(
    ("query", "expected"),
    [
        ("korn", ["BAECKEREI KORN"]),
        ("vertrag 4711", ["Stadtwerke Beispielstadt"]),
        ("%", []),
        ("_", []),
    ],
)
def test_search_in_name_and_purpose(
    api: TestClient, account: str, query: str, expected: list[str]
) -> None:
    result = transactions(api, account, q=query)

    assert [t["counterparty_name"] for t in result["items"]] == expected


def test_date_range_sorting_and_paging(api: TestClient, account: str) -> None:
    by_amount = transactions(api, account, sort="amount", order="asc")
    assert [t["amount"] for t in by_amount["items"]][:2] == ["-650.00", "-84.00"]

    by_name = transactions(api, account, sort="counterparty_name", order="asc")
    assert by_name["items"][0]["counterparty_name"] == ""

    page = transactions(api, account, page=2, page_size=2)
    assert page["total"] == 6
    assert [t["booking_date"] for t in page["items"]] == ["2026-10-12", "2026-10-05"]

    ranged = transactions(api, account, from_date="2026-10-02", to_date="2026-10-12")
    assert [t["booking_date"] for t in ranged["items"]] == [
        "2026-10-12",
        "2026-10-05",
        "2026-10-02",
    ]


def test_storing_the_same_statement_again_adds_nothing(
    api: TestClient, account: str, clean: Engine, clock: FrozenClock
) -> None:
    store(clean, clock)

    assert transactions(api, account)["total"] == 6


def test_inconsistent_statement_is_flagged(
    api: TestClient, clean: Engine, clock: FrozenClock
) -> None:
    tampered = BOOKED.replace('<Amt Ccy="EUR">117.45</Amt>', '<Amt Ccy="EUR">117.46</Amt>')

    assert store(clean, clock, booked=tampered)[1] is FetchWarning.STATEMENT_INCONSISTENT


def test_balance_that_does_not_match_the_transactions_is_flagged(
    api: TestClient, clean: Engine, clock: FrozenClock
) -> None:
    assert store(clean, clock, balance=Decimal("-120.95"))[1] is FetchWarning.BALANCE_MISMATCH


@pytest.mark.parametrize(
    ("path", "params", "status", "detail"),
    [
        ("/api/summary/monthly", {"from": "2026-13", "to": "2026-12"}, 422, "invalid_month"),
        ("/api/summary/monthly", {"from": "2026-10", "to": "2026-09"}, 422, "invalid_range"),
        ("/api/summary/monthly", {"from": "2000-01", "to": "2026-09"}, 422, "invalid_range"),
        ("/api/transactions", {"month": "October"}, 422, "invalid_month"),
    ],
)
def test_invalid_parameters(
    api: TestClient,
    account: str,
    path: str,
    params: dict[str, str],
    status: int,
    detail: str,
) -> None:
    response = api.get(path, params={"account_id": account, **params})

    assert response.status_code == status
    assert response.json() == {"detail": detail}


def test_unknown_account(api: TestClient, account: str) -> None:
    response = api.get("/api/transactions", params={"account_id": str(uuid.uuid4())})

    assert response.status_code == 404
