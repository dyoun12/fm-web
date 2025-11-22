from __future__ import annotations

from typing import Any, Dict, Optional

from fastapi import APIRouter, Depends, HTTPException, Query

from ...core.errors import err, ok
from ...models.schemas import PostCreate, PostUpdate
from ...api.deps import get_request_id, require_roles
from ...services import posts as svc


router = APIRouter(prefix="/posts", tags=["posts"])


@router.get("")
def list_posts(
    category: Optional[str] = Query(default=None),
    q: Optional[str] = Query(default=None),
    _: str = Depends(get_request_id),
):
    items = svc.list_posts(category=category, q=q)
    return ok({"items": items, "count": len(items)})


@router.get("/{post_id}")
def get_post(post_id: str, _: str = Depends(get_request_id)):
    item = svc.get_post(post_id)
    if not item:
        raise HTTPException(status_code=404, detail="post_not_found")
    return ok(item)


@router.post("")
def create_post(
    payload: PostCreate,
    _: Any = Depends(require_roles("fm-web:admin", "fm-web:editor")),
    __: str = Depends(get_request_id),
):
    item = svc.create_post(payload.model_dump())
    return ok(item)


@router.put("/{post_id}")
def update_post(
    post_id: str,
    payload: PostUpdate,
    _: Any = Depends(require_roles("fm-web:admin", "fm-web:editor")),
    __: str = Depends(get_request_id),
):
    item = svc.update_post(post_id, payload.model_dump())
    if not item:
        raise HTTPException(status_code=404, detail="post_not_found")
    return ok(item)


@router.delete("/{post_id}")
def delete_post(
    post_id: str,
    _: Any = Depends(require_roles("fm-web:admin", "fm-web:editor")),
    __: str = Depends(get_request_id),
):
    ok_ = svc.delete_post(post_id)
    if not ok_:
        raise HTTPException(status_code=404, detail="post_not_found")
    return ok({"deleted": True, "postId": post_id})
