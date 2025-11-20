from __future__ import annotations

from typing import Any, Dict, Optional
import time

from fastapi import APIRouter, HTTPException, Request, Response
from pydantic import BaseModel
from urllib.parse import urlencode
from urllib.request import Request as HttpRequest, urlopen

from ...core import config
from ...auth.cognito import _ssl_context
from ...core.errors import ok
from ...auth import verify_cognito_token, extract_roles_from_claims


router = APIRouter(prefix="/auth", tags=["auth"])


class LoginCallbackRequest(BaseModel):
    code: str
    redirectUri: Optional[str] = None


def _exchange_code_for_tokens(code: str, redirect_uri: str) -> Dict[str, Any]:
    missing: list[str] = []
    if not config.COGNITO_DOMAIN:
        missing.append("COGNITO_DOMAIN")
    if not config.COGNITO_CLIENT_ID:
        missing.append("COGNITO_CLIENT_ID")
    if not redirect_uri:
        missing.append("COGNITO_REDIRECT_URI")
    if missing:
        # 어떤 설정이 비어 있는지 함께 알려준다.
        raise HTTPException(status_code=500, detail=f"cognito_not_configured:missing={','.join(missing)}")

    token_url = f"https://{config.COGNITO_DOMAIN}/oauth2/token"

    form = {
        "grant_type": "authorization_code",
        "client_id": config.COGNITO_CLIENT_ID,
        "code": code,
        "redirect_uri": redirect_uri,
    }
    if config.COGNITO_CLIENT_SECRET:
        form["client_secret"] = config.COGNITO_CLIENT_SECRET

    body = urlencode(form).encode("utf-8")
    req = HttpRequest(
        token_url,
        data=body,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        method="POST",
    )

    try:
        with urlopen(req, timeout=5, context=_ssl_context()) as resp:
            payload_bytes = resp.read()
            status = resp.status
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"cognito_token_exchange_failed:network_error:{e!s}")

    try:
        import json

        tokens = json.loads(payload_bytes.decode("utf-8"))
    except Exception:
        raise HTTPException(status_code=502, detail="cognito_token_parse_failed")

    if status != 200:
        # Cognito가 반환한 에러를 최대한 노출해 디버깅을 돕는다.
        error = tokens.get("error") if isinstance(tokens, dict) else None
        desc = tokens.get("error_description") if isinstance(tokens, dict) else None
        detail = f"cognito_token_exchange_failed:status={status}"
        if error:
            detail += f":error={error}"
        if desc:
            detail += f":desc={desc}"
        raise HTTPException(status_code=502, detail=detail)

    if "access_token" not in tokens:
        raise HTTPException(status_code=502, detail="cognito_token_missing_access_token")

    return tokens


@router.get("/login")
def login_get_info(request: Request, response: Response):
    """GET /v1/auth/login 요청에 대한 안내용 엔드포인트.

    - 브라우저/헬스체크 등이 잘못된 메서드(GET)로 호출하더라도 405 대신
      의미 있는 JSON 응답을 반환해 디버깅을 돕는다.
    - 실제 로그인 처리는 POST /v1/auth/login을 사용해야 한다.
    """
    origin = request.headers.get("origin")
    if origin:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"

    data = {
        "message": "로그인 처리는 POST /v1/auth/login 엔드포인트를 사용해야 합니다.",
        "method": "GET",
        "success": False,
    }
    return ok(data)


@router.post("/login")
def login_with_code(payload: LoginCallbackRequest, request: Request, response: Response):
    """Cognito Hosted UI에서 전달된 Authorization Code를 토큰으로 교환하고 쿠키를 설정한다.

    - ID Token을 역할/세션 판단의 기준으로 사용하고, 이를 HttpOnly 쿠키로 저장한다.
    - Access Token/Refresh Token은 필요 시 API 호출 등에 활용할 수 있다.
    """
    code = payload.code
    if not code:
        raise HTTPException(status_code=400, detail="missing_code")

    redirect_uri = payload.redirectUri or config.COGNITO_REDIRECT_URI
    tokens = _exchange_code_for_tokens(code, redirect_uri=redirect_uri or "")

    access_token = tokens.get("access_token")
    id_token = tokens.get("id_token")
    refresh_token = tokens.get("refresh_token")

    if not id_token:
        raise HTTPException(status_code=502, detail="cognito_token_missing_id_token")

    # 역할/세션 판단은 ID Token을 기준으로 수행한다.
    claims = verify_cognito_token(id_token)
    roles = extract_roles_from_claims(claims)

    # 쿠키 만료 시간은 Cognito ID Token의 exp 또는 설정된 최대 수명과 맞춘다.
    max_age: Optional[int] = None
    if config.AUTH_COOKIE_MAX_AGE_SECONDS > 0:
        max_age = config.AUTH_COOKIE_MAX_AGE_SECONDS
    else:
        exp = claims.get("exp")
        if isinstance(exp, (int, float)):
            now_ts = int(time.time())
            delta = int(exp) - now_ts
            if delta > 0:
                max_age = delta

    # HttpOnly 쿠키에 ID Token 저장 (이름은 프론트와 합의된 값 사용)
    cookie_name = config.AUTH_COOKIE_NAME
    secure = config.AUTH_COOKIE_SECURE
    response.set_cookie(
        key=cookie_name,
        value=id_token,
        max_age=max_age,
        httponly=True,
        secure=secure,
        samesite="lax",
        path="/",
    )

    # 최소한의 사용자 정보 반환 (프론트는 필요 시 상태 저장용으로 사용 가능)
    subject = {
        "sub": claims.get("sub"),
        "email": claims.get("email"),
        "roles": roles,
    }

    # CORS: 브라우저에서 직접 호출하는 엔드포인트이므로, Origin 기준으로 허용 헤더를 명시적으로 추가해준다.
    origin = request.headers.get("origin")
    if origin:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"

    data = {
        "user": subject,
        "hasIdToken": bool(id_token),
        "hasRefreshToken": bool(refresh_token),
    }
    return ok(data)


@router.options("/login")
def login_options(request: Request, response: Response):
    """CORS preflight 대응: /v1/auth/login 에 대한 OPTIONS 요청을 처리한다."""
    origin = request.headers.get("origin")
    if origin:
        response.headers["Access-Control-Allow-Origin"] = origin
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = request.headers.get(
        "access-control-request-headers", "content-type,authorization"
    )
    return Response(status_code=204)
