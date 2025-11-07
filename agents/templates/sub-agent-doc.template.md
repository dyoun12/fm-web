# Agents.__AGENT_SLUG_PASCAL__ — __AGENT_TITLE__ 서브에이전트 지침

본 문서는 __AGENT_TITLE__ 관련 서브에이전트의 실행 규칙을 정의한다. 상위 규범은 `AGENTS.md`, 오케스트레이션은 `agents/Agents.main.md`를 따른다.

## 역할
- __AGENT_PURPOSE__
- 세부 범위: __(예: UI 컴포넌트 생성·개선 / API 스펙·모킹 / 상태관리 구성 / 테스트·품질 / 문서 정합성 / 아이콘·a11y)__

## 운영 원칙(사고 방식)
- 문서 우선: PRD/Spec/Design 교차 확인 후 범위/의존성 확정
- 선언 우선: `agents/manifests/__AGENT_SLUG__.yaml` 매니페스트 기준으로 계획 수립
- 최소 변경: 기존 컨벤션/네이밍/배치 준수, 중복 정보 금지(링크 참조)
- 테스트/검증 우선: 스토리/테스트/린트 선행, Dev Preview/접근성 검토(해당 시)
- 추적성: `tasks/{task-name}.md`에 파일 경로/검증 로그 기록

## 참조 문서
- PRD: `docs/prd.md`
- Spec: `docs/spec.md`
- Design: `docs/design-guide.md`
- Icons: `docs/icons-remix.md` (해당 시)

## 실행 순서(필수)
1) 스캐폴딩/링크 점검(필요 시 스토리/테스트 선행)
2) 구현/갱신(아톰 우선, 계약 우선 등 도메인 규칙 적용)
3) Dev Preview/스토리/테스트/문서 동기화
4) 린트/테스트 통과, 커버리지 기준 충족
5) 태스크 로그/PR 본문에 변경 요약/영향 범위/참조 링크 기재

## 산출물
- 코드/문서/스토리/테스트 경로를 명시(예시: `fe-app/app/components/...`, `fe-app/tests/...`)
- 매니페스트: `agents/manifests/__AGENT_SLUG__.yaml`

## 금지 사항
- 범위 외 임의 스타일/설정 추가, 중복 정의, 테스트 무시 머지

