from __future__ import annotations

from typing import Any, Dict, Mapping

from .clients import get_boto3_resource


def get_table(table_name: str):
    """Return a DynamoDB Table resource."""
    dynamodb = get_boto3_resource("dynamodb")
    return dynamodb.Table(table_name)


def put_item(table_name: str, item: Mapping[str, Any]) -> Dict[str, Any]:
    """Put an item into a DynamoDB table."""
    table = get_table(table_name)
    resp = table.put_item(Item=dict(item))
    return resp


def get_item(table_name: str, key: Mapping[str, Any]) -> Dict[str, Any]:
    """Get an item by key from a DynamoDB table."""
    table = get_table(table_name)
    return table.get_item(Key=dict(key))


def update_counter(table_name: str, key: Mapping[str, Any], attr: str = "count", delta: int = 1) -> Dict[str, Any]:
    """Atomically increment/decrement a numeric counter attribute."""
    table = get_table(table_name)
    return table.update_item(
        Key=dict(key),
        UpdateExpression=f"ADD #attr :delta",
        ExpressionAttributeNames={"#attr": attr},
        ExpressionAttributeValues={":delta": delta},
        ReturnValues="UPDATED_NEW",
    )

