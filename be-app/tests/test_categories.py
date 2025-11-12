import pytest

fastapi = pytest.importorskip("fastapi")
from fastapi.testclient import TestClient  # type: ignore


def _client():
    from app.main import app

    return TestClient(app)


def test_categories_crud_happy_path():
    c = _client()

    # list empty
    r = c.get("/v1/categories")
    assert r.status_code == 200
    assert r.json()["data"]["items"] == []

    # create
    payload = {"name": "IR", "slug": "ir", "description": "desc"}
    r = c.post("/v1/categories", json=payload, headers={"Authorization": "Bearer x"})
    assert r.status_code == 200
    cid = r.json()["data"]["categoryId"]

    # update
    r = c.put(f"/v1/categories/{cid}", json={"description": "desc2"}, headers={"Authorization": "Bearer x"})
    assert r.status_code == 200
    assert r.json()["data"]["description"] == "desc2"

    # delete
    r = c.delete(f"/v1/categories/{cid}", headers={"Authorization": "Bearer x"})
    assert r.status_code == 200
    assert r.json()["data"]["deleted"] is True
