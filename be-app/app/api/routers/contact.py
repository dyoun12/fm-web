from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException

from ...api.deps import get_request_id, require_roles
from ...core.errors import ok
from ...models.schemas import ContactInquiryCreate, ContactReplyCreate
from ...services import contact as svc


router = APIRouter(prefix="/contact", tags=["contact"])


@router.get("")
def list_contact_inquiries(_: str = Depends(get_request_id)) -> Any:
    items = svc.list_contact_inquiries()
    return ok({"items": items, "count": len(items)})


@router.get("/{inquiry_id}")
def get_contact_inquiry(inquiry_id: str, _: str = Depends(get_request_id)) -> Any:
    item = svc.get_contact_inquiry(inquiry_id)
    if not item:
        raise HTTPException(status_code=404, detail="contact_inquiry_not_found")
    return ok(item)


@router.post("")
def create_contact_inquiry(payload: ContactInquiryCreate, _: str = Depends(get_request_id)) -> Any:
    item = svc.create_contact_inquiry(payload.model_dump())
    return ok(item)


@router.post("/{inquiry_id}/reply")
def reply_contact_inquiry(
    inquiry_id: str,
    payload: ContactReplyCreate,
    _: Any = Depends(require_roles("fm-web:admin", "fm-web:editor")),
    __: str = Depends(get_request_id),
) -> Any:
    item = svc.reply_to_contact_inquiry(inquiry_id, payload.message)
    if not item:
        raise HTTPException(status_code=404, detail="contact_inquiry_not_found")
    return ok(item)
