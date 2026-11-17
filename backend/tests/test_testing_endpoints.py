import uuid

import pytest
from sqlalchemy import Engine, text

from cashflow.config import Mode
from tests.conftest import APP, client_for


@pytest.mark.parametrize("mode", [Mode.PROD, Mode.DEV])
def test_testing_endpoints_do_not_exist_outside_e2e_mode(migrated: None, mode: Mode) -> None:
    with client_for(APP.model_copy(update={"mode": mode})) as client:
        assert client.post("/api/_test/reset").status_code == 404
        assert client.get("/api/_test/reset").status_code == 404


def test_reset_empties_all_tables_in_e2e_mode(app_engine: Engine) -> None:
    with app_engine.begin() as connection:
        connection.execute(
            text(
                "INSERT INTO account (id, iban, name, bank_code, product_name, owner_name,"
                " supports_transactions) VALUES (:id, 'DE00RESET', 'Test', '12345678',"
                " 'Girokonto', 'Test', true)"
            ),
            {"id": uuid.uuid4()},
        )

    with client_for(APP.model_copy(update={"mode": Mode.E2E})) as client:
        assert client.post("/api/_test/reset").status_code == 204

    with app_engine.connect() as connection:
        assert connection.scalar(text("SELECT count(*) FROM account")) == 0
