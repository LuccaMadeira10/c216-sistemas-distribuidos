import pytest

from app.main import read_root


def test_read_root_retorna_status_ok():
    assert read_root() == {"status": "ok"}


def test_rota_raiz_retorna_sucesso(cliente):
    resposta = cliente.get("/")

    assert resposta.status_code == 200
    assert resposta.json() == {"status": "ok"}


@pytest.mark.parametrize("metodo", ["post", "put", "delete"])
def test_rota_raiz_rejeita_metodos_nao_permitidos(cliente, metodo):
    resposta = getattr(cliente, metodo)("/")

    assert resposta.status_code == 405


@pytest.mark.parametrize("caminho", ["/status", "/nao-existe"])
def test_rota_inexistente_retorna_erro(cliente, caminho):
    resposta = cliente.get(caminho)

    assert resposta.status_code == 404
