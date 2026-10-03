from fastapi import FastAPI

from app.api.routes.items import router as items_router
from app.api.routes.status import router as status_router

app = FastAPI()

app.include_router(status_router)
app.include_router(items_router)
