from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException

from ...api.deps import get_request_id, opa_authorize
from ...core.errors import ok
from ...models.schemas import CorpMetaCreate, CorpMetaUpdate
from ...services import corp_meta as svc

router = APIRouter(prefix="/corpmeta", tags=["corpmeta"])


@router.get("")
def list_corp_meta(_: str = Depends(get_request_id)):
    items = svc.list_corp_meta()
    return ok({"items": items, "count": len(items)})


@router.get("/{corp_meta_id}")
def get_corp_meta(corp_meta_id: str, _: str = Depends(get_request_id)):
    item = svc.get_corp_meta(corp_meta_id)
    if not item:
        raise HTTPException(status_code=404, detail="corp_meta_not_found")
    return ok(item)


@router.post("")
def create_corp_meta(payload: CorpMetaCreate, _: Any = Depends(opa_authorize), __: str = Depends(get_request_id)):
    try:
        item = svc.create_corp_meta(payload.model_dump(exclude_unset=True))
    except svc.CorpMetaLimitReachedError as exc:
        raise HTTPException(status_code=409, detail=str(exc))
    return ok(item)


@router.put("/{corp_meta_id}")
def update_corp_meta(
    corp_meta_id: str,
    payload: CorpMetaUpdate,
    _: Any = Depends(opa_authorize),
    __: str = Depends(get_request_id),
):
    item = svc.update_corp_meta(corp_meta_id, payload.model_dump(exclude_unset=True))
    if not item:
        raise HTTPException(status_code=404, detail="corp_meta_not_found")
    return ok(item)


@router.delete("/{corp_meta_id}")
def delete_corp_meta(corp_meta_id: str, _: Any = Depends(opa_authorize), __: str = Depends(get_request_id)):
    ok_ = svc.delete_corp_meta(corp_meta_id)
    if not ok_:
        raise HTTPException(status_code=404, detail="corp_meta_not_found")
    return ok({"deleted": True, "corpMetaId": corp_meta_id})
