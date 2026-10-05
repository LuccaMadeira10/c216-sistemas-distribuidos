from fastapi import APIRouter

router = APIRouter(tags=["Status"])


@router.get("/")
def read_root():
    return {"status": "ok"}
