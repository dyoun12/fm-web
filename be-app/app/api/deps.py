from __future__ import annotations

import uuid
from typing import List, TypedDict

from fastapi import Depends, Header, HTTPException, Request

from ..auth import extract_roles_from_claims, verify_cognito_token
from ..core import config


class Subject(TypedDict, total=False):
    sub: str
    email: str
    roles: List[str]
    raw_token: str


def get_request_id(request: Request) -> str:
    rid = request.headers.get("X-Request-Id") or str(uuid.uuid4())
    request.state.request_id = rid
    return rid


def get_subject(request: Request, authorization: str | None = Header(default=None)) -> Subject:
    """Cognito JWT에서 subject/roles를 추출한다.

    - 기본 동작: 백엔드에서 JWT 서명 검증(또는 API Gateway 선행 검증 신뢰) 후 클레임을 추출
    - `sub`, `email` 기본 클레임
    - `custom:role`, `cognito:groups`를 roles로 매핑
    """
    token: str | None = None

    # 1) Authorization 헤더 우선
    if authorization and authorization.lower().startswith("bearer "):
        token = authorization.split(" ", 1)[1]

    # 2) 없으면 HttpOnly 쿠키에서 토큰 조회
    if not token:
        cookie_name = config.AUTH_COOKIE_NAME or "fm_auth_token"
        cookie_token = request.cookies.get(cookie_name)
        if cookie_token:
            token = cookie_token

    if token:
        claims = verify_cognito_token(token)
        sub = str(claims.get("sub") or "anonymous")
        email = str(claims.get("email") or "")
        roles = extract_roles_from_claims(claims)
        return Subject(sub=sub, email=email, roles=roles, raw_token=token)

    return Subject(sub="anonymous", roles=[])


def require_roles(*allowed_roles: str):
    """엔드포인트별 역할 기반 접근 제어를 위한 의존성 팩토리.

    사용 예:
        @router.post("")
        def create(..., _: Any = Depends(require_roles("fm-web:admin", "fm-web:editor"))):
            ...

    - Cognito User Pool이 설정되지 않은 환경(로컬 개발 등)에서는 검사 우회
    - allowed_roles 중 하나라도 포함되지 않으면 403 반환
    """

    allowed = set(allowed_roles)

    def _dep(request: Request, subject: Subject = Depends(get_subject)) -> None:
        # Cognito 설정이 없으면(dev/local) 권한 검사 우회
        if not config.COGNITO_USER_POOL_ID:
            return

        roles = subject.get("roles") or []
        if not any(role in allowed for role in roles):
            raise HTTPException(status_code=403, detail="forbidden")

    return _dep


def opa_authorize(request: Request, subject: Subject = Depends(get_subject)) -> None:
    """기존 사용처 호환용: admin/editor 역할만 허용."""
    # require_roles를 직접 호출해 동일한 검사 수행
    return require_roles("fm-web:admin", "fm-web:editor")(request, subject)
