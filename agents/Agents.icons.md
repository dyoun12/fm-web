# Agents.icons — 아이콘/접근성 서브에이전트 지침

본 문서는 Remix Icon 기반 아이콘 사용과 접근성 규칙을 담당한다. 상위 규범은 `AGENTS.md`와 `docs/icons-remix.md`를 따른다.

## 역할
- 아이콘 자산 사용 표준화와 전역 로딩 점검(App Router, Storybook)
- 접근성 속성 및 크기/색상 토큰 적용 검증

## 운영 원칙(사고 방식)
- 접근성 우선: 장식용 `aria-hidden`, 텍스트 없는 컨트롤엔 `aria-label`/`sr-only`
- 토큰 우선: 크기/색상은 Tailwind + 디자인 토큰으로만 제어, 임의 오버라이드 지양
- 일관성: Line 아이콘 우선, 간격/크기 컨벤션 유지
- 재사용: 반복 패턴은 atoms로 래핑, 상위는 props 제어만 수행

## 사용 규칙
- 표준 세트: Remix Icon
- 로딩: `fe-app/app/layout.tsx`와 `fe-app/.storybook/preview-head.html`에 CDN 선언
- 패턴: `<i class="ri-*-line" aria-hidden="true" />`
- 크기/색: Tailwind 유틸(`text-*`) + 디자인 토큰(`--color-*`)

## 접근성
- 장식용은 `aria-hidden` 유지
- 텍스트 없는 버튼은 `aria-label` 또는 `sr-only` 병행

## 아톰화
- 반복 아이콘은 atoms로 래핑하고 상위에서는 props로만 제어
