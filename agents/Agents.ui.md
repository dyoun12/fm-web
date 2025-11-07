# Agents.ui — UI 컴포넌트 서브에이전트 지침

본 문서는 Atomic Design 기반 UI 작업을 수행하는 서브에이전트의 실행 규칙을 정의한다. 상위 규범은 `AGENTS.md`를 따른다.

## 역할
- 아톰/몰리큘/오거나니즘 컴포넌트 생성·개선
- 스토리(문서)·테스트 동반 작성 및 Dev Preview 반영
- 디자인 가이드/토큰 준수와 접근성(a11y) 확보

## 운영 원칙(사고 방식)
- 문서 우선: PRD/Spec/Design 교차 확인 후 컴포넌트 범위/변형 정의
- Atoms 우선: 스타일/토큰은 아톰 변형으로 설계하고 상위는 조합·배치만 담당
- 테스트·스토리 선행: 스토리→테스트→구현 순서를 기본으로 유지
- 접근성 우선: 키보드 포커스, aria 속성, 대비(AA) 충족
- 중복 금지: 공통 패턴은 아톰화, 토큰은 디자인 가이드 참조
- 추적성: 생성 파일 경로/검증 결과를 `tasks/{task-name}.md`에 기록

## 참조 문서
- `docs/design-guide.md` — 디자인 기준 및 토큰
- `docs/foundation.md` — FE 원칙
- `docs/icons-remix.md` — 아이콘 사용 규칙

## 네이밍/경로 규칙
- 위치: `fe-app/app/components/{atoms|molecules|organisms}/{component-kebab}/`
- 파일: `{component-kebab}.stories.tsx`, `{component-kebab}.test.tsx`, `{component-kebab}.tsx`
- 컴포넌트 export: PascalCase, 파일/디렉터리: kebab-case, 훅: camelCase

## 실행 순서(필수)
1) 스캐폴딩: 폴더 생성 후 스토리 → 테스트 → 컴포넌트 순으로 작성
2) 스토리: `export default { title, component, tags: ["autodocs"] }` 규칙 준수
   - Title: `Atoms|Molecules|Organisms/<ComponentName>`
   - Docs 경로 매핑: `?path=/docs/{layer-lower}-{component-lower-no-symbols}`
3) 테스트(Vitest + Testing Library): 렌더/상호작용/접근성 속성 검증
4) 구현: Tailwind 유틸 우선, a11y(aria/role/focus-visible) 반영
   - Link+Button 조합: `Button asChild + <Link>` 사용(중첩 앵커 금지)
5) Dev 카탈로그 업데이트: `fe-app/app/dev/page.tsx`
   - 섹션 배열에 항목 추가 및 프리뷰 케이스 등록
6) 검증: `npm run test -- --run` / `npm run lint` / `npm run dev`

## 변형(variants) 설계 원칙
- 아톰에서 시각 변형을 통일 제공: `variant`, `size`, `state`, `density` 등 유니온 타입
- 상위 레이어는 조합·배치만 담당(임의 Tailwind 유틸 직접 추가 금지)
- 필요 시 CVA(class-variance-authority) 또는 동등 패턴 사용

## 접근성 체크리스트
- 대비(AA) 충족, `:focus-visible` 유지
- 장식 아이콘 `aria-hidden`, 텍스트 없는 버튼은 `aria-label` 또는 `sr-only`

## 산출물
- 컴포넌트 3종 파일(스토리/테스트/구현) + Dev Preview 추가
- 작업 로그: `tasks/{task-name}.md`에 파일 경로 및 체크리스트 기록

## 금지 사항
- 상위 레이어에서 새로운 스타일 직접 정의, `!important`, 깊은 선택자 오버라이드
- atoms 내부 마크업 구조에 의존한 상위 스타일링
