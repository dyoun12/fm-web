from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from uuid import uuid4

from ..core import config
from ..aws import dynamo as dy


_CATEGORIES: Dict[str, Dict[str, Any]] = {}


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def get_category(category_id: str) -> Optional[Dict[str, Any]]:
    if config.USE_DYNAMO:
        table = dy.get_table(config.CATEGORIES_TABLE)
        resp = table.get_item(Key={"categoryId": category_id})
        return resp.get("Item")
    return _CATEGORIES.get(category_id)


def list_categories() -> List[Dict[str, Any]]:
    if config.USE_DYNAMO:
        table = dy.get_table(config.CATEGORIES_TABLE)
        resp = table.scan()
        items = resp.get("Items", [])
        return sorted(items, key=lambda c: (c.get("order") or 0, c.get("name", "")))
    return sorted(_CATEGORIES.values(), key=lambda c: (c.get("order") or 0, c.get("name", "")))


def create_category(data: Dict[str, Any]) -> Dict[str, Any]:
    category_id = data.get("categoryId") or str(uuid4())
    timestamp = _now_iso()
    item = {
        **data,
        "categoryId": category_id,
        "order": data.get("order", 0),
        "createdAt": timestamp,
        "updatedAt": timestamp,
    }
    if config.USE_DYNAMO:
        table = dy.get_table(config.CATEGORIES_TABLE)
        table.put_item(Item=item)
        return item
    _CATEGORIES[category_id] = item
    return item


def update_category(category_id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    if config.USE_DYNAMO:
        table = dy.get_table(config.CATEGORIES_TABLE)
        # naive: fetch-then-update
        item = get_category(category_id)
        if not item:
            return None
        for k, v in data.items():
            if v is not None:
                item[k] = v
        item["updatedAt"] = _now_iso()
        table.put_item(Item=item)
        return item
    if category_id not in _CATEGORIES:
        return None
    _CATEGORIES[category_id].update({k: v for k, v in data.items() if v is not None})
    _CATEGORIES[category_id]["updatedAt"] = _now_iso()
    return _CATEGORIES[category_id]


def delete_category(category_id: str) -> bool:
    if config.USE_DYNAMO:
        table = dy.get_table(config.CATEGORIES_TABLE)
        table.delete_item(Key={"categoryId": category_id})
        return True
    return _CATEGORIES.pop(category_id, None) is not None
