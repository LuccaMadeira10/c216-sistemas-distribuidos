from app.models.item import Item
from app.repositories.item import ItemRepository
from app.schemas.item import ItemCreate, ItemUpdate


def list_items(db):
    return ItemRepository(db).get_all()


def get_item(db, item_id: int):
    return ItemRepository(db).get_by_id(item_id)


def create_item(db, item: ItemCreate):
    novo_item = Item(**item.model_dump())
    return ItemRepository(db).create(novo_item)


def replace_item(db, item_id: int, item: ItemCreate):
    repository = ItemRepository(db)
    item_atual = repository.get_by_id(item_id)
    if item_atual is None:
        return None
    return repository.update(item_atual, item.model_dump())


def update_item(db, item_id: int, item: ItemUpdate):
    repository = ItemRepository(db)
    item_atual = repository.get_by_id(item_id)
    if item_atual is None:
        return None

    # altera apenas os campos enviados, sem apagar os outros
    return repository.update(item_atual, item.model_dump(exclude_unset=True))


def delete_item(db, item_id: int):
    repository = ItemRepository(db)
    item = repository.get_by_id(item_id)
    if item is None:
        return None
    return repository.delete(item)
