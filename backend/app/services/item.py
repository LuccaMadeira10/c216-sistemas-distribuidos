from app.schemas.item import ItemCreate, ItemUpdate

# os dados ficam em memoria por enquanto e somem ao reiniciar a API
items = {}
next_id = 1


def list_items():
    return list(items.values())


def get_item(item_id: int):
    return items.get(item_id)


def create_item(item: ItemCreate):
    global next_id

    novo_item = {"id": next_id, **item.model_dump()}
    items[next_id] = novo_item
    next_id += 1
    return novo_item


def replace_item(item_id: int, item: ItemCreate):
    if item_id not in items:
        return None

    items[item_id] = {"id": item_id, **item.model_dump()}
    return items[item_id]


def update_item(item_id: int, item: ItemUpdate):
    item_atual = get_item(item_id)
    if item_atual is None:
        return None

    # altera apenas os campos enviados, sem apagar os outros
    item_atual.update(item.model_dump(exclude_unset=True))
    return item_atual


def delete_item(item_id: int):
    return items.pop(item_id, None)
