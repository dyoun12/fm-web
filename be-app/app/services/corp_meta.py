from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from uuid import uuid4

from ..core import config
from ..aws import dynamo as dy

_CORP_META: Dict[str, Dict[str, Any]] = {}


class CorpMetaLimitReachedError(Exception):
    """Multiple corp meta entries are not allowed."""


def _has_existing_corp_meta() -> bool:
    if config.USE_DYNAMO:
        table = dy.get_table(config.CORP_META_TABLE)
        resp = table.scan(Limit=1)
        return resp.get("Count", 0) > 0
    return len(_CORP_META) > 0


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def list_corp_meta() -> List[Dict[str, Any]]:
    if config.USE_DYNAMO:
        table = dy.get_table(config.CORP_META_TABLE)
        resp = table.scan()
        items = resp.get("Items", [])
        items.sort(key=lambda item: item.get("createdAt", ""), reverse=True)
        return items
    items = sorted(_CORP_META.values(), key=lambda item: item.get("createdAt", ""), reverse=True)
    return items


def get_corp_meta(corp_meta_id: str) -> Optional[Dict[str, Any]]:
    if config.USE_DYNAMO:
        table = dy.get_table(config.CORP_META_TABLE)
        resp = table.get_item(Key={"corpMetaId": corp_meta_id})
        return resp.get("Item")
    return _CORP_META.get(corp_meta_id)


def create_corp_meta(data: Dict[str, Any]) -> Dict[str, Any]:
    if _has_existing_corp_meta():
        raise CorpMetaLimitReachedError("단일 회사 정보만 등록할 수 있습니다.")
    corp_meta_id = data.get("corpMetaId") or str(uuid4())
    timestamp = _now_iso()
    item = {
        **{k: v for k, v in data.items() if v is not None},
        "corpMetaId": corp_meta_id,
        "createdAt": timestamp,
        "updatedAt": timestamp,
    }
    if config.USE_DYNAMO:
        table = dy.get_table(config.CORP_META_TABLE)
        table.put_item(Item=item)
        return item
    _CORP_META[corp_meta_id] = item
    return item


def update_corp_meta(corp_meta_id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    if config.USE_DYNAMO:
        table = dy.get_table(config.CORP_META_TABLE)
        item = get_corp_meta(corp_meta_id)
        if not item:
            return None
        for key, value in data.items():
            if value is not None:
                item[key] = value
        item["updatedAt"] = _now_iso()
        table.put_item(Item=item)
        return item
    if corp_meta_id not in _CORP_META:
        return None
    for key, value in data.items():
        if value is not None:
            _CORP_META[corp_meta_id][key] = value
    _CORP_META[corp_meta_id]["updatedAt"] = _now_iso()
    return _CORP_META[corp_meta_id]


def delete_corp_meta(corp_meta_id: str) -> bool:
    if config.USE_DYNAMO:
        table = dy.get_table(config.CORP_META_TABLE)
        table.delete_item(Key={"corpMetaId": corp_meta_id})
        return True
    return _CORP_META.pop(corp_meta_id, None) is not None
