import pytest

from app.schemas.item import ItemCreate, ItemUpdate
from app.services import item as item_service


@pytest.fixture
def item_salvo(dados_item):
    return item_service.create_item(ItemCreate(**dados_item))


def test_listar_sem_items_retorna_lista_vazia():
    assert item_service.list_items() == []


def test_criar_item_salva_dados(dados_item):
    item = item_service.create_item(ItemCreate(**dados_item))

    assert item == {"id": 1, **dados_item}
    assert item_service.get_item(1) == item
    assert item_service.list_items() == [item]


def test_id_nao_e_reutilizado_apos_exclusao(item_salvo):
    item_service.delete_item(item_salvo["id"])

    novo_item = item_service.create_item(ItemCreate(name="Caneta"))

    assert novo_item["id"] == 2
    assert item_service.get_item(1) is None


def test_substituir_item_mantem_id_e_remove_descricao_antiga(item_salvo):
    item = item_service.replace_item(item_salvo["id"], ItemCreate(name="Caneta"))

    assert item == {"id": 1, "name": "Caneta", "description": None}
    assert item_service.get_item(1) == item


def test_atualizar_nome_preserva_descricao(item_salvo):
    item = item_service.update_item(item_salvo["id"], ItemUpdate(name="Caneta"))

    assert item["name"] == "Caneta"
    assert item["description"] == "Material da aula"


def test_atualizar_descricao_para_nulo(item_salvo):
    item = item_service.update_item(item_salvo["id"], ItemUpdate(description=None))

    assert item["name"] == "Caderno"
    assert item["description"] is None


def test_atualizacao_vazia_mantem_dados(item_salvo, dados_item):
    item = item_service.update_item(item_salvo["id"], ItemUpdate())

    assert item == {"id": 1, **dados_item}


def test_excluir_item_remove_do_armazenamento(item_salvo):
    item = item_service.delete_item(item_salvo["id"])

    assert item == item_salvo
    assert item_service.list_items() == []


def test_buscar_item_inexistente_retorna_none():
    assert item_service.get_item(999) is None


def test_substituir_item_inexistente_nao_cria_item():
    item = item_service.replace_item(999, ItemCreate(name="Caneta"))

    assert item is None
    assert item_service.list_items() == []


def test_atualizar_item_inexistente_retorna_none():
    assert item_service.update_item(999, ItemUpdate(name="Caneta")) is None


def test_excluir_item_inexistente_retorna_none():
    assert item_service.delete_item(999) is None
