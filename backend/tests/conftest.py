import os

import pytest
from alembic.config import Config
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session

from alembic import command
from app.database.session import get_db
from app.main import app


@pytest.fixture(scope="session")
def banco_teste():
    url = os.getenv(
        "TEST_DATABASE_URL",
        "postgresql+psycopg://postgres:postgres@localhost:5432/c216_test",
    )
    engine = create_engine(url)
    # evita limpar por engano o banco da aplicacao
    if not engine.url.database.endswith("_test"):
        raise ValueError("O nome do banco de testes deve terminar com _test")

    config = Config("alembic.ini")
    config.set_main_option("sqlalchemy.url", url.replace("%", "%%"))
    command.upgrade(config, "head")
    yield engine
    engine.dispose()


@pytest.fixture
def db(banco_teste):
    # cada teste comeca com seus proprios dados
    with banco_teste.begin() as conexao:
        conexao.execute(text("TRUNCATE TABLE items RESTART IDENTITY"))
    with Session(banco_teste) as sessao:
        yield sessao


@pytest.fixture
def dados_item():
    return {"name": "Caderno", "description": "Material da aula"}


@pytest.fixture
def cliente(db):
    def get_db_teste():
        yield db

    app.dependency_overrides[get_db] = get_db_teste
    try:
        with TestClient(app) as cliente_teste:
            yield cliente_teste
    finally:
        app.dependency_overrides.clear()


@pytest.fixture
def item_criado(cliente, dados_item):
    resposta = cliente.post("/items", json=dados_item)
    assert resposta.status_code == 201
    return resposta.json()
