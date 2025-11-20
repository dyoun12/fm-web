from __future__ import annotations

import uuid
from typing import List, TypedDict

from fastapi import Depends, Header, HTTPException, Request

from ..auth import extract_roles_from_claims, verify_cognito_token


class Subject(TypedDict, total=False):
    sub: str
    email: str
    roles: List[str]
    raw_token: str


def get_request_id(request: Request) -> str:
    rid = request.headers.get("X-Request-Id") or str(uuid.uuid4())
    request.state.request_id = rid
    return rid


def get_subject(authorization: str | None = Header(default=None)) -> Subject:
    """Cognito JWT에서 subject/roles를 추출한다.

    - 기본 동작: 백엔드에서 JWT 서명 검증(또는 API Gateway 선행 검증 신뢰) 후 클레임을 추출
    - `sub`, `email` 기본 클레임
    - `custom:role`, `cognito:groups`를 roles로 매핑
    """
    if authorization and authorization.lower().startswith("bearer "):
        token = authorization.split(" ", 1)[1]
        claims = verify_cognito_token(token)
        sub = str(claims.get("sub") or "anonymous")
        email = str(claims.get("email") or "")
        roles = extract_roles_from_claims(claims)
        return Subject(sub=sub, email=email, roles=roles, raw_token=token)

    return Subject(sub="anonymous", roles=[])


def opa_authorize(request: Request, subject: Subject = Depends(get_subject)) -> None:
    """역할 기반 API 접근 제어.

    - GET/HEAD/OPTIONS 요청은 모두 허용
    - 그 외 메서드는 `fm-web:admin` 또는 `fm-web:editor` 역할만 허용
    """
    method = request.method.upper()
    if method in {"GET", "HEAD", "OPTIONS"}:
        return

    roles = subject.get("roles") or []
    if not any(role in {"fm-web:admin", "fm-web:editor"} for role in roles):
        raise HTTPException(status_code=403, detail="forbidden")

