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
    body = r.json()["data"]
    cid = body["categoryId"]
    assert body["createdAt"]

    # get
    r = c.get(f"/v1/categories/{cid}")
    assert r.status_code == 200
    fetched = r.json()["data"]
    assert fetched["name"] == "IR"
    assert fetched["slug"] == "ir"

    # update
    r = c.put(f"/v1/categories/{cid}", json={"description": "desc2"}, headers={"Authorization": "Bearer x"})
    assert r.status_code == 200
    updated = r.json()["data"]
    assert updated["description"] == "desc2"
    assert updated["updatedAt"]

    # delete
    r = c.delete(f"/v1/categories/{cid}", headers={"Authorization": "Bearer x"})
    assert r.status_code == 200
    assert r.json()["data"]["deleted"] is True


def test_category_delete_blocked_when_posts_exist():
    c = _client()

    r = c.post(
        "/v1/categories",
        json={"name": "공지", "slug": "notice"},
        headers={"Authorization": "Bearer x"},
    )
    category = r.json()["data"]
    category_id = category["categoryId"]

    post_payload = {"category": "notice", "title": "공지 1", "content": "본문"}
    r = c.post("/v1/posts", json=post_payload, headers={"Authorization": "Bearer x"})
    assert r.status_code == 200
    post_id = r.json()["data"]["postId"]

    r = c.delete(f"/v1/categories/{category_id}", headers={"Authorization": "Bearer x"})
    assert r.status_code == 409
    assert r.json()["error"]["message"] == "category_has_posts"

    c.delete(f"/v1/posts/{post_id}", headers={"Authorization": "Bearer x"})
    r = c.delete(f"/v1/categories/{category_id}", headers={"Authorization": "Bearer x"})
    assert r.status_code == 200


def test_category_slug_cannot_change():
    c = _client()
    r = c.post(
        "/v1/categories",
        json={"name": "테스트", "slug": "original"},
        headers={"Authorization": "Bearer x"},
    )
    cid = r.json()["data"]["categoryId"]

    r = c.put(
        f"/v1/categories/{cid}",
        json={"slug": "changed"},
        headers={"Authorization": "Bearer x"},
    )
    assert r.status_code == 400
    assert r.json()["error"]["message"] == "slug_immutable"
