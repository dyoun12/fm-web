from __future__ import annotations

from typing import Optional

from .clients import get_boto3_client


def create_presigned_put(
    *,
    bucket: str,
    key: str,
    content_type: str,
    ttl_seconds: int = 300,
) -> str:
    """Create a presigned PUT URL for uploading an object with content-type enforced."""
    s3 = get_boto3_client("s3")
    return s3.generate_presigned_url(
        ClientMethod="put_object",
        Params={"Bucket": bucket, "Key": key, "ContentType": content_type},
        ExpiresIn=ttl_seconds,
        HttpMethod="PUT",
    )


def create_presigned_get(*, bucket: str, key: str, ttl_seconds: int = 300, response_content_type: Optional[str] = None) -> str:
    """Create a presigned GET URL. Optionally set forced response content-type."""
    s3 = get_boto3_client("s3")
    params = {"Bucket": bucket, "Key": key}
    if response_content_type:
        params["ResponseContentType"] = response_content_type
    return s3.generate_presigned_url(
        ClientMethod="get_object",
        Params=params,
        ExpiresIn=ttl_seconds,
        HttpMethod="GET",
    )

