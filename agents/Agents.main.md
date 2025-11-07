# Agents.main — 메인 에이전트 오케스트레이션 지침

본 문서는 메인 에이전트가 서브 에이전트들을 오케스트레이션하여 일관된 산출물을 만들기 위한 절차와 사고 방식을 정의한다. 상세 도메인 규칙은 `agents/Agents.*.md`에 위임한다.

## 목적/역할
- 태스크 인입 → 분류 → 할당 → 동기화 → 검수 → 머지의 전 과정 관리
- 문서/설계/구현/테스트/릴리즈 간 정합성 유지와 의사결정 기록 관리

## 운영 원칙(사고 방식)
- 문서 우선: `/docs`의 PRD·Spec·Design을 먼저 확인하고 변경 영향 범위를 도출한다.
- 최소 변경: 범위 밖 수정/리팩터링을 피하고, 기존 컨벤션을 존중한다.
- 테스트 우선: 가능하면 스토리/테스트를 먼저 작성·업데이트한 후 구현한다.
- 단일 진실 원천: 문서와 코드, Dev Preview, 스토리의 상태가 일치하도록 유지한다.
- 추적성: 모든 의사결정/예외는 `tasks/`에 체크리스트와 링크로 남긴다.

## 태스크 플로우(오케스트레이션)
0) Load Manifests(필수 선행)
   - `manifests/project.yaml` 및 `agents/manifests/*.yaml`을 로드해 제약/우선순위를 확인
   - 불일치/누락 발견 시 Docs(Agents.docs)와 협업하여 소스 문서 업데이트 제안
1) Intake(요청 수집)
   - 입력: 사용자 요청/이슈/PR 코멘트
   - 산출: 태스크 티켓 `tasks/{task-name}.md` 생성(목표/범위/Done 정의)
2) Triage(분류)
   - 종류 판별: UI / API / 상태 / QA / 문서 / 아이콘 / 혼합
   - 의존성 파악: 선행/후행 관계(예: API→상태→UI→QA→Docs)
3) Dispatch(할당)
   - 해당 서브에이전트 지침에 따라 단계/체크리스트를 명시하고 담당 지정
4) Sync(동기화)
   - 공유 산출물 정렬: 스키마/토큰/경로/스토리 Title/Dev Preview 연결
   - 중간 검증: `npm run lint`, `npm run test -- --run` 로컬 통과 확인
5) Validate(검수)
   - DoD 체크리스트 기준 검토(아래 참조)
6) Merge(병합)
   - 커밋/PR 템플릿 및 스크린샷/로그 첨부, 리뷰어 지정

## 공통 DoD(Definition of Done)
- 문서 동기화: `/docs`와 구현/스토리/Dev Preview가 일치
- 테스트: 단위 테스트 추가/갱신, 네트워크는 MSW 모킹, 커버리지 80% 유지(미달 시 사유 기록)
- 접근성: 키보드/포커스/aria 속성 검증(해당 시)
- 린트/타입: `npm run lint` 통과(경고도 실패)
- 태스크: `tasks/{task-name}.md` 체크리스트 완료 및 관련 경로 링크

## 서브 에이전트 매핑 규칙
- UI 컴포넌트: `agents/Agents.ui.md` 절차 준수(Atoms 우선, 스토리→테스트→구현→Dev Preview)
- API/사양·모킹: `agents/Agents.api.md`(Spec 우선, Mock 우선, 에러 우선 설계)
- 상태관리(RTK): `agents/Agents.state.md`(전역/로컬 판단 트리, 아톰/몰리큘 내부 Redux 금지)
- 테스트/품질: `agents/Agents.qa.md`(스택/커버리지/파이프라인 관리)
- 문서/정합성: `agents/Agents.docs.md`(단일 진실 원천, 교차 링크, 차이 보고)
- 아이콘/접근성: `agents/Agents.icons.md`(Remix Icon, 토큰/접근성)

## 의사결정/에스컬레이션
- 갈등/충돌: 설계(Design) ↔ 구현(UI) ↔ 사양(API) 불일치 시, 문서 담당(Agents.docs) 주도로 소스 문서 갱신 후 재전파
- 범위 확대 필요: 메인 에이전트가 영향도/리스크를 정리하고 태스크 분리 제안
- 차단 이슈: 재현 절차/로그와 함께 `tasks/feedback/`에 원인/대안 기록

## PR 운영
- Conventional Commits, 헤더 72자, 한국어 현재형
- PR 본문: 변경 요약, 영향 범위, 테스트 결과(로그/스크린샷), 관련 문서 링크

## 빠른 플레이북(예시)
- 신규 컴포넌트 추가: UI(스토리→테스트→구현) → QA(테스트) → Docs(Dev Preview/문서 링크) → Main(DoD 검수)
- API 스키마 변경: API(Mock/타입) → State(적용) → UI(연동) → QA(MSW/케이스) → Docs(명세 갱신) → Main(DoD)
- 전역 상태 추가: State(스토어/슬라이스/테스트) → UI(상위 주입) → QA → Docs → Main
