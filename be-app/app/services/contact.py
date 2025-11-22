from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Dict, List
from uuid import uuid4

from ..aws import dynamo as dy
from ..core import config
from . import corp_meta as corp_meta_svc


_CONTACT_INQUIRIES: Dict[str, Dict[str, Any]] = {}


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def create_contact_inquiry(data: Dict[str, Any]) -> Dict[str, Any]:
    inquiry_id = str(uuid4())
    timestamp = _now_iso()

    item: Dict[str, Any] = {
        **{k: v for k, v in data.items() if v is not None},
        "inquiryId": inquiry_id,
        "status": "new",
        "createdAt": timestamp,
        "updatedAt": timestamp,
    }

    if config.USE_DYNAMO and config.CONTACT_INQUIRY_TABLE:
        table = dy.get_table(config.CONTACT_INQUIRY_TABLE)
        table.put_item(Item=item)
    else:
        _CONTACT_INQUIRIES[inquiry_id] = item

    # 대표 이메일 조회 (corpmeta.email 기준)
    notified_email: str | None = None
    corp_items = corp_meta_svc.list_corp_meta()
    if corp_items:
        first = corp_items[0]
        notified_email = first.get("email")

    if notified_email:
        item["notifiedEmail"] = notified_email
        # TODO: 메일 발송 로직 연동(SES 등). 현재는 문서/플로우 정렬 단계이므로 저장만 수행.

    return item


def list_contact_inquiries() -> List[Dict[str, Any]]:
    if config.USE_DYNAMO and config.CONTACT_INQUIRY_TABLE:
        table = dy.get_table(config.CONTACT_INQUIRY_TABLE)
        resp = table.scan()
        items = resp.get("Items", [])
    else:
        items = list(_CONTACT_INQUIRIES.values())

    items.sort(key=lambda item: item.get("createdAt", ""), reverse=True)
    return items


def get_contact_inquiry(inquiry_id: str) -> Dict[str, Any] | None:
    if config.USE_DYNAMO and config.CONTACT_INQUIRY_TABLE:
        table = dy.get_table(config.CONTACT_INQUIRY_TABLE)
        resp = table.get_item(Key={"inquiryId": inquiry_id})
        return resp.get("Item")
    return _CONTACT_INQUIRIES.get(inquiry_id)


def reply_to_contact_inquiry(inquiry_id: str, message: str) -> Dict[str, Any] | None:
    item = get_contact_inquiry(inquiry_id)
    if not item:
        return None

    # 1차 답변 발송 시 상태를 완료로 표시
    item["status"] = "done"
    item["firstReplyMessage"] = message
    item["updatedAt"] = _now_iso()

    if config.USE_DYNAMO and config.CONTACT_INQUIRY_TABLE:
        table = dy.get_table(config.CONTACT_INQUIRY_TABLE)
        table.put_item(Item=item)
    else:
        _CONTACT_INQUIRIES[inquiry_id] = item

    # TODO: 실제 이메일 발송(SES 등) 및 실패 시 로깅/재시도 전략 추가
    return item


def update_contact_inquiry_status(inquiry_id: str, status: str) -> Dict[str, Any] | None:
    item = get_contact_inquiry(inquiry_id)
    if not item:
        return None

    item["status"] = status
    item["updatedAt"] = _now_iso()

    if config.USE_DYNAMO and config.CONTACT_INQUIRY_TABLE:
        table = dy.get_table(config.CONTACT_INQUIRY_TABLE)
        table.put_item(Item=item)
    else:
        _CONTACT_INQUIRIES[inquiry_id] = item

    return item
