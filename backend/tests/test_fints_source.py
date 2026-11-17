from dataclasses import dataclass, field
from datetime import date
from decimal import Decimal
from types import SimpleNamespace
from typing import Any, Self

import pytest
from fints.client import FinTSOperations, NeedTANResponse

from cashflow.sources.base import TanRequiredError
from cashflow.sources.fints import FintsCredentials, FintsSource

CREDENTIALS = FintsCredentials(
    blz="12345678", login="login", server="https://bank.invalid/", product_id="product"
)
GIRO = SimpleNamespace(
    iban="DE94123456780000001234", bic="EXMPDEFFXXX", accountnumber="1234", blz="12345678"
)
LOAN = SimpleNamespace(
    iban="DE93123456780000009012", bic="EXMPDEFFXXX", accountnumber="9012", blz="12345678"
)


def need_tan() -> NeedTANResponse:
    # Only the type matters to the source; a real instance needs a parsed bank challenge.
    return NeedTANResponse.__new__(NeedTANResponse)


@dataclass
class FakeClient:
    """Stands in for FinTS3PinTanClient; records how it was constructed and called."""

    args: tuple[Any, ...] = ()
    kwargs: dict[str, Any] = field(default_factory=dict)
    init_tan_response: Any = None
    tan_on: set[str] = field(default_factory=set)
    calls: list[str] = field(default_factory=list)

    def __enter__(self) -> Self:
        return self

    def __exit__(self, *exc: object) -> None:
        pass

    def _respond(self, name: str, value: Any) -> Any:
        self.calls.append(name)
        return need_tan() if name in self.tan_on else value

    def get_information(self) -> dict[str, Any]:
        operations = {FinTSOperations.GET_TRANSACTIONS_XML: True}
        return {
            "accounts": [
                {
                    "iban": GIRO.iban,
                    "product_name": "Girokonto",
                    "owner_name": ["Erika Mustermann", "Max Mustermann"],
                    "supported_operations": operations,
                },
                {
                    "iban": LOAN.iban,
                    "product_name": "Darlehen",
                    "owner_name": ["Erika Mustermann"],
                    "supported_operations": {FinTSOperations.GET_BALANCE: True},
                },
            ]
        }

    def get_sepa_accounts(self) -> Any:
        return self._respond("get_sepa_accounts", [GIRO, LOAN])

    def get_balance(self, account: Any) -> Any:
        balance = SimpleNamespace(
            amount=SimpleNamespace(amount=Decimal("-12.34"), currency="EUR"),
            date=date(2026, 10, 31),
        )
        return self._respond(f"get_balance:{account.iban}", balance)

    def get_transactions_xml(self, account: Any, start_date: date) -> Any:
        return self._respond(
            f"get_transactions_xml:{account.iban}:{start_date}", (["<booked/>"], ["<pending/>"])
        )


def source_with(client: FakeClient) -> FintsSource:
    def factory(*args: Any, **kwargs: Any) -> FakeClient:
        client.args, client.kwargs = args, kwargs
        return client

    return FintsSource(CREDENTIALS, pin="1234", client_factory=factory)


def test_client_is_built_from_credentials_and_pin() -> None:
    client = FakeClient()
    with source_with(client).session():
        pass

    assert client.args == ("12345678", "login", "1234", "https://bank.invalid/")
    assert client.kwargs == {"product_id": "product"}


def test_accounts_combine_sepa_list_and_account_information() -> None:
    with source_with(FakeClient()).session() as session:
        giro, loan = session.accounts()

    assert giro.iban == GIRO.iban
    assert giro.product_name == "Girokonto"
    assert giro.owner_name == "Erika Mustermann, Max Mustermann"
    assert giro.supports_transactions is True
    assert loan.supports_transactions is False


def test_balance_and_statement_are_fetched_for_the_given_account() -> None:
    client = FakeClient()
    with source_with(client).session() as session:
        balance = session.balance(GIRO.iban)
        statement = session.statement(GIRO.iban, date(2026, 8, 2))

    assert balance.amount == Decimal("-12.34")
    assert balance.date == date(2026, 10, 31)
    assert statement.booked == ["<booked/>"]
    assert statement.pending == ["<pending/>"]
    assert f"get_transactions_xml:{GIRO.iban}:2026-08-02" in client.calls


def test_tan_request_on_dialog_start_aborts() -> None:
    with (
        pytest.raises(TanRequiredError),
        source_with(FakeClient(init_tan_response=need_tan())).session(),
    ):
        pass


@pytest.mark.parametrize("operation", ["get_sepa_accounts", f"get_balance:{GIRO.iban}"])
def test_tan_request_during_dialog_aborts(operation: str) -> None:
    client = FakeClient(tan_on={operation})
    with pytest.raises(TanRequiredError), source_with(client).session() as session:
        session.balance(GIRO.iban)


def test_session_exposes_no_transfer_operations() -> None:
    with source_with(FakeClient()).session() as session:
        public = {name for name in dir(session) if not name.startswith("_")}

    assert public == {"accounts", "balance", "statement"}
