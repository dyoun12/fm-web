# Add Components Stories

목표: 구현된 UI 컴포넌트와 스토리북의 연동 상태를 점검하고, 누락된 스토리 파일을 작성하여 Dev Preview와 병행 검증 가능하도록 한다.

## Checklist
- [x] 컴포넌트/스토리 파일 전체 목록 스캔 (atoms/molecules/organisms)
- [x] 기존 스토리들의 import 경로와 props 시그니처 검증 (테스트 통과로 확인)
- [x] Dev Preview(`fe-app/app/dev/page.tsx`) 사용 예와 스토리 데이터 일치성 확인 (Docs 링크 포함)
- [x] 누락된 스토리 파일 추가 생성 (Autodocs, 기본 args 포함)
- [x] 스토리 기준으로 컴포넌트 public API 주석/타입 정비 (Button asChild, TextLink 타입 추가)
- [x] 스토리 실행 가이드 문서화 (`README` 또는 본 파일에 로그 추가)

## 대상 컴포넌트 범위
- atoms: Button, Input, Checkbox, Spinner, IconButton, Badge, Tooltip, Select, TextArea, Radio, Divider, Skeleton, Tag, Toggle
- molecules: FeatureCard, HeroBanner, ContactForm, NewsTicker, CtaSection, TimelineItem, TeamMemberCard, StatCard, FooterLinks
- organisms: GlobalHeader, GlobalFooter, NoticeList, PostDetail, CategoryFilterPanel, AdminDashboardOverview, AboutOverview, VisionValues, ContactSection, AdminSidebar

## 산출물 링크
- 생성된 스토리 파일
  - `fe-app/app/components/organisms/about-overview/about-overview.stories.tsx`
  - `fe-app/app/components/organisms/admin-sidebar/admin-sidebar.stories.tsx`
  - `fe-app/app/components/organisms/contact-section/contact-section.stories.tsx`
  - `fe-app/app/components/organisms/vision-values/vision-values.stories.tsx`
  - `fe-app/app/components/atoms/text-link/text-link.stories.tsx`
- 구현 연동/리팩토링
  - `fe-app/app/components/molecules/hero-banner/hero-banner.tsx`: CTA 버튼 asChild 패턴 및 대비 색상 보정
  - `fe-app/app/components/molecules/cta-section/cta-section.tsx`: CTA 버튼 asChild 적용
  - `fe-app/app/components/organisms/global-header/global-header.tsx`: CTA 버튼 asChild 적용
  - `fe-app/app/components/molecules/footer-links/footer-links.tsx`: 리스트 key 중복 경고 제거
  - `fe-app/app/components/atoms/button/button.tsx`: asChild 구현 보완(중첩 a 제거)
  - `.storybook/vitest.setup.ts`: next/link 모킹 추가로 테스트 런타임 안정화

## 실행 가이드 (Storybook/Dev Preview)
- 동시 실행: `cd fe-app && npm run dev`
  - Next Dev: `http://localhost:3000/dev`
  - Storybook: `http://localhost:6006`
- Dev 카탈로그 “Docs” 버튼 → 스토리북 문서 연결 규칙
  - `title: "<Layer>/<ComponentName>"`를 기준으로 `/docs/{layer-lower}-{component-lower-no-symbols}`
  - 예) `Organisms/GlobalHeader` → `/docs/organisms-globalheader`
  - 예) `Molecules/TimelineItem` → `/docs/molecules-timelineitem`
- 테스트: `npm run test -- --run` (모든 스토리/단위 테스트 통과 확인)

## 검증 메모
- `npm run dev`로 Dev Preview 확인
- `npm run test -- --run`으로 단위 테스트 회귀 확인
- `npm run lint`로 정적 검사 통과 확인
