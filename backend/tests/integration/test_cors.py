import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.mark.parametrize("origin", ["http://localhost:5173", "http://127.0.0.1:5173"])
def test_cors_autoriza_origem_do_frontend(origin):
    with TestClient(app) as client:
        response = client.options(
            "/items/",
            headers={
                "Origin": origin,
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "Content-Type",
            },
        )

    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == origin
    assert response.headers["access-control-allow-methods"] == "GET, POST"
    assert "access-control-allow-credentials" not in response.headers


def test_cors_rejeita_origem_desconhecida():
    with TestClient(app) as client:
        response = client.options(
            "/items/",
            headers={
                "Origin": "http://desconhecido.example",
                "Access-Control-Request-Method": "POST",
            },
        )

    assert response.status_code == 400
    assert "access-control-allow-origin" not in response.headers
