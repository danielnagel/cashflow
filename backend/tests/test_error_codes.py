import pytest

from cashflow.camt import CamtError
from cashflow.fetching import ErrorCode, error_code
from cashflow.sources import MissingFintsSettingsError
from cashflow.sources.base import (
    AccountLockedError,
    BankRejectedError,
    BankUnreachableError,
    PinWrongError,
    TanRequiredError,
)


@pytest.mark.parametrize(
    ("error", "code"),
    [
        (PinWrongError(), ErrorCode.PIN_WRONG),
        (TanRequiredError(), ErrorCode.TAN_REQUIRED),
        (AccountLockedError(), ErrorCode.ACCOUNT_LOCKED),
        (BankUnreachableError(), ErrorCode.BANK_UNREACHABLE),
        (BankRejectedError(), ErrorCode.BANK_ERROR),
        (MissingFintsSettingsError(["FINTS_BLZ"]), ErrorCode.BANK_NOT_CONFIGURED),
        (CamtError("broken"), ErrorCode.STATEMENT_INVALID),
        (RuntimeError("bug"), ErrorCode.INTERNAL_ERROR),
    ],
)
def test_errors_map_to_codes_for_the_frontend(error: Exception, code: ErrorCode) -> None:
    assert error_code(error) is code
