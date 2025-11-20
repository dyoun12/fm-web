# Auth 접근 제어 레퍼런스

프론트엔드(Next.js 미들웨어)와 백엔드(FastAPI/OPA)의 역할·경로 기반 접근 제어를 정리한 참조 문서이다.

## 1. 역할 사전
- 역할 포맷: `{서비스명}:{역할명}`
- 본 프로젝트(fm-web)에서 사용하는 역할:
  - `fm-web:admin`: 전체 관리자
  - `fm-web:editor`: 콘텐츠 편집/게시 가능
  - `fm-web:viewer`: 읽기 전용

## 2. 경로별 기본 정책

### 프론트엔드 (Next.js `middleware.ts`)
- `/admin/:path*` → `fm-web:admin`, `fm-web:editor`
- `/secure/:path*` → `fm-web:admin`, `fm-web:editor`, `fm-web:viewer`
- `/api/admin/:path*` → `fm-web:admin`

구현 위치:
- `fe-app/lib/auth/access-control.ts`
- `fe-app/middleware.ts`

### 백엔드 (FastAPI `opa_authorize`)
- `GET/HEAD/OPTIONS` → 전체 허용
- 그 외 메서드(`POST/PUT/PATCH/DELETE` 등) → `fm-web:admin`, `fm-web:editor` 만 허용

JWT 처리 흐름:
- API Gateway 단계
  - 가능하다면 Cognito Authorizer를 사용하여 서명/issuer/audience/만료를 검증한다.
  - 백엔드는 신뢰할 수 있는 JWT만 전달받는 것을 전제로 한다.
- FastAPI 단계
  - `be-app/app/auth/cognito.py:verify_cognito_token`에서 python-jose와 JWKS를 사용해 서명을 검증하거나,
    `COGNITO_TRUST_API_GATEWAY=1`인 경우 Gateway 검증을 신뢰하고 클레임만 추출한다.
  - `extract_roles_from_claims`에서 `custom:role` 및 `cognito:groups`를 기반으로 역할 배열을 생성한다.
  - `be-app/app/api/deps.py:get_subject`가 위 로직을 통해 `Subject`를 구성하고, `opa_authorize`가 메서드/역할별 접근 허용 여부를 판단한다.

구현 위치:
- `be-app/app/api/deps.py:get_subject`
- `be-app/app/api/deps.py:opa_authorize`

## 3. Cognito 연계 요약
- Cognito User Pool 토큰에서 다음 클레임을 사용한다.
  - `sub`, `email`
  - `custom:role`
  - `cognito:groups`
- 프론트/백엔드 모두 위 클레임을 기반으로 `fm-web:admin|fm-web:editor|fm-web:viewer` 역할을 추출하며,
  다른 서비스 프리픽스의 역할은 무시한다.
