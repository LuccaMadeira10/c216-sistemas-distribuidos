from pydantic import BaseModel, ConfigDict, Field, field_validator


class ItemCreate(BaseModel):
    name: str = Field(min_length=1)
    description: str | None = None


class ItemUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1)
    description: str | None = None

    @field_validator("name")
    @classmethod
    def validar_nome(cls, nome):
        # no PATCH o nome pode ser omitido, mas nao pode receber null
        if nome is None:
            raise ValueError("O nome nao pode ser nulo")
        return nome


class Item(ItemCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int
