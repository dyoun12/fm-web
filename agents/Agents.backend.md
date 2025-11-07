# Agents.backend — 백엔드 서브에이전트 지침

본 문서는 API 서버/인증/스토리지/업로드 등 백엔드 영역을 담당하는 서브에이전트의 실행 규칙을 정의한다. 상위 규범은 `AGENTS.md`, 오케스트레이션은 `agents/Agents.main.md`를 따른다. 세부 아키텍처 레퍼런스는 `docs/backend_infra_architecture.md`를 참조한다.

## 역할
- API 계약(Contract) 설계 및 구현(예: Spring Boot 기반)
- 인증(OIDC + 2FA), 세션/토큰 보안 정책 적용
- 데이터 모델/저장소 연계(DynamoDB 등) 및 파일 업로드(presigned URL)
- 에러 모델 표준화/로깅/모니터링/성능 최적화

## 운영 원칙(사고 방식)
- 계약 우선(Spec-first): `/docs/spec.md`와 합의된 API 계약을 기준으로 설계/구현
- 보안 우선(Security-by-default): 최소 권한, HTTPS, HttpOnly 쿠키, 입력 검증
- 호환성(Backward-compat): 파괴적 변경은 버전 분리 또는 점진적 마이그레이션
- 관찰 가능성(Observability): 구조화 로깅, 트레이싱/메트릭 노출, 에러 상관관계 추적
- 성능/복원력: 캐싱/재시도/타임아웃/서킷브레이커 고려
- 추적성: API 변경은 스펙/프런트/테스트와 동시 갱신, `tasks/` 로그 유지

## 참조 문서
- `docs/spec.md` — 기능/엔드포인트/스키마 명세
- `docs/prd.md` — 요구사항/흐름
- `docs/backend_infra_architecture.md` — 백엔드/인프라 구조
- `AGENTS.md` 보안 원칙 — OIDC + 2FA, S3 presigned 등

## 실행 순서(표준)
1) 스펙 확정: 엔드포인트/모델/에러 코드 테이블 합의(OpenAPI 권장)
2) 어댑터/레이어 설계: 컨트롤러→서비스→리포지토리 분리, 예외/DTO 정의
3) 기능 구현: 단위 테스트 우선, 실패/경계 케이스 포함
4) 스토리지/업로드: DynamoDB 파티셔닝/인덱스 설계, S3 presigned URL 발급/검증
5) 인증/인가: OIDC 플로우, 2FA 검증, 토큰 수명/리프레시 정책 적용
6) 관찰/성능: 로깅 스키마, 메트릭/대시보드 항목 정의
7) 문서/계약 동기화: 스펙/프론트 API 목/상태 훅/테스트 갱신

## 산출물(이 저장소 기준)
- 백엔드 코드: `be-app/` (예: Gradle/Maven 표준 구조 `be-app/src/main/java`, `be-app/src/test/java`)
- 계약/명세: `docs/spec.md` 업데이트, 에러 모델 표준 표 추가
- 통신 계약: 프런트 목(`fe-app/api/*.ts`)과 동기화 가이드/예외 목록(프런트 목은 계약 검증/개발 편의를 위한 별도 계층)
- 태스크/로그: `tasks/{task-name}.md` 변경 이력/마이그레이션 안내

## 금지 사항
- 스펙 미합의 상태에서의 엔드포인트 추가/변경
- presigned 미사용 직접 업로드, 민감 정보 로그 출력
- 파괴적 변경을 사전 공지 없이 배포
