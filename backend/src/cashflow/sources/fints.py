"""Read-only wrapper around python-fints.

Only the reading business transactions are exposed. The client object never leaves this
module, so nothing else in the app can trigger a transfer.
"""

from collections.abc import Callable, Iterator
from contextlib import contextmanager
from dataclasses import dataclass
from datetime import date
from typing import Any

from fints.client import FinTS3PinTanClient, FinTSOperations, NeedTANResponse
from fints.exceptions import (
    FinTSClientPINError,
    FinTSClientTemporaryAuthError,
    FinTSConnectionError,
    FinTSError,
    FinTSSCARequiredError,
)

from cashflow.sources.base import (
    AccountLockedError,
    Balance,
    BankAccount,
    BankError,
    BankRejectedError,
    BankSession,
    BankUnreachableError,
    PinWrongError,
    Statement,
    TanRequiredError,
)


@dataclass(frozen=True)
class FintsCredentials:
    blz: str
    login: str
    server: str
    product_id: str


ClientFactory = Callable[..., Any]


def _no_tan[T](response: T) -> T:
    if isinstance(response, NeedTANResponse):
        raise TanRequiredError
    return response


def bank_error(error: FinTSError) -> BankError:
    """Maps the exceptions of python-fints to the bank errors of the app."""
    if isinstance(error, FinTSClientPINError):
        return PinWrongError()
    if isinstance(error, FinTSClientTemporaryAuthError):
        return AccountLockedError()
    if isinstance(error, FinTSSCARequiredError):
        return TanRequiredError()
    if isinstance(error, FinTSConnectionError):
        return BankUnreachableError()
    return BankRejectedError()


class _FintsSession:
    def __init__(self, client: Any) -> None:
        self._client = client
        self._sepa_accounts: dict[str, Any] = {}

    def accounts(self) -> list[BankAccount]:
        information = self._client.get_information()
        details = {a["iban"]: a for a in information["accounts"] if a.get("iban")}
        sepa_accounts = _no_tan(self._client.get_sepa_accounts())
        self._sepa_accounts = {a.iban: a for a in sepa_accounts}

        result = []
        for sepa in sepa_accounts:
            detail = details.get(sepa.iban, {})
            operations = detail.get("supported_operations", {})
            result.append(
                BankAccount(
                    iban=sepa.iban,
                    bic=sepa.bic,
                    bank_code=sepa.blz,
                    account_number=sepa.accountnumber,
                    product_name=detail.get("product_name") or "",
                    owner_name=", ".join(detail.get("owner_name") or []),
                    supports_transactions=bool(
                        operations.get(FinTSOperations.GET_TRANSACTIONS_XML, False)
                    ),
                )
            )
        return result

    def _sepa_account(self, iban: str) -> Any:
        if not self._sepa_accounts:
            self.accounts()
        return self._sepa_accounts[iban]

    def balance(self, iban: str) -> Balance:
        result = _no_tan(self._client.get_balance(self._sepa_account(iban)))
        return Balance(
            amount=result.amount.amount, currency=result.amount.currency, date=result.date
        )

    def statement(self, iban: str, start: date) -> Statement:
        booked, pending = _no_tan(
            self._client.get_transactions_xml(self._sepa_account(iban), start_date=start)
        )
        return Statement(booked=list(booked), pending=list(pending))


class FintsSource:
    def __init__(
        self,
        credentials: FintsCredentials,
        pin: str,
        client_factory: ClientFactory = FinTS3PinTanClient,
    ) -> None:
        self._credentials = credentials
        self._pin = pin
        self._client_factory = client_factory

    @contextmanager
    def session(self) -> Iterator[BankSession]:
        try:
            client = self._client_factory(
                self._credentials.blz,
                self._credentials.login,
                self._pin,
                self._credentials.server,
                product_id=self._credentials.product_id,
            )
            with client:
                _no_tan(client.init_tan_response)
                yield _FintsSession(client)
        except FinTSError as error:
            raise bank_error(error) from error
