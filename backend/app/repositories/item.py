from app.models.item import Item


class ItemRepository:
    def __init__(self, db):
        self.db = db

    def get_all(self):
        return self.db.query(Item).order_by(Item.id).all()

    def get_by_id(self, item_id):
        return self.db.get(Item, item_id)

    def create(self, item):
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item

    def update(self, item, dados):
        for campo, valor in dados.items():
            setattr(item, campo, valor)
        self.db.commit()
        self.db.refresh(item)
        return item

    def delete(self, item):
        self.db.delete(item)
        self.db.commit()
        return item
