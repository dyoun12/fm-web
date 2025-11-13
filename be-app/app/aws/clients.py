from __future__ import annotations

import os
from typing import Optional

import boto3
from botocore.config import Config

from .config import get_botocore_config


def _resolve_endpoint(service: str) -> Optional[str]:
    """Return an endpoint override for local emulators (e.g., DynamoDB Local)."""
    # Allow both generic SERVICE_ENDPOINT and service-specific fallbacks.
    service_key = f"{service.upper()}_ENDPOINT"
    endpoint = os.getenv(service_key)
    if service == "dynamodb":
        endpoint = endpoint or os.getenv("DYNAMODB_ENDPOINT")
    return endpoint or None


def get_boto3_client(service: str, *, region_name: Optional[str] = None, config: Optional[Config] = None):
    """Return a configured boto3 client for the given service.

    Region resolves in this order: argument > AWS_REGION/AWS_DEFAULT_REGION > boto3 defaults.
    A standard retry/timeout Config is applied unless explicitly provided.
    """
    region = region_name or os.getenv("AWS_REGION") or os.getenv("AWS_DEFAULT_REGION")
    cfg = config or get_botocore_config()
    endpoint_override = _resolve_endpoint(service)
    kwargs = {"region_name": region, "config": cfg}
    if endpoint_override:
        kwargs["endpoint_url"] = endpoint_override
    return boto3.client(service, **kwargs)


def get_boto3_resource(service: str, *, region_name: Optional[str] = None, config: Optional[Config] = None):
    """Return a configured boto3 resource for the given service."""
    region = region_name or os.getenv("AWS_REGION") or os.getenv("AWS_DEFAULT_REGION")
    cfg = config or get_botocore_config()
    endpoint_override = _resolve_endpoint(service)
    kwargs = {"region_name": region, "config": cfg}
    if endpoint_override:
        kwargs["endpoint_url"] = endpoint_override
    return boto3.resource(service, **kwargs)


def get_aioboto3_client(service: str, *, region_name: Optional[str] = None, config: Optional[Config] = None):
    """Return an aioboto3 client if aioboto3 is available; otherwise raise.

    Usage:
        async with get_aioboto3_client("s3") as s3:
            ...
    """
    try:
        import aioboto3  # type: ignore
    except Exception as e:  # pragma: no cover - optional dep
        raise RuntimeError("aioboto3 is not installed; install to use async AWS SDK") from e

    region = region_name or os.getenv("AWS_REGION") or os.getenv("AWS_DEFAULT_REGION")
    cfg = config or get_botocore_config()
    session = aioboto3.Session(region_name=region)
    return session.client(service, config=cfg)
