from __future__ import annotations

import os
from typing import Any, Dict, List, Optional
from uuid import uuid4

from ..core import config
from ..aws import dynamo as dy


_CATEGORIES: Dict[str, Dict[str, Any]] = {}


def list_categories() -> List[Dict[str, Any]]:
    if config.USE_DYNAMO:
        table = dy.get_table(config.CATEGORIES_TABLE)
        resp = table.scan()
        items = resp.get("Items", [])
        return sorted(items, key=lambda c: (c.get("order") or 0, c.get("name", "")))
    return sorted(_CATEGORIES.values(), key=lambda c: (c.get("order") or 0, c.get("name", "")))


def create_category(data: Dict[str, Any]) -> Dict[str, Any]:
    category_id = data.get("categoryId") or str(uuid4())
    item = {**data, "categoryId": category_id}
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
        resp = table.get_item(Key={"categoryId": category_id})
        if "Item" not in resp:
            return None
        item = resp["Item"]
        for k, v in data.items():
            if v is not None:
                item[k] = v
        table.put_item(Item=item)
        return item
    if category_id not in _CATEGORIES:
        return None
    _CATEGORIES[category_id].update({k: v for k, v in data.items() if v is not None})
    return _CATEGORIES[category_id]


def delete_category(category_id: str) -> bool:
    if config.USE_DYNAMO:
        table = dy.get_table(config.CATEGORIES_TABLE)
        table.delete_item(Key={"categoryId": category_id})
        return True
    return _CATEGORIES.pop(category_id, None) is not None
