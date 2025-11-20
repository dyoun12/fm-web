from __future__ import annotations

from typing import Any, Dict, List
import json
from urllib.request import urlopen
import ssl

import certifi
from jose import jwt

from ..core import config

_jwks_cache: Dict[str, Any] | None = None


def _ssl_context() -> ssl.SSLContext:
  """신뢰할 수 있는 루트 인증서를 포함한 SSL 컨텍스트를 반환한다."""
  ctx = ssl.create_default_context(cafile=certifi.where())
  return ctx


class CognitoConfigError(RuntimeError):
  """Cognito 구성 오류를 나타내는 예외."""


def _get_jwks_url() -> str:
  if config.COGNITO_JWKS_URL:
    return config.COGNITO_JWKS_URL
  if not config.COGNITO_REGION or not config.COGNITO_USER_POOL_ID:
    raise CognitoConfigError("COGNITO_REGION 또는 COGNITO_USER_POOL_ID가 설정되지 않았습니다.")
  return f"https://cognito-idp.{config.COGNITO_REGION}.amazonaws.com/{config.COGNITO_USER_POOL_ID}/.well-known/jwks.json"


def _load_jwks() -> Dict[str, Any]:
  global _jwks_cache
  if _jwks_cache is None:
    url = _get_jwks_url()
    with urlopen(url, timeout=3, context=_ssl_context()) as resp:
      _jwks_cache = json.load(resp)
  return _jwks_cache


def verify_cognito_token(token: str) -> Dict[str, Any]:
  """Cognito JWT 서명을 검증하고 클레임을 반환한다.

  - 기본값: python-jose를 이용해 JWKS 기반 서명 검증(issuer/audience/만료) 수행
  - `COGNITO_TRUST_API_GATEWAY=1`인 경우, API Gateway Cognito Authorizer가 서명 검증을 완료했다고 보고
    백엔드에서는 클레임만 검증 없이 추출한다(defense-in-depth 비활성화).
  """
  if config.COGNITO_TRUST_API_GATEWAY:
    # API Gateway에서 서명 검증을 수행했다고 가정하고, 클레임만 추출
    return jwt.get_unverified_claims(token)

  jwks = _load_jwks()
  unverified_header = jwt.get_unverified_header(token)
  kid = unverified_header.get("kid")
  if not kid:
    raise ValueError("JWT header에 kid가 없습니다.")

  keys = jwks.get("keys", [])
  key = next((k for k in keys if k.get("kid") == kid), None)
  if key is None:
    raise ValueError("JWKS에서 일치하는 kid를 찾을 수 없습니다.")

  issuer = None
  if config.COGNITO_REGION and config.COGNITO_USER_POOL_ID:
    issuer = f"https://cognito-idp.{config.COGNITO_REGION}.amazonaws.com/{config.COGNITO_USER_POOL_ID}"

  audience = config.COGNITO_CLIENT_ID
  options: Dict[str, bool] = {
    # at_hash 클레임은 선택 사항이므로 access_token 없이도 검증이 가능하도록 비활성화한다.
    "verify_aud": bool(audience),
    "verify_at_hash": False,
  }

  return jwt.decode(
    token,
    key,
    algorithms=[unverified_header.get("alg", "RS256")],
    audience=audience,
    issuer=issuer,
    options=options,
  )


def extract_roles_from_claims(payload: Dict[str, Any]) -> List[str]:
  """Cognito 클레임에서 역할 배열을 추출한다.

  이 프로젝트에서는 역할을 `{서비스명}:{역할명}` 포맷으로 사용하며,
  fm-web 서비스의 역할만 인식한다. 예:
    - fm-web:admin
    - fm-web:editor
    - fm-web:viewer
  """
  roles: List[str] = []

  def _add_role(value: Any) -> None:
    if isinstance(value, str) and value.startswith("fm-web:") and value not in roles:
      roles.append(value)

  # custom:roles (복수형) 우선, 리스트/단일 문자열 모두 허용
  custom_roles = payload.get("custom:roles")
  if isinstance(custom_roles, list):
    for value in custom_roles:
      _add_role(value)
  else:
    _add_role(custom_roles)

  groups = payload.get("cognito:groups")
  if isinstance(groups, list):
    for g in groups:
      _add_role(g)

  return roles
