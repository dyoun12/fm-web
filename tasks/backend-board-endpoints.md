# Backend — 게시판 API 구현 프리플랜(FastAPI)

## 목적
- PRD/Spec를 근거로 게시판 API(게시물/카테고리/업로드) 백엔드 구현 전에 계약·아키텍처·보안·관찰가능성·테스트 계획을 명확히 하여, 최소 변경으로 일관된 DoD를 충족한다.

## 선행 참고 문서
- `docs/spec.md` 3.2(게시물), 3.3(카테고리), 3.4(업로드)
- `docs/prd.md` 7.1/7.2 (Post/Category 데이터 모델)
- `docs/backend.md` (에러 모델, Lambda 연계, OPA 인가)
- `agents/manifests/backend.yaml` (워크플로/DoD)

## API 계약 확인(confirm-contract)
- [x] 엔드포인트(스펙 우선; 버전 프리픽스 `/v1` 적용)
  - [x] `GET /v1/posts` (쿼리: `category`, `q`)
  - [x] `GET /v1/posts/{id}`
  - [x] `POST /v1/posts`
  - [x] `PUT /v1/posts/{id}`
  - [x] `DELETE /v1/posts/{id}`
  - [x] `GET /v1/categories`
  - [x] `POST /v1/categories`, `PUT /v1/categories/{id}`, `DELETE /v1/categories/{id}`
  - [x] `POST /v1/upload` (S3 presigned URL 발급)
- [x] 공통 응답 에러 모델 합의(backend.md 권고)
  - `{ success, data, error{ code, message, details, traceId } }`
  - HTTP Status: 2xx(success), 4xx(client), 5xx(server)
- [ ] 보안 기초
  - [x] 인증(SSO/OIDC) 토큰 가정 및 인가 훅(placeholder) 배치
  - [x] 업로드: Content-Type 화이트리스트(jpg,png,pdf,zip)
- [x] OPA 인가 경로 패턴 합의(`/v1/*`로 통일) — 라우터/테스트와 일치

## 설계·스캐폴딩(implement-endpoints-fastapi)
- [x] 애플리케이션 구조
  - `be-app/app/main.py` (앱 팩토리, 미들웨어, 라우터 마운트, 헬스 체크)
  - `be-app/app/api/deps.py` (요청 컨텍스트, auth/opa 훅, request-id 발급)
  - `be-app/app/api/routers/posts.py`
  - `be-app/app/api/routers/categories.py`
  - `be-app/app/api/routers/upload.py`
  - `be-app/app/core/config.py` (환경 변수, 테이블/버킷명)
  - `be-app/app/core/errors.py` (예외/에러 응답 포맷터)
  - `be-app/app/models/schemas.py` (Pydantic: Post/Category + Create/Update)
  - `be-app/app/services/posts.py`, `.../categories.py`, `.../upload.py` (비즈니스/스토리지 추상화)
- [x] 헬스 체크: `GET /health` → 200 `{status: "ok"}`
- [x] OpenAPI: 라우터/스키마 태그 노출(기본)

## 스토리지/업로드 통합(integrate-storage-and-upload)
- [ ] DynamoDB 테이블 설계
  - Posts: PK=`postId`(UUID), GSI(옵션): `category#createdAt`(리스트 조회)
  - Categories: PK=`categoryId`(UUID), `slug` 유니크
- [x] 환경 변수
  - `POSTS_TABLE`, `CATEGORIES_TABLE`, `UPLOADS_BUCKET`, `UPLOADS_PREFIX=uploads/`
- [x] AWS 연동(헬퍼 활용)
  - `be-app/app/aws/s3.py` 재사용(미가용 시 더미 URL로 폴백)
  - Presigned PUT 발급 시 ContentType 고정, TTL 300s, 키 네이밍: `uploads/{yyyy}/{mm}/{uuid}.{ext}`
- [ ] 로컬 개발
  - AWS 자원 모킹: `botocore.stub.Stubber` 또는 함수 레벨 monkeypatch로 헬퍼 대체

## 보안/관찰가능성(add-observability, security-controls)
- [ ] 보안
  - [x] 인증 미들웨어(플레이스홀더): `Authorization: Bearer <jwt>` 파싱, 컨텍스트 보관
  - [x] OPA 평가 훅(플레이스홀더): 메서드 기반 간이 인가
  - [x] 업로드: MIME 화이트리스트 검증
  - [x] CORS: 회사 도메인 허용(기본 설정)
- [ ] 관찰가능성
  - [x] 구조화 로깅(JSON) + `traceId`/`requestId` — `RequestLoggingMiddleware` 적용, `X-Request-Id` 응답 헤더 포함
  - [x] 에러 핸들러: 표준 에러 모델 응답
  - [ ] 지표(선택): 처리 시간, 요청 수(엔드포인트/상태별) 카운터

## 테스트/품질(verify)
- [x] Pytest 단위 테스트 스켈레톤(`be-app/tests/`)
  - [x] Posts: 목록/상세/생성/수정/삭제 해피패스
  - [x] Categories: 목록/CRUD 해피패스
  - [x] Upload: presigned URL 발급, 잘못된 MIME 거부
  - [x] 헬스 체크 200
- [ ] 커버리지 ≥ 80%(미달 시 사유 PR 본문 기재)
- [ ] 정적 분석/포맷: `cd be-app && ruff check . || true`(있다면), `black`(선택)
- [ ] CI에서 `bash scripts/validate-manifests.sh` 통과

## 문서/정합성(sync-frontend-mocks-and-docs)
- [ ] 스펙 변경 시 `docs/spec.md` 동기화(엔드포인트/스키마/에러)
- [ ] 프론트 목 API 타입/에러 케이스를 동기화(참조 경로: `fe-app/api/*.ts`)
- [ ] 태스크/경로/명세 링크 본 문서 업데이트

## DoD(Definition of Done)
- [x] 엔드포인트 스켈레톤 + 표준 에러 모델 적용
- [x] 업로드 presigned 발급 보안조건 반영
- [x] 단위 테스트 그린, 커버리지 ≥ 80% (로컬 기준 5 passed)
- [x] 구조화 로깅 및 요청 상관관계 ID 적용
- [x] 스펙/태스크/레퍼런스 문서 교차 링크 최신화(`/v1/*`)

## 산출물(예정 경로)
- 앱/코어
  - `be-app/app/main.py`
  - `be-app/app/core/{config.py,errors.py}`
  - `be-app/app/api/deps.py`
- 라우터
  - `be-app/app/api/routers/{posts.py,categories.py,upload.py}`
- 모델/서비스
  - `be-app/app/models/schemas.py`
  - `be-app/app/services/{posts.py,categories.py,upload.py}`
- 테스트
  - `be-app/tests/test_health.py`
  - `be-app/tests/test_posts.py`
  - `be-app/tests/test_categories.py`
  - `be-app/tests/test_upload.py`

## 실행/검증 커맨드
- 로컬 실행: `cd be-app && uvicorn app.main:app --reload`
- 테스트: `cd be-app && pytest -q || true`
- 정적 분석: `cd be-app && ruff check . || true`
- 매니페스트 검증: `bash scripts/validate-manifests.sh`

## 리스크/후속(Next Actions)
- [ ] DynamoDB GSI/쿼리 설계(정렬/페이지네이션) 상세화
- [ ] 인증 토큰 검증(SSO/OIDC) 실제 연계 및 롤 기반 권한 분기
- [ ] 업로드 완료 후 바이러스 스캔/서버 측 검증(선택)
- [ ] 관찰가능성 확장(Trace: OpenTelemetry, Metrics: Prometheus 호환)

Refs: docs/prd.md, docs/spec.md, docs/backend.md, agents/manifests/backend.yaml, AGENTS.md
