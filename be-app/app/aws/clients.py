from __future__ import annotations

import os
from typing import Optional

import boto3
from botocore.config import Config

from .config import get_botocore_config


def get_boto3_client(service: str, *, region_name: Optional[str] = None, config: Optional[Config] = None):
    """Return a configured boto3 client for the given service.

    Region resolves in this order: argument > AWS_REGION/AWS_DEFAULT_REGION > boto3 defaults.
    A standard retry/timeout Config is applied unless explicitly provided.
    """
    region = region_name or os.getenv("AWS_REGION") or os.getenv("AWS_DEFAULT_REGION")
    cfg = config or get_botocore_config()
    return boto3.client(service, region_name=region, config=cfg)


def get_boto3_resource(service: str, *, region_name: Optional[str] = None, config: Optional[Config] = None):
    """Return a configured boto3 resource for the given service."""
    region = region_name or os.getenv("AWS_REGION") or os.getenv("AWS_DEFAULT_REGION")
    cfg = config or get_botocore_config()
    return boto3.resource(service, region_name=region, config=cfg)


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

