from app.api.routes.status import read_root


def test_read_root_retorna_status_ok():
    assert read_root() == {"status": "ok"}
