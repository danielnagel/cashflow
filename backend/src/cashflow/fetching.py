"""Holds the banking PIN in memory and runs fetches from the bank in a background thread.

There is no scheduler: a fetch only starts on login, after unlocking, after choosing an account
or on explicit request.
"""

import logging
import threading
import uuid
from dataclasses import dataclass, field
from datetime import date, datetime
from enum import StrEnum
from zoneinfo import ZoneInfo

from sqlalchemy import Engine
from sqlalchemy.orm import Session

from cashflow.auth import Clock
from cashflow.camt import CamtError
from cashflow.config import Settings, SourceKind
from cashflow.ledger import FetchResult, fetch_due, fetch_start, store_statement, upsert_accounts
from cashflow.models import Account, FetchRun
from cashflow.sources import MissingFintsSettingsError, build_source
from cashflow.sources.base import (
    AccountLockedError,
    BankError,
    BankSession,
    BankUnreachableError,
    PinWrongError,
    TanRequiredError,
)
from cashflow.sources.fake import FakeControl

logger = logging.getLogger(__name__)

TIMEZONE = ZoneInfo("Europe/Berlin")


class ErrorCode(StrEnum):
    PIN_WRONG = "pin_wrong"
    TAN_REQUIRED = "tan_required"
    ACCOUNT_LOCKED = "account_locked"
    BANK_UNREACHABLE = "bank_unreachable"
    BANK_ERROR = "bank_error"
    BANK_NOT_CONFIGURED = "bank_not_configured"
    STATEMENT_INVALID = "statement_invalid"
    INTERNAL_ERROR = "internal_error"


def error_code(error: Exception) -> ErrorCode:
    match error:
        case PinWrongError():
            return ErrorCode.PIN_WRONG
        case TanRequiredError():
            return ErrorCode.TAN_REQUIRED
        case AccountLockedError():
            return ErrorCode.ACCOUNT_LOCKED
        case BankUnreachableError():
            return ErrorCode.BANK_UNREACHABLE
        case BankError():
            return ErrorCode.BANK_ERROR
        case MissingFintsSettingsError():
            return ErrorCode.BANK_NOT_CONFIGURED
        case CamtError():
            return ErrorCode.STATEMENT_INVALID
        case _:
            return ErrorCode.INTERNAL_ERROR


def today_in_berlin(clock: Clock) -> date:
    return clock().astimezone(TIMEZONE).date()


class BankAccess:
    """The PIN and the chosen account, in memory only."""

    def __init__(self) -> None:
        self._pin: str | None = None
        self._lock = threading.Lock()
        self.selected_account_id: uuid.UUID | None = None

    @property
    def unlocked(self) -> bool:
        return self._pin is not None

    def unlock(self, pin: str) -> None:
        with self._lock:
            self._pin = pin

    def lock(self) -> None:
        with self._lock:
            self._pin = None

    def pin(self) -> str | None:
        return self._pin

    def discard(self, pin: str) -> None:
        """Forgets a rejected PIN, unless a new one has been entered in the meantime."""
        with self._lock:
            if self._pin == pin:
                self._pin = None


class AccountState(StrEnum):
    IDLE = "idle"
    QUEUED = "queued"
    FETCHING = "fetching"
    DONE = "done"
    FAILED = "failed"


@dataclass(frozen=True)
class AccountStatus:
    state: AccountState = AccountState.IDLE
    error: ErrorCode | None = None


@dataclass
class FetchStatus:
    running: bool = False
    error: ErrorCode | None = None
    accounts: dict[uuid.UUID, AccountStatus] = field(default_factory=dict)


class StartResult(StrEnum):
    STARTED = "started"
    RUNNING = "running"
    LOCKED = "locked"
    NOT_DUE = "not_due"


class Fetcher:
    """Runs one fetch at a time: list the accounts, then fetch the chosen account first and the
    others afterwards, all in the same dialog with the bank."""

    def __init__(
        self,
        engine: Engine,
        settings: Settings,
        bank: BankAccess,
        fake_control: FakeControl,
        clock: Clock,
    ) -> None:
        self._engine = engine
        self._settings = settings
        self._bank = bank
        self._fake_control = fake_control
        self._clock = clock
        self._lock = threading.Lock()
        self._thread: threading.Thread | None = None
        self._status = FetchStatus()

    def status(self) -> FetchStatus:
        with self._lock:
            return FetchStatus(
                running=self._status.running,
                error=self._status.error,
                accounts=dict(self._status.accounts),
            )

    def _selected_due(self) -> bool:
        account_id = self._bank.selected_account_id
        if account_id is None:
            return True
        with Session(self._engine) as session:
            account = session.get(Account, account_id)
        return account is None or fetch_due(account.last_fetched_at, self._clock())

    def start(self, *, only_if_due: bool = False) -> StartResult:
        pin = self._bank.pin()
        if pin is None:
            return StartResult.LOCKED
        if only_if_due and not self._selected_due():
            return StartResult.NOT_DUE
        with self._lock:
            if self._status.running:
                return StartResult.RUNNING
            self._status.running = True
            self._status.error = None
            self._thread = threading.Thread(target=self._run, args=(pin,), daemon=True)
            self._thread.start()
        return StartResult.STARTED

    def join(self, timeout: float | None = None) -> None:
        thread = self._thread
        if thread is not None:
            thread.join(timeout)

    def _set_account(self, account_id: uuid.UUID, status: AccountStatus) -> None:
        with self._lock:
            self._status.accounts[account_id] = status

    def _run(self, pin: str) -> None:
        error: ErrorCode | None = None
        try:
            today = today_in_berlin(self._clock)
            source = build_source(self._settings, pin, self._fake_control, today)
            with source.session() as bank_session:
                self._fetch_all(bank_session)
        except PinWrongError as exc:
            self._bank.discard(pin)
            error = error_code(exc)
        except Exception as exc:
            error = error_code(exc)
            if error is ErrorCode.INTERNAL_ERROR:
                logger.exception("Fetch failed")
        if error is not None:
            self._record_run(None, "error", error=error)
        with self._lock:
            self._status.running = False
            self._status.error = error
            for account_id, status in self._status.accounts.items():
                if status.state in (AccountState.QUEUED, AccountState.FETCHING):
                    self._status.accounts[account_id] = AccountStatus(
                        AccountState.FAILED, error or ErrorCode.INTERNAL_ERROR
                    )

    def _fetch_all(self, bank_session: BankSession) -> None:
        with Session(self._engine) as session, session.begin():
            listed = upsert_accounts(session, bank_session.accounts())
            account_ids = [a.id for a in listed if a.supports_transactions]

        selected = self._bank.selected_account_id
        if selected not in account_ids:
            return
        order = [selected] + [a for a in account_ids if a != selected]
        for account_id in order:
            self._set_account(account_id, AccountStatus(AccountState.QUEUED))

        for account_id in order:
            self._set_account(account_id, AccountStatus(AccountState.FETCHING))
            try:
                self._fetch_account(bank_session, account_id)
            except BankError:
                # The dialog with the bank is unusable now; the remaining accounts fail as well.
                raise
            except Exception as exc:
                code = error_code(exc)
                if code is ErrorCode.INTERNAL_ERROR:
                    logger.exception("Fetch of one account failed")
                self._record_run(account_id, "error", error=code)
                self._set_account(account_id, AccountStatus(AccountState.FAILED, code))
            else:
                self._set_account(account_id, AccountStatus(AccountState.DONE))

    def _fetch_account(self, bank_session: BankSession, account_id: uuid.UUID) -> None:
        started_at = self._clock()
        today = today_in_berlin(self._clock)
        with Session(self._engine) as session:
            account = session.get_one(Account, account_id)
            iban, start = account.iban, fetch_start(account.covered_to, today)
        statement = bank_session.statement(iban, start)
        balance = bank_session.balance(iban)
        source = "fake" if self._settings.transaction_source is SourceKind.FAKE else "fints"
        with Session(self._engine) as session, session.begin():
            account = session.get_one(Account, account_id, with_for_update=True)
            result = store_statement(
                session, account, start, statement, balance, source, today, self._clock()
            )
            session.add(self._run_row(account_id, "ok", started_at, result=result))

    def _run_row(
        self,
        account_id: uuid.UUID | None,
        status: str,
        started_at: datetime | None = None,
        result: FetchResult | None = None,
        error: ErrorCode | None = None,
    ) -> FetchRun:
        now = self._clock()
        return FetchRun(
            account_id=account_id,
            started_at=started_at or now,
            finished_at=now,
            status=status,
            new_count=result.new_count if result else 0,
            skipped_count=result.skipped_count if result else 0,
            warning=result.warning if result and result.warning else None,
            error=error,
        )

    def _record_run(
        self, account_id: uuid.UUID | None, status: str, error: ErrorCode | None = None
    ) -> None:
        with Session(self._engine) as session, session.begin():
            session.add(self._run_row(account_id, status, error=error))
