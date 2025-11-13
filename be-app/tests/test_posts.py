import pytest

fastapi = pytest.importorskip("fastapi")
from fastapi.testclient import TestClient  # type: ignore


def _client():
    from app.main import app

    return TestClient(app)


def test_posts_crud_happy_path():
    c = _client()

    # list empty
    r = c.get("/v1/posts")
    assert r.status_code == 200
    assert r.json()["data"]["count"] == 0

    # create (requires auth placeholder → send bearer)
    payload = {"category": "ir", "title": "t1", "content": "body", "author": "writer"}
    r = c.post("/v1/posts", json=payload, headers={"Authorization": "Bearer x"})
    assert r.status_code == 200
    post_id = r.json()["data"]["postId"]
    assert r.json()["data"]["author"] == "writer"

    # get
    r = c.get(f"/v1/posts/{post_id}")
    assert r.status_code == 200
    assert r.json()["data"]["title"] == "t1"
    assert r.json()["data"]["author"] == "writer"

    # update
    r = c.put(
        f"/v1/posts/{post_id}",
        json={"title": "t2", "author": "editor"},
        headers={"Authorization": "Bearer x"},
    )
    assert r.status_code == 200
    assert r.json()["data"]["title"] == "t2"
    assert r.json()["data"]["author"] == "editor"

    # delete
    r = c.delete(f"/v1/posts/{post_id}", headers={"Authorization": "Bearer x"})
    assert r.status_code == 200
    assert r.json()["data"]["deleted"] is True
