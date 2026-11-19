"""Login of the app user: Argon2 password, mandatory TOTP, sessions in memory, login throttling."""

import base64
import hashlib
import secrets
import threading
import uuid
from collections.abc import Callable
from dataclasses import dataclass
from datetime import datetime, timedelta

import pyotp
from argon2 import PasswordHasher
from argon2.exceptions import InvalidHashError, VerificationError
from cryptography.fernet import Fernet
from sqlalchemy import Engine, select
from sqlalchemy.orm import Session

from cashflow.models import AppUser

Clock = Callable[[], datetime]

SESSION_LIFETIME = timedelta(days=3)
ISSUER = "cashflow"
FREE_ATTEMPTS = 5
BASE_DELAY = timedelta(seconds=30)
MAX_DELAY = timedelta(hours=1)
MIN_KEY_LENGTH = 32

_hasher = PasswordHasher()
# Verified when the user does not exist, so that the answer takes as long as for a wrong password.
_DUMMY_HASH = _hasher.hash(secrets.token_urlsafe(16))


class MissingEncryptionKeyError(Exception):
    def __init__(self) -> None:
        super().__init__(f"TOTP_ENCRYPTION_KEY must be at least {MIN_KEY_LENGTH} characters long")


def secret_cipher(key: str) -> Fernet:
    if len(key) < MIN_KEY_LENGTH:
        raise MissingEncryptionKeyError
    return Fernet(base64.urlsafe_b64encode(hashlib.sha256(key.encode()).digest()))


def new_totp_secret() -> str:
    return pyotp.random_base32()


def totp_uri(secret: str, username: str) -> str:
    return pyotp.TOTP(secret).provisioning_uri(name=username, issuer_name=ISSUER)


def verify_totp(secret: str, code: str, now: datetime) -> bool:
    # One step of tolerance in both directions for clocks that are slightly off.
    return pyotp.TOTP(secret).verify(code.strip(), for_time=now, valid_window=1)


class UserExistsError(Exception):
    pass


def create_user(
    engine: Engine, cipher: Fernet, username: str, password: str, totp_secret: str, now: datetime
) -> None:
    with Session(engine) as session, session.begin():
        if session.scalar(select(AppUser.id).where(AppUser.username == username)):
            raise UserExistsError(username)
        session.add(
            AppUser(
                username=username,
                password_hash=_hasher.hash(password),
                totp_secret=cipher.encrypt(totp_secret.encode()).decode(),
                created_at=now,
            )
        )


@dataclass(frozen=True)
class AuthenticatedUser:
    id: uuid.UUID
    username: str


def authenticate(
    engine: Engine,
    cipher: Fernet,
    username: str,
    password: str,
    code: str,
    now: datetime,
) -> AuthenticatedUser | None:
    with Session(engine) as session:
        user = session.scalar(select(AppUser).where(AppUser.username == username))
    try:
        _hasher.verify(user.password_hash if user else _DUMMY_HASH, password)
    except (VerificationError, InvalidHashError):
        return None
    if user is None:
        return None
    secret = cipher.decrypt(user.totp_secret.encode()).decode()
    if not verify_totp(secret, code, now):
        return None
    return AuthenticatedUser(id=user.id, username=user.username)


@dataclass(frozen=True)
class UserSession:
    user: AuthenticatedUser
    expires_at: datetime


class SessionStore:
    """Sessions live in memory only: a restart logs everybody out."""

    def __init__(self, clock: Clock) -> None:
        self._clock = clock
        self._sessions: dict[str, UserSession] = {}
        self._lock = threading.Lock()

    def create(self, user: AuthenticatedUser) -> str:
        token = secrets.token_urlsafe(32)
        with self._lock:
            self._sessions[token] = UserSession(user, self._clock() + SESSION_LIFETIME)
        return token

    def get(self, token: str) -> UserSession | None:
        with self._lock:
            session = self._sessions.get(token)
            if session is None:
                return None
            if session.expires_at <= self._clock():
                del self._sessions[token]
                return None
            return session

    def delete(self, token: str) -> None:
        with self._lock:
            self._sessions.pop(token, None)


@dataclass
class _Failures:
    count: int
    blocked_until: datetime | None


class LoginThrottle:
    """After FREE_ATTEMPTS failed logins from one address, every further failure doubles the
    waiting time before the next attempt is accepted."""

    def __init__(self, clock: Clock) -> None:
        self._clock = clock
        self._failures: dict[str, _Failures] = {}
        self._lock = threading.Lock()

    def retry_after(self, address: str) -> int:
        """Seconds until the address may try again, 0 if it may try now."""
        with self._lock:
            failures = self._failures.get(address)
            if failures is None or failures.blocked_until is None:
                return 0
            remaining = (failures.blocked_until - self._clock()).total_seconds()
            return max(0, int(remaining + 0.999))

    def failed(self, address: str) -> None:
        with self._lock:
            failures = self._failures.setdefault(address, _Failures(0, None))
            failures.count += 1
            if failures.count >= FREE_ATTEMPTS:
                delay = min(BASE_DELAY * 2 ** (failures.count - FREE_ATTEMPTS), MAX_DELAY)
                failures.blocked_until = self._clock() + delay

    def succeeded(self, address: str) -> None:
        with self._lock:
            self._failures.pop(address, None)
