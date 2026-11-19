from datetime import date

from cashflow.config import Settings, SourceKind
from cashflow.sources.base import TransactionSource
from cashflow.sources.fake import FakeControl, FakeSource
from cashflow.sources.fints import FintsCredentials, FintsSource


class MissingFintsSettingsError(Exception):
    def __init__(self, names: list[str]) -> None:
        super().__init__(f"FinTS settings missing: {', '.join(names)}")
        self.names = names


def build_source(
    settings: Settings,
    pin: str,
    fake_control: FakeControl | None = None,
    today: date | None = None,
) -> TransactionSource:
    if settings.transaction_source is SourceKind.FAKE:
        return FakeSource(
            seed=settings.fake_seed,
            today=today,
            pin=pin,
            expected_pin=settings.fake_pin.get_secret_value(),
            control=fake_control,
        )
    credentials = FintsCredentials(
        blz=settings.fints_blz,
        login=settings.fints_login.get_secret_value(),
        server=settings.fints_server,
        product_id=settings.fints_product_id.get_secret_value(),
    )
    missing = [f"FINTS_{name.upper()}" for name, value in vars(credentials).items() if not value]
    if missing:
        raise MissingFintsSettingsError(missing)
    return FintsSource(credentials, pin)
