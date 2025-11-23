from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Dict, List
from uuid import uuid4

from ..aws import dynamo as dy
from ..aws import ses as ses_email
from ..core import config
from . import corp_meta as corp_meta_svc


_CONTACT_INQUIRIES: Dict[str, Dict[str, Any]] = {}


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _build_contact_notification_subject(item: Dict[str, Any]) -> str:
    base = item.get("subject") or "새 문의가 접수되었습니다."
    return f"[FM-web 문의] {base}"


def _build_contact_notification_body(item: Dict[str, Any]) -> str:
    lines = [
        "FM-web 사이트에 새로운 문의가 접수되었습니다.",
        "",
        f"이름: {item.get('name')}",
        f"이메일: {item.get('email')}",
        f"회사명: {item.get('company') or '-'}",
        f"직책: {item.get('title') or '-'}",
        f"유입경로: {item.get('referral') or '-'}",
        f"제목: {item.get('subject') or '-'}",
        "",
        "문의 내용:",
        item.get("message") or "",
        "",
        f"문의 ID: {item.get('inquiryId')}",
        f"접수 시각(UTC): {item.get('createdAt')}",
    ]
    return "\n".join(lines)


def _build_contact_reply_subject(item: Dict[str, Any]) -> str:
    base = item.get("subject") or "문의 주셔서 감사합니다."
    return f"[FM-web 답변] {base}"


def _build_contact_reply_body(item: Dict[str, Any], reply_message: str) -> str:
    lines = [
        f"{item.get('name')}님, 안녕하세요.",
        "",
        "문의 주셔서 감사합니다. 아래와 같이 답변을 드립니다.",
        "",
        "=== 문의 내용 ===",
        item.get("message") or "",
        "",
        "=== 답변 내용 ===",
        reply_message,
        "",
    ]
    return "\n".join(lines)


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
        # 회사 대표 이메일로 알림 메일 발송(SES)
        subject = _build_contact_notification_subject(item)
        body_text = _build_contact_notification_body(item)
        ses_email.send_email(
            to_addresses=[notified_email],
            subject=subject,
            body_text=body_text,
        )

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

    # 1차 답변 메일을 먼저 발송하고, 성공한 경우에만 DB 상태/메시지를 갱신한다.
    user_email = item.get("email")
    if user_email:
        subject = _build_contact_reply_subject(item)
        body_text = _build_contact_reply_body(item, message)
        send_result = ses_email.send_email(
            to_addresses=[user_email],
            subject=subject,
            body_text=body_text,
        )

        # 메일 발송 실패 시 상태를 변경하지 않고 예외를 발생시킨다.
        if not send_result:
            raise RuntimeError("failed_to_send_contact_reply_email")

    # 메일 발송이 정상적으로 처리된 경우에만 상태/답변을 저장한다.
    item["status"] = "done"
    item["firstReplyMessage"] = message
    item["updatedAt"] = _now_iso()

    if config.USE_DYNAMO and config.CONTACT_INQUIRY_TABLE:
        table = dy.get_table(config.CONTACT_INQUIRY_TABLE)
        table.put_item(Item=item)
    else:
        _CONTACT_INQUIRIES[inquiry_id] = item

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
