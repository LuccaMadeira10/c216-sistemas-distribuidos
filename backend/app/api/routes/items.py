from fastapi import APIRouter, HTTPException

from app.schemas.item import Item, ItemCreate, ItemUpdate
from app.services import item as item_service

router = APIRouter(prefix="/items", tags=["Items"])


@router.get("", response_model=list[Item])
def list_items():
    return item_service.list_items()


@router.get("/{item_id}", response_model=Item)
def get_item(item_id: int):
    item = item_service.get_item(item_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Item nao encontrado")
    return item


@router.post("", response_model=Item, status_code=201)
def create_item(item: ItemCreate):
    return item_service.create_item(item)


@router.put("/{item_id}", response_model=Item)
def replace_item(item_id: int, item: ItemCreate):
    item_atualizado = item_service.replace_item(item_id, item)
    if item_atualizado is None:
        raise HTTPException(status_code=404, detail="Item nao encontrado")
    return item_atualizado


@router.patch("/{item_id}", response_model=Item)
def update_item(item_id: int, item: ItemUpdate):
    item_atualizado = item_service.update_item(item_id, item)
    if item_atualizado is None:
        raise HTTPException(status_code=404, detail="Item nao encontrado")
    return item_atualizado


@router.delete("/{item_id}", status_code=204)
def delete_item(item_id: int):
    item_removido = item_service.delete_item(item_id)
    if item_removido is None:
        raise HTTPException(status_code=404, detail="Item nao encontrado")
