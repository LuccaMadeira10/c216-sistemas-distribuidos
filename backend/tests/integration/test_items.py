import pytest


def test_listar_items_retorna_lista_vazia(cliente):
    resposta = cliente.get("/items")

    assert resposta.status_code == 200
    assert resposta.json() == []


def test_criar_item_retorna_dados_e_id(cliente, dados_item):
    resposta = cliente.post("/items", json=dados_item)

    assert resposta.status_code == 201
    assert resposta.json() == {"id": 1, **dados_item}
    assert cliente.get("/items/1").json() == resposta.json()


def test_criar_item_sem_descricao(cliente):
    resposta = cliente.post("/items", json={"name": "Caneta"})

    assert resposta.status_code == 201
    assert resposta.json() == {"id": 1, "name": "Caneta", "description": None}


def test_listar_items_cadastrados(cliente, item_criado):
    segundo_item = cliente.post("/items", json={"name": "Caneta"}).json()

    resposta = cliente.get("/items")

    assert resposta.status_code == 200
    assert resposta.json() == [item_criado, segundo_item]
    assert segundo_item["id"] != item_criado["id"]


def test_buscar_item_pelo_id(cliente, item_criado):
    resposta = cliente.get(f"/items/{item_criado['id']}")

    assert resposta.status_code == 200
    assert resposta.json() == item_criado


def test_put_substitui_todos_os_dados(cliente, item_criado):
    novos_dados = {"name": "Caneta", "description": "Caneta azul"}

    resposta = cliente.put(f"/items/{item_criado['id']}", json=novos_dados)

    assert resposta.status_code == 200
    assert resposta.json() == {"id": item_criado["id"], **novos_dados}
    assert cliente.get(f"/items/{item_criado['id']}").json() == resposta.json()


def test_put_sem_descricao_remove_descricao_antiga(cliente, item_criado):
    resposta = cliente.put(f"/items/{item_criado['id']}", json={"name": "Caneta"})

    assert resposta.status_code == 200
    assert resposta.json() == {
        "id": item_criado["id"],
        "name": "Caneta",
        "description": None,
    }


def test_patch_altera_nome_e_preserva_descricao(cliente, item_criado):
    resposta = cliente.patch(f"/items/{item_criado['id']}", json={"name": "Caneta"})

    assert resposta.status_code == 200
    assert resposta.json() == {**item_criado, "name": "Caneta"}
    assert cliente.get(f"/items/{item_criado['id']}").json() == resposta.json()


def test_patch_altera_descricao_e_preserva_nome(cliente, item_criado):
    resposta = cliente.patch(
        f"/items/{item_criado['id']}", json={"description": "Nova descricao"}
    )

    assert resposta.status_code == 200
    assert resposta.json() == {**item_criado, "description": "Nova descricao"}


def test_patch_permite_remover_descricao(cliente, item_criado):
    resposta = cliente.patch(f"/items/{item_criado['id']}", json={"description": None})

    assert resposta.status_code == 200
    assert resposta.json() == {**item_criado, "description": None}


def test_patch_vazio_mantem_dados(cliente, item_criado):
    resposta = cliente.patch(f"/items/{item_criado['id']}", json={})

    assert resposta.status_code == 200
    assert resposta.json() == item_criado


def test_excluir_item_retorna_sem_conteudo(cliente, item_criado):
    resposta = cliente.delete(f"/items/{item_criado['id']}")

    assert resposta.status_code == 204
    assert resposta.content == b""
    assert cliente.get(f"/items/{item_criado['id']}").status_code == 404
    assert cliente.get("/items").json() == []


@pytest.mark.parametrize("metodo", ["GET", "PUT", "PATCH", "DELETE"])
def test_item_inexistente_retorna_404(cliente, metodo):
    resposta = cliente.request(metodo, "/items/999", json={"name": "Caneta"})

    assert resposta.status_code == 404
    assert resposta.json() == {"detail": "Item nao encontrado"}
    assert cliente.get("/items").json() == []


@pytest.mark.parametrize("metodo", ["GET", "PUT", "PATCH", "DELETE"])
def test_id_invalido_retorna_422(cliente, metodo):
    resposta = cliente.request(metodo, "/items/abc", json={"name": "Caneta"})

    assert resposta.status_code == 422


@pytest.mark.parametrize("metodo", ["POST", "PUT", "PATCH"])
@pytest.mark.parametrize(
    "dados",
    [
        {"name": ""},
        {"name": None},
        {"name": 123},
        {"name": "Caneta", "description": 123},
    ],
)
def test_dados_invalidos_retorna_422(cliente, item_criado, metodo, dados):
    caminho = "/items" if metodo == "POST" else f"/items/{item_criado['id']}"

    resposta = cliente.request(metodo, caminho, json=dados)

    assert resposta.status_code == 422
    assert cliente.get(f"/items/{item_criado['id']}").json() == item_criado
    assert cliente.get("/items").json() == [item_criado]


@pytest.mark.parametrize("metodo", ["POST", "PUT"])
def test_nome_obrigatorio_na_criacao_e_substituicao(cliente, item_criado, metodo):
    caminho = "/items" if metodo == "POST" else f"/items/{item_criado['id']}"

    resposta = cliente.request(metodo, caminho, json={})

    assert resposta.status_code == 422
