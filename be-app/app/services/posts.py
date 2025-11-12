from __future__ import annotations

import os
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from uuid import uuid4

from ..core import config
from ..aws import dynamo as dy


_POSTS: Dict[str, Dict[str, Any]] = {}


def list_posts(*, category: Optional[str] = None, q: Optional[str] = None) -> List[Dict[str, Any]]:
    if config.USE_DYNAMO:
        # Fallback to scan for simplicity; optimize with GSI in infra
        table = dy.get_table(config.POSTS_TABLE)
        from boto3.dynamodb.conditions import Attr  # type: ignore

        filter_expr = None
        if category:
            filter_expr = Attr("category").eq(category)
        if q:
            cond = Attr("title").contains(q) | Attr("content").contains(q)
            filter_expr = cond if filter_expr is None else (filter_expr & cond)
        if filter_expr is None:
            resp = table.scan()
        else:
            resp = table.scan(FilterExpression=filter_expr)
        items = resp.get("Items", [])
        items.sort(key=lambda x: x.get("createdAt", ""), reverse=True)
        return items
    else:
        items = list(_POSTS.values())
        if category:
            items = [p for p in items if p.get("category") == category]
        if q:
            items = [p for p in items if q.lower() in (p.get("title", "") + p.get("content", "")).lower()]
        items.sort(key=lambda x: x.get("createdAt", ""), reverse=True)
        return items


def get_post(post_id: str) -> Optional[Dict[str, Any]]:
    if config.USE_DYNAMO:
        table = dy.get_table(config.POSTS_TABLE)
        resp = table.get_item(Key={"postId": post_id})
        return resp.get("Item")
    return _POSTS.get(post_id)


def create_post(data: Dict[str, Any]) -> Dict[str, Any]:
    now = datetime.now(timezone.utc)
    post_id = data.get("postId") or str(uuid4())
    item = {
        **data,
        "postId": post_id,
        "createdAt": now.isoformat(),
        "updatedAt": now.isoformat(),
    }
    if config.USE_DYNAMO:
        table = dy.get_table(config.POSTS_TABLE)
        table.put_item(Item=item)
        return item
    _POSTS[post_id] = item
    return item


def update_post(post_id: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    now = datetime.now(timezone.utc)
    if config.USE_DYNAMO:
        table = dy.get_table(config.POSTS_TABLE)
        if not get_post(post_id):
            return None
        expr_parts = []
        names = {}
        values = {}
        for k, v in data.items():
            if v is None:
                continue
            expr_parts.append(f"#f_{k} = :v_{k}")
            names[f"#f_{k}"] = k
            values[f":v_{k}"] = v
        expr_parts.append("#f_updatedAt = :v_updatedAt")
        names["#f_updatedAt"] = "updatedAt"
        values[":v_updatedAt"] = now.isoformat()
        table.update_item(
            Key={"postId": post_id},
            UpdateExpression="SET " + ", ".join(expr_parts),
            ExpressionAttributeNames=names,
            ExpressionAttributeValues=values,
        )
        return get_post(post_id)
    if post_id not in _POSTS:
        return None
    _POSTS[post_id].update({k: v for k, v in data.items() if v is not None})
    _POSTS[post_id]["updatedAt"] = now.isoformat()
    return _POSTS[post_id]


def delete_post(post_id: str) -> bool:
    if config.USE_DYNAMO:
        table = dy.get_table(config.POSTS_TABLE)
        table.delete_item(Key={"postId": post_id})
        return True
    return _POSTS.pop(post_id, None) is not None
