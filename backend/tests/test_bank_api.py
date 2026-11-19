import logging
from collections import Counter
from datetime import timedelta
from typing import Any

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import Engine, text

from cashflow.sources.fake import CHECKING, SAVINGS, FakeScenario
from tests.conftest import FAKE_PIN, FrozenClock, login, runtime_of, wait_for_fetch


@pytest.fixture
def user(api: TestClient, clock: FrozenClock) -> TestClient:
    """Logged in, bank locked."""
    assert login(api, clock).status_code == 204
    return api


def unlock(client: TestClient, pin: str = FAKE_PIN) -> dict[str, Any]:
    response = client.post("/api/bank/unlock", json={"pin": pin})
    assert response.status_code == 202
    wait_for_fetch(client)
    status: dict[str, Any] = client.get("/api/bank/status").json()
    return status


def accounts(client: TestClient) -> dict[str, Any]:
    result: dict[str, Any] = client.get("/api/accounts").json()
    return result


def account_id(client: TestClient, iban: str) -> str:
    return str(next(a["id"] for a in accounts(client)["accounts"] if a["iban"] == iban))


def select(client: TestClient, iban: str) -> None:
    response = client.put("/api/session/account", json={"account_id": account_id(client, iban)})
    assert response.status_code == 204
    wait_for_fetch(client)


@pytest.fixture
def fetched(user: TestClient) -> TestClient:
    """Unlocked, checking account chosen and all accounts fetched once."""
    unlock(user)
    select(user, CHECKING.iban)
    return user


def count(engine: Engine, sql: str, **params: object) -> int:
    with engine.connect() as connection:
        return int(connection.scalar(text(sql), params) or 0)


def test_bank_is_locked_until_the_pin_is_entered(user: TestClient) -> None:
    assert user.get("/api/bank/status").json() == {
        "state": "locked",
        "fetching": False,
        "error": None,
    }
    assert accounts(user) == {"selected_id": None, "accounts": []}


def test_unlocking_lists_the_accounts_with_transactions(user: TestClient) -> None:
    status = unlock(user)

    assert status == {"state": "unlocked", "fetching": False, "error": None}
    listed = accounts(user)
    assert listed["selected_id"] is None
    assert [a["iban"] for a in listed["accounts"]] == [CHECKING.iban, SAVINGS.iban]
    assert [a["product_name"] for a in listed["accounts"]] == ["Girokonto", "Tagesgeld"]
    assert all(a["last_run"] is None for a in listed["accounts"]), "nothing fetched yet"


def test_wrong_pin_is_tried_exactly_once_and_forgotten(user: TestClient, clean: Engine) -> None:
    status = unlock(user, pin="0000")

    assert status == {"state": "locked", "fetching": False, "error": "pin_wrong"}
    assert runtime_of(user).fake_control.logins == 1
    assert count(clean, "SELECT count(*) FROM fetch_run WHERE error = 'pin_wrong'") == 1
    assert user.post("/api/fetch").json() == {"detail": "bank_locked"}
    assert runtime_of(user).fake_control.logins == 1


@pytest.mark.parametrize(
    ("scenario", "code"),
    [(FakeScenario.TAN_REQUIRED, "tan_required"), (FakeScenario.UNREACHABLE, "bank_unreachable")],
)
def test_bank_errors_keep_the_pin(user: TestClient, scenario: FakeScenario, code: str) -> None:
    runtime_of(user).fake_control.scenario = scenario

    status = unlock(user)

    assert status == {"state": "unlocked", "fetching": False, "error": code}
    runtime_of(user).fake_control.scenario = FakeScenario.OK
    assert user.post("/api/fetch").status_code == 202
    wait_for_fetch(user)
    assert user.get("/api/bank/status").json()["error"] is None


def test_choosing_an_account_fetches_it_first_and_then_the_others(
    fetched: TestClient, clean: Engine
) -> None:
    listed = accounts(fetched)
    checking, savings = listed["accounts"]

    assert listed["selected_id"] == checking["id"]
    assert checking["fetch"] == {"state": "done", "error": None}
    assert savings["fetch"] == {"state": "done", "error": None}
    assert checking["last_run"]["new_count"] > 50
    assert checking["last_run"]["warning"] is None
    assert savings["last_run"]["new_count"] > 0
    assert checking["balance"]["date"] == "2026-11-17"
    assert checking["covered_from"] == "2026-08-20"
    assert checking["covered_to"] == "2026-11-17"
    assert checking["gaps"] == []
    with clean.connect() as connection:
        runs = connection.execute(
            text(
                "SELECT a.iban FROM fetch_run r JOIN account a ON a.id = r.account_id"
                " WHERE r.status = 'ok'"
            )
        ).all()
    assert sorted(row[0] for row in runs) == [CHECKING.iban, SAVINGS.iban]


def test_second_fetch_brings_no_new_transactions(
    fetched: TestClient, clean: Engine, clock: FrozenClock
) -> None:
    before = count(clean, "SELECT count(*) FROM transaction")
    clock.advance(timedelta(minutes=1))

    assert fetched.post("/api/fetch").json() == {"result": "started"}
    wait_for_fetch(fetched)

    checking = accounts(fetched)["accounts"][0]
    assert checking["last_run"]["new_count"] == 0
    assert checking["last_run"]["skipped_count"] > 0
    assert count(clean, "SELECT count(*) FROM transaction") == before


def test_identical_double_bookings_are_kept_and_not_multiplied(
    fetched: TestClient, clean: Engine
) -> None:
    def bakery_per_day() -> Counter[str]:
        with clean.connect() as connection:
            rows = connection.execute(
                text(
                    "SELECT booking_date FROM transaction WHERE counterparty_name = :name"
                    " AND card_payment"
                ),
                {"name": "BAECKEREI KORN"},
            )
            return Counter(str(row[0]) for row in rows)

    first = bakery_per_day()
    assert first
    assert set(first.values()) == {2}

    fetched.post("/api/fetch")
    wait_for_fetch(fetched)
    assert bakery_per_day() == first


def test_pending_transactions_are_replaced_and_booked_once(
    fetched: TestClient, clean: Engine, clock: FrozenClock
) -> None:
    pending = count(clean, "SELECT count(*) FROM pending_transaction")
    assert pending > 0
    with clean.connect() as connection:
        name, amount, day, twins = connection.execute(
            text(
                "SELECT counterparty_name, amount, booking_date, count(*) FROM pending_transaction"
                " GROUP BY 1, 2, 3 ORDER BY 3, 1 LIMIT 1"
            )
        ).one()

    fetched.post("/api/fetch")
    wait_for_fetch(fetched)
    assert count(clean, "SELECT count(*) FROM pending_transaction") == pending

    runtime_of(fetched).fake_control.days_ahead = 10
    clock.advance(timedelta(minutes=1))
    fetched.post("/api/fetch")
    wait_for_fetch(fetched)

    booked = count(
        clean,
        "SELECT count(*) FROM transaction WHERE counterparty_name = :name AND amount = :amount"
        " AND booking_date = :day",
        name=name,
        amount=amount,
        day=day,
    )
    still_pending = count(
        clean,
        "SELECT count(*) FROM pending_transaction WHERE booking_date = :day AND amount = :amount",
        day=day,
        amount=amount,
    )
    assert booked == twins, "each pending entry is booked exactly once"
    assert still_pending == 0
    assert accounts(fetched)["accounts"][0]["last_run"]["warning"] is None


def test_fetch_after_more_than_90_days_reports_a_gap(
    fetched: TestClient, clock: FrozenClock
) -> None:
    clock.advance(timedelta(days=100))

    login(fetched, clock)
    wait_for_fetch(fetched)

    checking = accounts(fetched)["accounts"][0]
    assert checking["gaps"] == [{"start": "2026-11-18", "end": "2026-11-27"}]
    assert checking["covered_from"] == "2026-11-28"
    assert checking["covered_to"] == "2027-02-25"


def test_login_fetches_only_if_the_last_fetch_is_older_than_15_minutes(
    fetched: TestClient, clock: FrozenClock
) -> None:
    logins = runtime_of(fetched).fake_control.logins
    fetched.post("/api/auth/logout")

    clock.advance(timedelta(minutes=10))
    login(fetched, clock)
    wait_for_fetch(fetched)
    assert runtime_of(fetched).fake_control.logins == logins

    clock.advance(timedelta(minutes=5))
    login(fetched, clock)
    wait_for_fetch(fetched)
    assert runtime_of(fetched).fake_control.logins == logins + 1


def test_lock_forgets_the_pin(fetched: TestClient) -> None:
    assert fetched.post("/api/bank/lock").status_code == 204

    assert fetched.get("/api/bank/status").json()["state"] == "locked"
    assert fetched.post("/api/fetch").status_code == 409
    assert accounts(fetched)["selected_id"] is not None, "the chosen account is kept"


def test_unknown_or_unsupported_account_cannot_be_chosen(user: TestClient, clean: Engine) -> None:
    unlock(user)
    with clean.connect() as connection:
        loan = connection.scalar(text("SELECT id FROM account WHERE NOT supports_transactions"))

    for account in (str(loan), "00000000-0000-0000-0000-000000000000"):
        response = user.put("/api/session/account", json={"account_id": account})
        assert response.status_code == 404
        assert response.json() == {"detail": "account_not_found"}


def test_pin_never_appears_in_the_logs(user: TestClient, caplog: pytest.LogCaptureFixture) -> None:
    caplog.set_level(logging.DEBUG)
    secret_pin = "98765-secret"
    unlock(user, pin=secret_pin)
    unlock(user)
    select(user, CHECKING.iban)

    assert caplog.records, "the capture has to see the app's logging at all"
    assert secret_pin not in caplog.text
    assert FAKE_PIN not in caplog.text
