# 아이콘 사용 가이드: Remix Icon

본 프로젝트의 표준 아이콘 세트는 Remix Icon입니다. 앱(Next.js)과 Storybook 모두에서 동일 규칙으로 사용합니다.

## 설치/로딩 방법
- CDN 스타일시트 사용(권장)
  - App Router 전역: `app/layout.tsx`의 `<head>`에 링크 추가됨
  - Storybook: `.storybook/preview-head.html`에 링크 추가됨
  - CDN: `https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css`
- 패키지 설치 대안(선택)
  - `react-icons`의 `ri` 네임스페이스 또는 `remixicon-react` 사용 가능. 패키지 도입 시 트리셰이킹/번들 크기 영향 검토 필수.

## 기본 사용법(클래스 기반)
- 마크업: `<i class="ri-home-line" aria-hidden="true" />`
- 크기 제어: Tailwind 타이포 크기 유틸 사용 `text-sm|base|lg|xl|2xl|...`
- 색상 제어: 텍스트 색상 유틸 사용 `text-zinc-600`, `text-[var(--color-primary)]` 등
- 정렬: 아이콘과 텍스트 수평 정렬 시 `inline-flex items-center gap-1.5`

예시
```tsx
// 단독 아이콘(장식용)
<i className="ri-external-link-line text-sm text-zinc-500" aria-hidden="true" />

// 텍스트와 함께
<span className="inline-flex items-center gap-1.5 text-sm text-zinc-700">
  <i className="ri-time-line" aria-hidden="true" />최근 업데이트
  </span>

// 링크 내 외부 아이콘
<Link href="https://example.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5">
  문서 열기
  <i className="ri-external-link-line text-[0.95em] text-zinc-500" aria-hidden="true" />
</Link>
```

## 접근성 가이드
- 장식용(의미 없는) 아이콘: `aria-hidden="true"` 지정
- 의미 전달 아이콘(텍스트 없음): `aria-label="다운로드"` 또는 `title` 추가, 혹은 `sr-only` 텍스트 병행
- 버튼 내부: 텍스트가 없다면 `aria-label` 필수. 포커스 가시성은 버튼이 담당

## 아톰/조합 규칙
- 반복되는 아이콘 패턴은 atoms로 래핑 고려: 예) `ExternalLinkIcon`, `ChevronIcon`
- 상위(molecules/organisms)에서는 아이콘의 크기/색상은 props로만 제어하고 임의 스타일 오버라이드는 지양
- 색상은 디자인 토큰 기반(`--color-*`)을 우선 사용

## 팀 컨벤션
- 선호 스타일: Line 아이콘 우선(`*-line`), 필요 시 Fill 아이콘 최소 사용
- 간격: 텍스트와 `gap-1.5`(6px) 기본, 밀집 레이아웃은 `gap-1`
- 크기: 본문 옆 아이콘 `text-[0.95em]`, 버튼 내 `text-[1.1em]`

## 참고
- 아이콘 목록: https://remixicon.com
- 네이밍: `ri-{name}-{line|fill}`

