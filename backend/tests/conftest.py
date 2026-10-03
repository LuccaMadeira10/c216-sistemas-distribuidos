import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.services import item as item_service


@pytest.fixture(autouse=True)
def limpar_items(monkeypatch):
    # cada teste comeca com seus proprios dados
    monkeypatch.setattr(item_service, "items", {})
    monkeypatch.setattr(item_service, "next_id", 1)


@pytest.fixture
def dados_item():
    return {"name": "Caderno", "description": "Material da aula"}


@pytest.fixture
def cliente():
    with TestClient(app) as cliente_teste:
        yield cliente_teste


@pytest.fixture
def item_criado(cliente, dados_item):
    resposta = cliente.post("/items", json=dados_item)
    assert resposta.status_code == 201
    return resposta.json()
