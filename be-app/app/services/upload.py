from __future__ import annotations

import os
import uuid
from datetime import datetime

from ..core import config


def create_presigned_put_url(*, filename: str, content_type: str) -> str:
    """Create a presigned PUT URL for uploads. Falls back to dummy URL if SDK unavailable.

    Enforces allowed content types and uses a time-based key prefix.
    """
    if content_type not in config.ALLOWED_UPLOAD_MIME:
        raise ValueError("unsupported_content_type")

    now = datetime.utcnow()
    ext = os.path.splitext(filename)[1].lstrip(".") or "bin"
    key = f"{config.UPLOADS_PREFIX}{now:%Y/%m}/{uuid.uuid4()}.{ext}"

    try:
        from ..aws.s3 import create_presigned_put as _presigned

        return _presigned(bucket=config.UPLOADS_BUCKET, key=key, content_type=content_type, ttl_seconds=300)
    except Exception:
        # Fallback dummy URL for non-AWS local environments
        return f"https://example.local/{config.UPLOADS_BUCKET}/{key}?dummy=1"

