from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException

from ...api.deps import get_request_id, opa_authorize
from ...core.errors import ok
from ...models.schemas import CategoryCreate, CategoryUpdate
from ...services import categories as svc
from ...services import posts as posts_svc


router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("")
def list_categories(_: str = Depends(get_request_id)):
    return ok({"items": svc.list_categories()})


@router.get("/{category_id}")
def get_category(category_id: str, _: str = Depends(get_request_id)):
    item = svc.get_category(category_id)
    if not item:
        raise HTTPException(status_code=404, detail="category_not_found")
    return ok(item)


@router.post("")
def create_category(payload: CategoryCreate, _: Any = Depends(opa_authorize), __: str = Depends(get_request_id)):
    return ok(svc.create_category(payload.model_dump()))


@router.put("/{category_id}")
def update_category(category_id: str, payload: CategoryUpdate, _: Any = Depends(opa_authorize), __: str = Depends(get_request_id)):
    existing = svc.get_category(category_id)
    if not existing:
        raise HTTPException(status_code=404, detail="category_not_found")
    if payload.slug and payload.slug != existing.get("slug"):
        raise HTTPException(status_code=400, detail="slug_immutable")
    item = svc.update_category(category_id, payload.model_dump())
    if not item:
        raise HTTPException(status_code=404, detail="category_not_found")
    return ok(item)


@router.delete("/{category_id}")
def delete_category(category_id: str, _: Any = Depends(opa_authorize), __: str = Depends(get_request_id)):
    category = svc.get_category(category_id)
    if not category:
        raise HTTPException(status_code=404, detail="category_not_found")

    slug = category.get("slug")
    related_posts = []
    if slug:
        related_posts = posts_svc.list_posts(category=slug)
    else:
        related_posts = [p for p in posts_svc.list_posts() if p.get("categoryId") == category_id]
    if related_posts:
        raise HTTPException(status_code=409, detail="category_has_posts")

    svc.delete_category(category_id)
    return ok({"deleted": True, "categoryId": category_id})
