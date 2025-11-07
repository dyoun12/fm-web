# Agents.generator — 서브 에이전트 생성/스캐폴딩 지침

본 문서는 신규 서브 에이전트를 일관된 규칙으로 생성하기 위한 생성 에이전트의 절차를 정의한다. 생성 에이전트는 선언적 매니페스트와 문서 템플릿을 기반으로 스캐폴딩을 수행한다.

## 목적/역할
- 공통 형식(매니페스트 + 지침 문서)으로 서브 에이전트를 신속/일관 생성
- AGENTS 공통 규범과 메인 오케스트레이션(Agents.main) 플로우에 자동 연결

## 산출물(필수)
- 문서: `agents/Agents.{slug}.md` (템플릿 기반)
- 매니페스트: `agents/manifests/{slug}.yaml` (스키마 준수)

## 참조
- 공통 규범: `AGENTS.md`
- 오케스트레이션: `agents/Agents.main.md`
- 스키마: `agents/schema/agent-manifest.schema.json`
- 템플릿: `agents/templates/sub-agent-doc.template.md`, `agents/templates/agent-manifest.template.yaml`

## 운영 원칙(사고 방식)
- 문서 우선: PRD/Spec/Design 참조 후 역할·범위를 명확히 서술
- 선언 우선: 매니페스트로 역할/입출력/의존/체크리스트를 먼저 정의
- 최소 변경: 기존 컨벤션/네이밍/배치 준수, 중복 정보 금지(링크 참조)
- 검증 우선: 스키마 검증 → 문서 생성 → 링크 점검 순서 유지
- 추적성: 생성 작업/결정은 `tasks/`에 체크리스트로 남김

## 생성 절차(스캐폴딩)
1) 매개변수 확정: `slug`(kebab), `title`(표기명), `purpose`(요약)
2) 스크립트 실행:
   - `bash scripts/create-sub-agent.sh <slug> "<Title>" "<Purpose>"`
3) 산출물 확인:
   - `agents/Agents.<slug>.md` 파일 내용에서 플레이스홀더 치환 확인
   - `agents/manifests/<slug>.yaml`가 스키마와 일치하는지 확인
4) AGENTS 인덱스 반영: 필요 시 `AGENTS.md` Sub-Agents 인덱스에 항목 추가(PR에서 동시 처리)
5) 태스크 기록: `tasks/{task-name}.md`에 생성 로그/링크 첨부

## 매니페스트 필드(요약)
- `id`(string): `agents.<slug>`
- `title`(string): 표기명
- `purpose`(string): 한 줄 요약
- `scope`(string[]): 담당 범위(예: ui | api | state | qa | docs | icons)
- `principles`(string[]): 운영 원칙 요약 키워드
- `inputs`(string[]): 주로 참조하는 문서/경로
- `outputs`(string[]): 생성/갱신 산출물 경로 패턴
- `workflows`(object[]): 트리거/단계/검증 정의
- `dod`(string[]): DoD 체크리스트
- `links`(object): 참조 링크(AGENTS/Docs/Tasks)

## 검증
- JSON Schema: `agents/schema/agent-manifest.schema.json`와의 정합성 확인(리뷰 단계 수동 검증)
- 링크 점검: 문서 내 파일 경로와 스토리/Dev Preview 연결 유효성 수동 확인

