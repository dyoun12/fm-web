# 04. 인증 및 보안 — 문서화 체크리스트

## 목적
- AWS Amplify + Cognito 기반 프론트 배포/로그인 흐름을 명세하고, Next.js 미들웨어와 FastAPI/OPA 역할 검증 구조를 문서화하여 구현 전 단일 진실(Single Source of Truth)을 확보한다.

## 체크리스트
- [x] `docs/spec.md`에 Amplify 배포, Cognito 로그인/회원가입, Next.js 미들웨어의 역할 기반 라우팅 사실을 반영하고 관련 링크를 추가했다.
- [x] `docs/backend.md`에 Cognito 사용자 등록/로그인 엔드포인트, 역할 메타·토큰 추출, OPA `subject.roles` 평가 흐름을 기술했다.
- [ ] 프론트/백엔드 모두 `custom:role` 사전을 공유하도록 `docs/opa.md` 또는 별도 레퍼런스에 역할 리스트/매핑을 확보한다(후속).
- [x] 변경 파일 경로와 연관 매니페스트(`agents/manifests/backend.yaml`, `AGENTS.md`)를 확인하였다.

## 산출물
- `docs/spec.md` (Amplify·Cognito·미들웨어+역할 명세)
- `docs/backend.md` (Cognito 연계·OPA 역할 검증)

## 참고
- `docs/opa.md` (정책/입출력 규약)
- `docs/prd.md`/`docs/spec.md` (기존 인증 요구사항)
- `agents/manifests/backend.yaml` (DoD/워크플로)
