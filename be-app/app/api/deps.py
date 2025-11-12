from __future__ import annotations

import uuid
from typing import Any, Dict

from fastapi import Depends, Header, HTTPException, Request


def get_request_id(request: Request) -> str:
    rid = request.headers.get("X-Request-Id") or str(uuid.uuid4())
    request.state.request_id = rid
    return rid


def get_subject(authorization: str | None = Header(default=None)) -> Dict[str, Any]:
    # Placeholder for OIDC/JWT parsing. Keep subject minimal for now.
    if authorization and authorization.lower().startswith("bearer "):
        token = authorization.split(" ", 1)[1]
        return {"sub": "user", "token": token}
    return {"sub": "anonymous"}


def opa_authorize(request: Request, subject: Dict[str, Any] = Depends(get_subject)) -> None:
    # Placeholder OPA check: allow GETs for all; restrict mutating methods to non-anonymous
    method = request.method.upper()
    if method in {"GET"}:
        return
    if subject.get("sub") == "anonymous":
        raise HTTPException(status_code=403, detail="forbidden")

