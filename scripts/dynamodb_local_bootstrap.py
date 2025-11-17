#!/usr/bin/env python3
"""
Create local DynamoDB tables so that SAM/FastAPI can write real data during development.

Usage:
  python scripts/dynamodb_local_bootstrap.py \
    --endpoint http://localhost:8000 \
    --posts-table fm_posts_local \
    --categories-table fm_categories_local \
    --corp-table fm_corp_meta_local
"""

from __future__ import annotations

import argparse
import boto3
from botocore.exceptions import ClientError


def wait_table(table) -> None:
    print(f"[wait] {table.name} becoming ACTIVE ...")
    table.wait_until_exists()
    print(f"[ready] {table.name}")


def ensure_posts_table(dynamodb, table_name: str) -> None:
    try:
        table = dynamodb.Table(table_name)
        table.load()
        print(f"[skip] {table_name} already exists")
        return
    except ClientError as exc:
        error = exc.response.get("Error", {})
        if error.get("Code") != "ResourceNotFoundException":
            raise
    print(f"[create] {table_name} (posts)")
    table = dynamodb.create_table(
        TableName=table_name,
        KeySchema=[{"AttributeName": "postId", "KeyType": "HASH"}],
        AttributeDefinitions=[
            {"AttributeName": "postId", "AttributeType": "S"},
            {"AttributeName": "category", "AttributeType": "S"},
            {"AttributeName": "createdAt", "AttributeType": "S"},
        ],
        GlobalSecondaryIndexes=[
            {
                "IndexName": "category_createdAt",
                "KeySchema": [
                    {"AttributeName": "category", "KeyType": "HASH"},
                    {"AttributeName": "createdAt", "KeyType": "RANGE"},
                ],
                "Projection": {"ProjectionType": "ALL"},
            }
        ],
        BillingMode="PAY_PER_REQUEST",
    )
    wait_table(table)


def ensure_categories_table(dynamodb, table_name: str) -> None:
    try:
        table = dynamodb.Table(table_name)
        table.load()
        print(f"[skip] {table_name} already exists")
        return
    except ClientError as exc:
        error = exc.response.get("Error", {})
        if error.get("Code") != "ResourceNotFoundException":
            raise
    print(f"[create] {table_name} (categories)")
    table = dynamodb.create_table(
        TableName=table_name,
        KeySchema=[{"AttributeName": "categoryId", "KeyType": "HASH"}],
        AttributeDefinitions=[
            {"AttributeName": "categoryId", "AttributeType": "S"},
            {"AttributeName": "slug", "AttributeType": "S"},
        ],
        GlobalSecondaryIndexes=[
            {
                "IndexName": "slug_index",
                "KeySchema": [{"AttributeName": "slug", "KeyType": "HASH"}],
                "Projection": {"ProjectionType": "ALL"},
            }
        ],
        BillingMode="PAY_PER_REQUEST",
    )
    wait_table(table)


def ensure_corp_table(dynamodb, table_name: str) -> None:
    try:
        table = dynamodb.Table(table_name)
        table.load()
        print(f"[skip] {table_name} already exists")
        return
    except ClientError as exc:
        error = exc.response.get("Error", {})
        if error.get("Code") != "ResourceNotFoundException":
            raise
    print(f"[create] {table_name} (corp meta)")
    table = dynamodb.create_table(
        TableName=table_name,
        KeySchema=[{"AttributeName": "corpMetaId", "KeyType": "HASH"}],
        AttributeDefinitions=[
            {"AttributeName": "corpMetaId", "AttributeType": "S"},
        ],
        BillingMode="PAY_PER_REQUEST",
    )
    wait_table(table)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Provision DynamoDB Local tables for development.")
    parser.add_argument("--endpoint", default="http://localhost:8000", help="DynamoDB endpoint (default: http://localhost:8000)")
    parser.add_argument("--region", default="ap-northeast-2", help="AWS region name (default: ap-northeast-2)")
    parser.add_argument("--posts-table", default="fm_posts_local", help="Posts table name")
    parser.add_argument("--categories-table", default="fm_categories_local", help="Categories table name")
    parser.add_argument("--corp-table", default="fm_corp_meta_local", help="Corp meta table name")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    session = boto3.resource("dynamodb", region_name=args.region, endpoint_url=args.endpoint)
    ensure_posts_table(session, args.posts_table)
    ensure_categories_table(session, args.categories_table)
    ensure_corp_table(session, args.corp_table)
    print("[done] DynamoDB Local tables ready")


if __name__ == "__main__":
    main()
