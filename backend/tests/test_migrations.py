from alembic import command
from sqlalchemy import Engine, inspect

from tests.conftest import alembic_config


def table_names(engine: Engine) -> set[str]:
    return set(inspect(engine).get_table_names())


def test_upgrade_and_downgrade_run_through(owner_engine: Engine) -> None:
    config = alembic_config()

    command.downgrade(config, "base")
    assert table_names(owner_engine) <= {"alembic_version"}

    command.upgrade(config, "head")
    assert "account" in table_names(owner_engine)


def test_models_match_migrations(owner_engine: Engine) -> None:
    command.check(alembic_config())
