from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException

from ...api.deps import get_request_id, opa_authorize
from ...core import config
from ...core.errors import ok
from ...services.upload import create_presigned_put_url


router = APIRouter(prefix="/upload", tags=["upload"])


@router.post("")
def presign_upload(
    *,
    filename: str,
    contentType: str,
    _: Any = Depends(opa_authorize),
    __: str = Depends(get_request_id),
):
    if contentType not in config.ALLOWED_UPLOAD_MIME:
        raise HTTPException(status_code=400, detail="unsupported_content_type")
    url = create_presigned_put_url(filename=filename, content_type=contentType)
    return ok({"url": url})
