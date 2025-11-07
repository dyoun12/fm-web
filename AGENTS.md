# Repository Guidelines (Agents 공통 지침)

본 문서는 저장소 전반에 적용되는 에이전트 공통 행동 지침을 정의한다. 세부 역할별 절차/체크리스트는 `agents/Agents.{feature}.md`에 기술하며, 본 문서는 중복을 피하고 모든 에이전트가 공유해야 할 공통 규범만을 유지한다.

## Sub-Agents 인덱스
- UI 컴포넌트: `agents/Agents.ui.md`
- 상태관리: `agents/Agents.state.md`
- API/사양·모킹: `agents/Agents.api.md`
- 문서/정합성: `agents/Agents.docs.md`
- 테스트/품질: `agents/Agents.qa.md`
- 아이콘/접근성: `agents/Agents.icons.md`
- 메인 오케스트레이션: `agents/Agents.main.md`
- 생성/스캐폴딩: `agents/Agents.generator.md`
- 백엔드: `agents/Agents.backend.md`
- 인프라: `agents/Agents.infra.md`

## 매니페스트 인덱스(선언 스냅샷)
- 프로젝트: `manifests/project.yaml`
  - 모듈(fe-app/docs/agents/tasks), 명령/컨벤션, 디렉터리, 테스트/보안, 문서, 워크플로, 품질 게이트 선언
- 에이전트(오케스트레이션): `agents/manifests/main.yaml`
  - 목적: 인테이크→분류→할당→동기화→검수→머지 / DoD: dod-criteria-met, reviewers-assigned, pr-template-complete
- 에이전트(UI): `agents/manifests/ui.yaml`
  - 목적: Atomic Design 컴포넌트(스토리/테스트 선행, Dev Preview 동기화) / DoD: stories-added, tests-added, dev-preview-updated, lint-passed, docs-links-updated
- 에이전트(API): `agents/manifests/api.yaml`
  - 목적: 계약 정의, 목/에러 우선, MSW 연동 / DoD: contract-documented, mocks-cover-errors, tests-green, docs-updated
- 에이전트(State/RTK): `agents/manifests/state.yaml`
  - 목적: RTK 스토어/슬라이스/타입/테스트 유지 / DoD: provider-wired, reducers-tested, typed-hooks-exposed, docs-updated
- 에이전트(Docs): `agents/manifests/docs.yaml`
  - 목적: 단일 진실 원천 유지, 교차 링크, 변경 기록 / DoD: source-updated, diffs-logged, links-valid
- 에이전트(QA): `agents/manifests/qa.yaml`
  - 목적: 위험 기반 테스트, 실패 케이스/커버리지 관리 / DoD: tests-green, coverage-meets-threshold, msw-applied
- 에이전트(Icons/a11y): `agents/manifests/icons.yaml`
  - 목적: Remix Icon+a11y 패턴 표준화 / DoD: aria-patterns-documented, usage-examples-added, tokens-applied
- 에이전트(Generator): `agents/manifests/generator.yaml`
  - 목적: 템플릿/스키마 기반 스캐폴딩 자동화 / DoD: files-generated, schema-checked, index-updated
- 에이전트(Backend): `agents/manifests/backend.yaml`
  - 목적: API 서버/인증/스토리지/업로드/에러 모델/관찰가능성 / DoD: contract-updated, error-model-documented, security-controls-applied, observability-instrumented
- 에이전트(Infra): `agents/manifests/infra.yaml`
  - 목적: IaC/CI-CD/시크릿/보안/관찰가능성/운영 자동화 / DoD: environments-declared, pipelines-wired, secrets-managed, alerts-configured

각 Sub-Agent는 본 문서를 상위 규범으로 따르며, 충돌 시 본 문서의 규칙이 우선한다.

## 에이전트 공통 실행 원칙
- 문서 우선: 작업 전 `/docs`의 PRD·Spec·Design을 교차 확인한다.
- 최소 변경: 범위 밖 수정/리팩터링을 피하고 기존 컨벤션을 존중한다.
- 테스트 우선: 스토리/단위 테스트를 먼저 작성·갱신하고 이후 구현한다.
- 단일 진실 원천: 문서/코드/스토리/Dev Preview 간 정합성을 유지한다.
- 추적성: 모든 작업은 `tasks/`에 체크리스트와 파일 경로 링크로 기록한다.
- 품질 게이트: `npm run lint` 경고도 실패로 간주, 테스트 통과 전 머지 금지.

### 매니페스트 인식 규칙(필수)
- 모든 Codex 요청 시작 시, 계획 수립 전에 다음 매니페스트를 우선 조회한다.
  - 프로젝트: `manifests/project.yaml`
  - 에이전트: `agents/manifests/*.yaml`
- 매니페스트는 본 문서의 상위 규범을 보완하는 선언적 제약으로 간주한다.
- 매니페스트 변경이 필요한 경우, 문서/코드/테스트 변경과 동일 PR에서 동기화한다.
 - 검증: 로컬/CI에서 `bash scripts/validate-manifests.sh`로 기본 키/스키마 검증을 수행한다(ajv-cli가 설치되어 있으면 스키마 검증, 없으면 키 존재 검증 수행).

## 계획 및 태스크 관리
- 스프린트 단위 요약: `tasks/tasks.md`
- 상세 작업: `tasks/{task-name}.md`(원자 단위 체크리스트, 산출물 링크 포함)
- 피드백 로그: `tasks/feedback/`에 검토 결과/차단 이슈/대안 기록

## 커밋 및 Pull Request 가이드라인
- 브랜치: `feature/{티켓번호}-{요약}` (예: `feature/FM-123-main-hero`)
- 커밋(Conventional Commits, 스코프 미사용)
  - 형식: `type: message`
  - 타입: `feat|fix|refactor|test|chore|docs|init|build|ci|perf|style|revert`
  - 헤더 72자, 콜론 뒤 공백 1칸, 한국어 현재형/명령형
  - 중대한 변경은 본문에 `BREAKING CHANGE:` 명시
- PR 본문: 변경 요약, 영향 범위, 테스트 결과(로그/스크린샷), 관련 문서 링크 포함

### 커밋 자동화 설정
- 훅 경로: `.githooks/`
- 훅: `commit-msg`(헤더 규칙 검증), `pre-commit`(lint/test 실행)
- 커밋 템플릿: `.gitmessage.txt`
- 설정:
  - `bash scripts/setup-git-hooks.sh` 1회 실행 또는 수동 설정
  - `git config core.hooksPath .githooks`
  - `git config commit.template .gitmessage.txt`
  - `chmod +x .githooks/commit-msg`
- 통과 규칙: 타입/형식/길이, 경고 0, 테스트 통과
- 예외: 문서/이미지 전용 커밋은 `pre-commit`에서 자동 건너뜀, 긴급 시 `--no-verify` 사용 가능

## 보안 및 환경 구성
- 비밀정보는 커밋 금지, `.env.local` 대신 보안 저장소(예: Parameter Store) 사용
- 인증: OIDC + 2FA, 토큰은 HttpOnly 쿠키, HTTPS 기본
- 업로드: S3 presigned URL 사용, 서버에서 파일 크기/MIME 검증

## 참고 문서 및 검토 절차
- `/docs/prd.md`(제품 요구사항), `/docs/spec.md`(기능 명세), `/docs/design-guide.md`(디자인 기준) 우선 참조
- Builder(구현 전 재검토) ↔ Validator(명세 일치 검증) 역할 분리
- 문서-산출물 불일치 시 경고 기록 및 보정 태스크 추가

## 응답 언어 정책
- 커뮤니케이션/산출물은 한국어를 사용(필요 시 기술 용어 병기)
- 코드 주석 외 영어 사용 지양, 불일치 발견 시 한국어 대체 문장을 제안
