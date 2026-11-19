"""Everything the backend keeps in memory: sessions, login throttling, the PIN and fetches."""

from typing import Annotated

from cryptography.fernet import Fernet
from fastapi import Depends, Request
from sqlalchemy import Engine

from cashflow.auth import Clock, LoginThrottle, SessionStore, secret_cipher
from cashflow.config import Settings
from cashflow.fetching import BankAccess, Fetcher
from cashflow.sources.fake import FakeControl


class Runtime:
    def __init__(self, settings: Settings, engine: Engine, clock: Clock) -> None:
        self.settings = settings
        self.engine = engine
        self.clock = clock
        self.cipher: Fernet = secret_cipher(settings.totp_encryption_key.get_secret_value())
        self._init_memory()

    def _init_memory(self) -> None:
        self.sessions = SessionStore(self.clock)
        self.throttle = LoginThrottle(self.clock)
        self.bank = BankAccess()
        self.fake_control = FakeControl()
        self.fetcher = Fetcher(self.engine, self.settings, self.bank, self.fake_control, self.clock)

    def reset(self) -> None:
        """Forgets everything held in memory, as a restart would."""
        self.fetcher.join()
        self._init_memory()


def get_runtime(request: Request) -> Runtime:
    runtime: Runtime = request.app.state.runtime
    return runtime


RuntimeDep = Annotated[Runtime, Depends(get_runtime)]
