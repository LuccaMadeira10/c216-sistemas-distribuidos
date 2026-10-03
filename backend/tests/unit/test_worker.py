import urllib.error
from unittest.mock import MagicMock

import pytest

import worker


def test_worker_registra_status_da_api(monkeypatch, capsys):
    resposta = MagicMock()
    resposta.__enter__.return_value.status = 200
    chamar_api = MagicMock(return_value=resposta)
    pausa = MagicMock(side_effect=KeyboardInterrupt)
    monkeypatch.setattr(worker.urllib.request, "urlopen", chamar_api)
    monkeypatch.setattr(worker.time, "sleep", pausa)

    with pytest.raises(KeyboardInterrupt):
        worker.main()

    chamar_api.assert_called_once_with(worker.API_URL, timeout=5)
    pausa.assert_called_once_with(worker.INTERVALO_SEGUNDOS)
    assert "worker: API respondeu 200" in capsys.readouterr().out


@pytest.mark.parametrize(
    "erro",
    [TimeoutError("tempo esgotado"), urllib.error.URLError("API indisponivel")],
)
def test_worker_registra_erro_da_api(monkeypatch, capsys, erro):
    chamar_api = MagicMock(side_effect=erro)
    pausa = MagicMock(side_effect=KeyboardInterrupt)
    monkeypatch.setattr(worker.urllib.request, "urlopen", chamar_api)
    monkeypatch.setattr(worker.time, "sleep", pausa)

    with pytest.raises(KeyboardInterrupt):
        worker.main()

    chamar_api.assert_called_once_with(worker.API_URL, timeout=5)
    pausa.assert_called_once_with(worker.INTERVALO_SEGUNDOS)
    assert "worker: erro ao chamar a API" in capsys.readouterr().out
