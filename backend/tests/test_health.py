from fastapi.testclient import TestClient

from tests.conftest import APP, client_for


def test_health_reports_ok_with_database(client: TestClient) -> None:
    response = client.get("/api/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok", "database": "ok"}


def test_health_reports_unavailable_without_database() -> None:
    unreachable = APP.model_copy(update={"db_port": 1})

    with client_for(unreachable) as client:
        response = client.get("/api/health")

    assert response.status_code == 503
    assert response.json() == {"status": "unavailable", "database": "unreachable"}


def test_api_docs_are_not_exposed(client: TestClient) -> None:
    for path in ("/docs", "/redoc", "/openapi.json"):
        assert client.get(path).status_code == 404
