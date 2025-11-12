import pytest

fastapi = pytest.importorskip("fastapi")
from fastapi.testclient import TestClient  # type: ignore


def _client():
    from app.main import app

    return TestClient(app)


def test_presign_rejects_unsupported_type():
    c = _client()
    r = c.post(
        "/v1/upload",
        params={"filename": "x.bin", "contentType": "application/x-binary"},
        headers={"Authorization": "Bearer x"},
    )
    assert r.status_code == 400


def test_presign_generates_url():
    c = _client()
    r = c.post(
        "/v1/upload",
        params={"filename": "a.pdf", "contentType": "application/pdf"},
        headers={"Authorization": "Bearer x"},
    )
    assert r.status_code == 200
    assert "url" in r.json()["data"]
