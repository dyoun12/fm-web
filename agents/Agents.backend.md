# Agents.backend — 백엔드 서브에이전트 지침

본 문서는 API 서버/인증/스토리지/업로드 등 백엔드 영역을 담당하는 서브에이전트의 실행 규칙을 정의한다. 상위 규범은 `AGENTS.md`, 오케스트레이션은 `agents/Agents.main.md`를 따른다. 백엔드 구조는 `docs/backend.md`, 인프라/배포 레퍼런스는 `docs/infra.md`를 참조한다.

## 역할
- API 계약(Contract) 설계 및 구현(런타임: FastAPI)
- 인증(OIDC + 2FA), 세션/토큰 보안 정책 적용
- 데이터 계층: 키-값/문서형(DynamoDB) 기본 + 필요 시 ElastiCache 병행 적용, 파일 업로드(presigned URL)
- 에러 모델 표준화/로깅/모니터링/성능 최적화
 - 인가(Authorization): OPA(Rego) 정책 기반, WASM 번들을 Lambda Layer로 주입해 앱에서 평가

## 운영 원칙(사고 방식)
- 계약 우선(Spec-first): `/docs/spec.md`와 합의된 API 계약을 기준으로 설계/구현
- 보안 우선(Security-by-default): 최소 권한, HTTPS, HttpOnly 쿠키, 입력 검증
- 호환성(Backward-compat): 파괴적 변경은 버전 분리 또는 점진적 마이그레이션
- 관찰 가능성(Observability): 구조화 로깅, 트레이싱/메트릭 노출, 에러 상관관계 추적
- 성능/복원력: 캐싱/재시도/타임아웃/서킷브레이커 고려
- 추적성: API 변경은 스펙/프런트/테스트와 동시 갱신, `tasks/` 로그 유지
- 인프라 분리(Infra-separated): Lambda, API Gateway 등 배포 세부는 인프라 문서에서 관리
- Lambda-무관 앱 구성: 백엔드 구현은 순수 ASGI(FastAPI)로 두고, 이벤트→HTTP 변환은 어댑터로 처리
- AWS SDK 우선(AWS SDK first): AWS 리소스 접근은 `boto3`/`aioboto3` 등 SDK 사용을 기본으로 하며, 직접 HTTP 호출을 지양

## 참조 문서
- `docs/spec.md` — 기능/엔드포인트/스키마 명세
- `docs/prd.md` — 요구사항/흐름
- `docs/backend.md` — 백엔드 아키텍처/데이터 저장 전략
- `docs/infra.md` — 인프라/배포 구조(FastAPI on Lambda, Terraform+SAM)
- `AGENTS.md` 보안 원칙 — OIDC + 2FA, S3 presigned 등

## 실행 순서(표준)
1) 스펙 확정: 엔드포인트/모델/에러 코드 테이블 합의(OpenAPI 권장)
2) 레이어 설계: 라우터/서비스/리포지토리 분리, 예외/DTO 정의(FastAPI)
   - RDB: SQLAlchemy ORM/SQLModel 중 택1, 마이그레이션은 Alembic 권장
   - 캐시: ElastiCache(Redis) 기반 캐시 전략(키 설계/TTL/무효화) 정의
   - NoSQL: 액세스 패턴 기반 테이블/GSI 설계(DynamoDB)
3) 기능 구현: 단위 테스트 우선, 실패/경계 케이스 포함
4) 스토리지/업로드: DynamoDB 파티셔닝/인덱스 설계, S3 presigned URL 발급/검증
5) 인증/인가: OIDC 플로우, 2FA 검증, 토큰 수명/리프레시 정책 적용
6) 관찰/성능: 로깅 스키마, 메트릭/대시보드 항목 정의
7) 문서/계약 동기화: 스펙/프론트 API 목/상태 훅/테스트 갱신

### Lambda 엔트리(백엔드 측 최소 인지 사항)
- Lambda 배포 시 API Gateway로부터 JSON 이벤트를 수신하고, 이를 HTTP 요청으로 변환해 FastAPI(ASGI) 앱에 전달한다.
- 이 변환은 어댑터가 담당하며 두 가지 대표 옵션이 있다(백엔드 구현은 ASGI 순수성을 유지):
  - 컨테이너 + AWS Lambda Web Adapter(인프라에서 주입/설정)
  - 함수 핸들러 + `Mangum` 어댑터(Python 코드에서 `handler = Mangum(app)` 선언)
- 어떤 방식이든 백엔드 구현 관점에서는 FastAPI 라우팅/의존성/예외 처리에만 집중한다.

### OPA(Authorization) 적용 지침
- 정책 소스/번들 경로: 개발은 `be-app/opa/`(로컬), 배포는 `/opt/opa/bundle`(Lambda Layer)
- 경로 주입: `OPA_BUNDLE_PATH` 환경변수 사용(기본 dev 경로, 배포는 `/opt/opa/bundle`)
- 평가 규약: 입력(JSON) = subject/resource/action/context, 출력(JSON) = `{ allow: boolean, reason? }`
- 상세 가이드는 `docs/opa.md` 참고

## 산출물(이 저장소 기준)
- 백엔드 코드: `be-app/` (예: FastAPI 표준 구조 `be-app/app`, 테스트 `be-app/tests`)
- 계약/명세: `docs/spec.md` 업데이트, 에러 모델 표준 표 추가
- 통신 계약: 프런트 목(`fe-app/api/*.ts`)과 동기화 가이드/예외 목록(프런트 목은 계약 검증/개발 편의를 위한 별도 계층)
- 태스크/로그: `tasks/{task-name}.md` 변경 이력/마이그레이션 안내

## 금지 사항
- 스펙 미합의 상태에서의 엔드포인트 추가/변경
- presigned 미사용 직접 업로드, 민감 정보 로그 출력
- 파괴적 변경을 사전 공지 없이 배포
