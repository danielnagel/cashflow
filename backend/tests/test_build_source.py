import pytest
from pydantic import SecretStr

from cashflow.config import Settings, SourceKind
from cashflow.sources import MissingFintsSettingsError, build_source
from cashflow.sources.fake import FakeSource
from cashflow.sources.fints import FintsSource


def test_fake_source_uses_the_configured_seed() -> None:
    source = build_source(Settings(transaction_source=SourceKind.FAKE, fake_seed=42), pin="")

    assert isinstance(source, FakeSource)
    assert source.seed == 42


def test_fints_is_the_default_source() -> None:
    settings = Settings(
        fints_blz="12345678",
        fints_server="https://bank.invalid/",
        fints_login=SecretStr("login"),
        fints_product_id=SecretStr("product"),
    )

    assert isinstance(build_source(settings, pin="1234"), FintsSource)


def test_fints_needs_the_bank_to_be_configured() -> None:
    settings = Settings(fints_login=SecretStr("login"))

    with pytest.raises(MissingFintsSettingsError) as error:
        build_source(settings, pin="1234")

    assert error.value.names == ["FINTS_BLZ", "FINTS_SERVER", "FINTS_PRODUCT_ID"]


def test_secrets_do_not_show_up_in_the_settings_repr() -> None:
    settings = Settings(
        db_password=SecretStr("db-secret"),
        fints_login=SecretStr("login-secret"),
        fints_product_id=SecretStr("product-secret"),
    )

    assert "secret" not in repr(settings).replace("SecretStr", "")
