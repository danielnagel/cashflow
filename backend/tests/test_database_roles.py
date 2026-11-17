import uuid

import pytest
from sqlalchemy import Engine, text
from sqlalchemy.exc import ProgrammingError


def test_app_connects_as_runtime_role(app_engine: Engine) -> None:
    with app_engine.connect() as connection:
        assert connection.scalar(text("SELECT current_user")) == "cashflow_app"
        assert (
            connection.scalar(text("SELECT rolsuper FROM pg_roles WHERE rolname = current_user"))
            is False
        )


def test_app_can_read_and_write_data(app_engine: Engine) -> None:
    account_id = uuid.uuid4()
    with app_engine.begin() as connection:
        connection.execute(
            text(
                "INSERT INTO account (id, iban, name, bank_code, product_name, owner_name,"
                " supports_transactions) VALUES (:id, :iban, 'Test', '12345678', 'Girokonto',"
                " 'Test', true)"
            ),
            {"id": account_id, "iban": f"DE{account_id.hex[:20]}"},
        )
        connection.execute(
            text("UPDATE account SET name = 'Renamed' WHERE id = :id"), {"id": account_id}
        )
        assert (
            connection.scalar(text("SELECT name FROM account WHERE id = :id"), {"id": account_id})
            == "Renamed"
        )
        connection.execute(text("DELETE FROM account WHERE id = :id"), {"id": account_id})


@pytest.mark.parametrize(
    "statement",
    [
        "DROP TABLE account",
        "CREATE TABLE intruder (id int)",
        "ALTER TABLE account ADD COLUMN intruder int",
        "TRUNCATE account",
        "CREATE SCHEMA intruder",
        "CREATE ROLE intruder",
    ],
)
def test_app_cannot_change_schema(app_engine: Engine, statement: str) -> None:
    with app_engine.connect() as connection, pytest.raises(ProgrammingError) as error:
        connection.execute(text(statement))

    assert "permission denied" in str(error.value) or "must be owner" in str(error.value)


def test_owner_is_not_superuser(owner_engine: Engine) -> None:
    with owner_engine.connect() as connection:
        assert connection.scalar(text("SELECT current_user")) == "cashflow_owner"
        assert (
            connection.scalar(text("SELECT rolsuper FROM pg_roles WHERE rolname = current_user"))
            is False
        )
