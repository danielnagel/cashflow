from datetime import timedelta

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import Engine, text

from cashflow.auth import MissingEncryptionKeyError, UserExistsError, create_user, secret_cipher
from tests.conftest import (
    PASSWORD,
    TOTP_KEY,
    TOTP_SECRET,
    USERNAME,
    FrozenClock,
    login,
    totp_code,
)


def test_login_with_password_and_totp_opens_a_session(api: TestClient, clock: FrozenClock) -> None:
    assert api.get("/api/auth/me").status_code == 401

    response = login(api, clock)

    assert response.status_code == 204
    cookie = response.headers["set-cookie"]
    assert "cashflow_session=" in cookie
    for attribute in ("HttpOnly", "Secure", "SameSite=strict", "Path=/api", "Max-Age=259200"):
        assert attribute.lower() in cookie.lower()
    assert api.get("/api/auth/me").json() == {"username": USERNAME}


@pytest.mark.parametrize(
    ("username", "password", "valid_code"),
    [(USERNAME, "wrong password", True), (USERNAME, PASSWORD, False), ("nobody", PASSWORD, True)],
)
def test_wrong_credentials_get_one_uniform_answer(
    api: TestClient, clock: FrozenClock, username: str, password: str, valid_code: bool
) -> None:
    code = totp_code(clock()) if valid_code else totp_code(clock() + timedelta(minutes=5))

    response = api.post(
        "/api/auth/login", json={"username": username, "password": password, "code": code}
    )

    assert response.status_code == 401
    assert response.json() == {"detail": "login_failed"}
    assert "set-cookie" not in response.headers
    assert api.get("/api/auth/me").status_code == 401


def test_totp_code_of_the_neighbouring_period_is_accepted(
    api: TestClient, clock: FrozenClock
) -> None:
    assert login(api, clock, code=totp_code(clock() - timedelta(seconds=30))).status_code == 204


def test_waiting_time_after_five_failed_logins(api: TestClient, clock: FrozenClock) -> None:
    for _ in range(5):
        assert login(api, clock, password="wrong").status_code == 401

    blocked = login(api, clock)
    assert blocked.status_code == 429
    assert blocked.json() == {"detail": "too_many_attempts"}
    assert blocked.headers["retry-after"] == "30"

    clock.advance(timedelta(seconds=31))
    assert login(api, clock, password="wrong").status_code == 401
    clock.advance(timedelta(seconds=31))
    assert login(api, clock).status_code == 429, "the waiting time doubles"
    assert login(api, clock).headers["retry-after"] == "29"

    clock.advance(timedelta(seconds=30))
    assert login(api, clock).status_code == 204
    assert login(api, clock, password="wrong").status_code == 401, "success resets the counter"


def test_session_expires_after_three_days(api: TestClient, clock: FrozenClock) -> None:
    login(api, clock)

    clock.advance(timedelta(days=3) - timedelta(seconds=1))
    assert api.get("/api/auth/me").status_code == 200
    clock.advance(timedelta(seconds=1))
    assert api.get("/api/auth/me").status_code == 401


def test_logout_ends_the_session(api: TestClient, clock: FrozenClock) -> None:
    login(api, clock)
    token = api.cookies["cashflow_session"]

    assert api.post("/api/auth/logout").status_code == 204

    api.cookies.clear()
    stolen = {"Cookie": f"cashflow_session={token}"}
    assert api.get("/api/auth/me", headers=stolen).status_code == 401


@pytest.mark.parametrize(
    ("method", "path"),
    [
        ("GET", "/api/bank/status"),
        ("POST", "/api/bank/lock"),
        ("GET", "/api/accounts"),
        ("POST", "/api/fetch"),
        ("GET", "/api/summary/monthly"),
        ("GET", "/api/transactions"),
    ],
)
def test_endpoints_require_a_session(api: TestClient, method: str, path: str) -> None:
    response = api.request(method, path)

    assert response.status_code == 401
    assert response.json() == {"detail": "not_authenticated"}


def test_password_and_totp_secret_are_not_stored_in_plain_text(
    api: TestClient, clean: Engine
) -> None:
    with clean.connect() as connection:
        password_hash, secret = connection.execute(
            text("SELECT password_hash, totp_secret FROM app_user")
        ).one()

    assert password_hash.startswith("$argon2id$")
    assert PASSWORD not in password_hash
    assert TOTP_SECRET not in secret
    assert secret_cipher(TOTP_KEY).decrypt(secret.encode()).decode() == TOTP_SECRET


def test_user_names_are_unique(api: TestClient, clean: Engine, clock: FrozenClock) -> None:
    with pytest.raises(UserExistsError):
        create_user(clean, secret_cipher(TOTP_KEY), USERNAME, "other", TOTP_SECRET, clock())


def test_short_encryption_key_is_refused() -> None:
    with pytest.raises(MissingEncryptionKeyError):
        secret_cipher("too short")
