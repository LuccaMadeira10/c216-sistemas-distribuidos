from unittest.mock import MagicMock

import pytest

from app.models.item import Item
from app.schemas.item import ItemCreate, ItemUpdate
from app.services import item as item_service


@pytest.fixture
def repository(monkeypatch):
    repository = MagicMock()
    monkeypatch.setattr(item_service, "ItemRepository", lambda db: repository)
    return repository


@pytest.fixture
def item_salvo(dados_item):
    return Item(id=1, **dados_item)


def test_listar_items_consulta_repository(repository, item_salvo):
    repository.get_all.return_value = [item_salvo]

    assert item_service.list_items(None) == [item_salvo]
    repository.get_all.assert_called_once_with()


def test_buscar_item_consulta_id(repository, item_salvo):
    repository.get_by_id.return_value = item_salvo

    assert item_service.get_item(None, 1) is item_salvo
    repository.get_by_id.assert_called_once_with(1)


def test_criar_item_envia_modelo_ao_repository(repository, dados_item):
    item_service.create_item(None, ItemCreate(**dados_item))

    item = repository.create.call_args.args[0]
    assert isinstance(item, Item)
    assert item.name == dados_item["name"]
    assert item.description == dados_item["description"]


def test_substituir_item_remove_descricao_omitida(repository, item_salvo):
    repository.get_by_id.return_value = item_salvo

    item_service.replace_item(None, 1, ItemCreate(name="Caneta"))

    repository.update.assert_called_once_with(
        item_salvo, {"name": "Caneta", "description": None}
    )


def test_atualizar_nome_preserva_descricao(repository, item_salvo):
    repository.get_by_id.return_value = item_salvo

    item_service.update_item(None, 1, ItemUpdate(name="Caneta"))

    repository.update.assert_called_once_with(item_salvo, {"name": "Caneta"})


def test_atualizar_descricao_para_nulo(repository, item_salvo):
    repository.get_by_id.return_value = item_salvo

    item_service.update_item(None, 1, ItemUpdate(description=None))

    repository.update.assert_called_once_with(item_salvo, {"description": None})


def test_atualizacao_vazia_mantem_dados(repository, item_salvo):
    repository.get_by_id.return_value = item_salvo

    item_service.update_item(None, 1, ItemUpdate())

    repository.update.assert_called_once_with(item_salvo, {})


def test_excluir_item_chama_repository(repository, item_salvo):
    repository.get_by_id.return_value = item_salvo
    repository.delete.return_value = item_salvo

    assert item_service.delete_item(None, 1) is item_salvo
    repository.delete.assert_called_once_with(item_salvo)


def test_buscar_item_inexistente_retorna_none(repository):
    repository.get_by_id.return_value = None

    assert item_service.get_item(None, 999) is None


def test_substituir_item_inexistente_nao_cria_item(repository):
    repository.get_by_id.return_value = None

    assert item_service.replace_item(None, 999, ItemCreate(name="Caneta")) is None
    repository.update.assert_not_called()
    repository.create.assert_not_called()


def test_atualizar_item_inexistente_retorna_none(repository):
    repository.get_by_id.return_value = None

    assert item_service.update_item(None, 999, ItemUpdate(name="Caneta")) is None
    repository.update.assert_not_called()


def test_excluir_item_inexistente_retorna_none(repository):
    repository.get_by_id.return_value = None

    assert item_service.delete_item(None, 999) is None
    repository.delete.assert_not_called()
