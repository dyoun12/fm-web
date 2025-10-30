# 01. UI 컴포넌트 설계

## 세부 태스크: 디자인 시스템 컴포넌트 정립 및 검토
- [x] `docs/design-guide.md` 초안 기준으로 필수 UI 컴포넌트(Atoms, Molecules, Organisms)를 식별하고 생성 우선순위를 지정한다.
- [x] 컴포넌트별 속성, 변형(variant), 상태(state)를 정의한 명세서를 작성한다. *(참조: `docs/design-guide.md` 4.4절)*
- [x] `fe-app/app/dev/page.tsx`에 컴포넌트 카탈로그 레이아웃을 설계해 각 컴포넌트를 한눈에 비교할 수 있도록 구성한다.
- [x] 컴포넌트 데모 섹션에 상호작용 설명과 사용 가이드를 추가하여 Stakeholder 검토 세션을 진행한다. *(참조: `fe-app/app/dev/page.tsx` 상호작용 가이드 섹션)*
- [x] 사용자 검토 피드백을 문서화하고, 반영이 필요한 변경 사항을 체크리스트로 정리해 후속 작업에 반영한다. *(피드백 로그: `tasks/feedback/design-system.md`)*
- [x] 피드백을 적용한 후 `docs/design-guide.md`와 `fe-app/app/dev/page.tsx`를 업데이트하고 변경 이력을 기록한다. *(2025-10-27 변경 이력 표에 반영, 현재 추가 피드백 없음)*

## 컴포넌트 구조 매핑
| 레이어 | 컴포넌트 | 구현 경로 | 스토리 | 테스트 |
|--------|-----------|-----------|--------|--------|
| Atom | Badge | `fe-app/app/components/atoms/badge/badge.tsx` | `fe-app/app/components/atoms/badge/badge.stories.tsx` | `fe-app/app/components/atoms/badge/badge.test.tsx` |
| Atom | Button | `fe-app/app/components/atoms/button/button.tsx` | `fe-app/app/components/atoms/button/button.stories.tsx` | `fe-app/app/components/atoms/button/button.test.tsx` |
| Atom | Checkbox | `fe-app/app/components/atoms/checkbox/checkbox.tsx` | `fe-app/app/components/atoms/checkbox/checkbox.stories.tsx` | `fe-app/app/components/atoms/checkbox/checkbox.test.tsx` |
| Atom | Divider | `fe-app/app/components/atoms/divider/divider.tsx` | `fe-app/app/components/atoms/divider/divider.stories.tsx` | `fe-app/app/components/atoms/divider/divider.test.tsx` |
| Atom | IconButton | `fe-app/app/components/atoms/icon-button/icon-button.tsx` | `fe-app/app/components/atoms/icon-button/icon-button.stories.tsx` | `fe-app/app/components/atoms/icon-button/icon-button.test.tsx` |
| Atom | Input | `fe-app/app/components/atoms/input/input.tsx` | `fe-app/app/components/atoms/input/input.stories.tsx` | `fe-app/app/components/atoms/input/input.test.tsx` |
| Atom | Radio | `fe-app/app/components/atoms/radio/radio.tsx` | `fe-app/app/components/atoms/radio/radio.stories.tsx` | `fe-app/app/components/atoms/radio/radio.test.tsx` |
| Atom | Select | `fe-app/app/components/atoms/select/select.tsx` | `fe-app/app/components/atoms/select/select.stories.tsx` | `fe-app/app/components/atoms/select/select.test.tsx` |
| Atom | Skeleton | `fe-app/app/components/atoms/skeleton/skeleton.tsx` | `fe-app/app/components/atoms/skeleton/skeleton.stories.tsx` | `fe-app/app/components/atoms/skeleton/skeleton.test.tsx` |
| Atom | Spinner | `fe-app/app/components/atoms/spinner/spinner.tsx` | `fe-app/app/components/atoms/spinner/spinner.stories.tsx` | `fe-app/app/components/atoms/spinner/spinner.test.tsx` |
| Atom | Tag | `fe-app/app/components/atoms/tag/tag.tsx` | `fe-app/app/components/atoms/tag/tag.stories.tsx` | `fe-app/app/components/atoms/tag/tag.test.tsx` |
| Atom | TextArea | `fe-app/app/components/atoms/text-area/text-area.tsx` | `fe-app/app/components/atoms/text-area/text-area.stories.tsx` | `fe-app/app/components/atoms/text-area/text-area.test.tsx` |
| Atom | Toggle | `fe-app/app/components/atoms/toggle/toggle.tsx` | `fe-app/app/components/atoms/toggle/toggle.stories.tsx` | `fe-app/app/components/atoms/toggle/toggle.test.tsx` |
| Atom | Tooltip | `fe-app/app/components/atoms/tooltip/tooltip.tsx` | `fe-app/app/components/atoms/tooltip/tooltip.stories.tsx` | `fe-app/app/components/atoms/tooltip/tooltip.test.tsx` |
| Molecule | FeatureCard | `fe-app/app/components/molecules/feature-card/feature-card.tsx` | `fe-app/app/components/molecules/feature-card/feature-card.stories.tsx` | `fe-app/app/components/molecules/feature-card/feature-card.test.tsx` |
| Molecule | ContactForm | `fe-app/app/components/molecules/contact-form/contact-form.tsx` | `fe-app/app/components/molecules/contact-form/contact-form.stories.tsx` | `fe-app/app/components/molecules/contact-form/contact-form.test.tsx` |
| Molecule | CtaSection | `fe-app/app/components/molecules/cta-section/cta-section.tsx` | `fe-app/app/components/molecules/cta-section/cta-section.stories.tsx` | `fe-app/app/components/molecules/cta-section/cta-section.test.tsx` |
| Molecule | HeroBanner | `fe-app/app/components/molecules/hero-banner/hero-banner.tsx` | `fe-app/app/components/molecules/hero-banner/hero-banner.stories.tsx` | `fe-app/app/components/molecules/hero-banner/hero-banner.test.tsx` |
| Molecule | NewsTicker | `fe-app/app/components/molecules/news-ticker/news-ticker.tsx` | `fe-app/app/components/molecules/news-ticker/news-ticker.stories.tsx` | `fe-app/app/components/molecules/news-ticker/news-ticker.test.tsx` |
| Molecule | TeamMemberCard | `fe-app/app/components/molecules/team-member-card/team-member-card.tsx` | `fe-app/app/components/molecules/team-member-card/team-member-card.stories.tsx` | `fe-app/app/components/molecules/team-member-card/team-member-card.test.tsx` |
| Molecule | TimelineItem | `fe-app/app/components/molecules/timeline-item/timeline-item.tsx` | `fe-app/app/components/molecules/timeline-item/timeline-item.stories.tsx` | `fe-app/app/components/molecules/timeline-item/timeline-item.test.tsx` |
| Organism | GlobalHeader | `fe-app/app/components/organisms/global-header/global-header.tsx` | `fe-app/app/components/organisms/global-header/global-header.stories.tsx` | `fe-app/app/components/organisms/global-header/global-header.test.tsx` |
| Organism | GlobalFooter | `fe-app/app/components/organisms/global-footer/global-footer.tsx` | `fe-app/app/components/organisms/global-footer/global-footer.stories.tsx` | `fe-app/app/components/organisms/global-footer/global-footer.test.tsx` |
| Organism | NoticeList | `fe-app/app/components/organisms/notice-list/notice-list.tsx` | `fe-app/app/components/organisms/notice-list/notice-list.stories.tsx` | `fe-app/app/components/organisms/notice-list/notice-list.test.tsx` |
| Organism | CategoryFilterPanel | `fe-app/app/components/organisms/category-filter-panel/category-filter-panel.tsx` | `fe-app/app/components/organisms/category-filter-panel/category-filter-panel.stories.tsx` | `fe-app/app/components/organisms/category-filter-panel/category-filter-panel.test.tsx` |
| Organism | PostDetail | `fe-app/app/components/organisms/post-detail/post-detail.tsx` | `fe-app/app/components/organisms/post-detail/post-detail.stories.tsx` | `fe-app/app/components/organisms/post-detail/post-detail.test.tsx` |
| Organism | AdminDashboardOverview | `fe-app/app/components/organisms/admin-dashboard-overview/admin-dashboard-overview.tsx` | `fe-app/app/components/organisms/admin-dashboard-overview/admin-dashboard-overview.stories.tsx` | `fe-app/app/components/organisms/admin-dashboard-overview/admin-dashboard-overview.test.tsx` |

- 스토리 파일은 `*.stories.tsx`, 테스트 파일은 `*.test.tsx` 네이밍을 사용한다.
- 공통 스타일/토큰은 `fe-app/app/globals.css` 또는 추후 `fe-app/lib/theme.ts`로 분리한다.
- 추가 컴포넌트는 설계 워크숍에서 합의 후 본 매핑 테이블에 업데이트한다.

## 01-1. 컴포넌트 구현 및 프리뷰 동기화 준비
- [x] Atoms/ Molecules/ Organisms 우선순위 A 대상 컴포넌트 파일을 `fe-app/app/components` 하위에 생성한다.
- [x] 각 컴포넌트에 대한 스토리북 스토리 초안을 `*.stories.tsx`로 추가한다.
- [x] Vitest 기반 테스트 스켈레톤을 `*.test.tsx` 형식으로 생성하고 기본 렌더링 검증을 작성한다.
- [x] Dev Preview(`fe-app/app/dev/page.tsx`)와 Storybook 간 props, variant 목록이 일치하는지 확인한다.
- [x] 생성된 컴포넌트/스토리/테스트 경로를 `tasks/01-UI-components.md`의 매핑 테이블에 반영한다.

## 01-2. 컴포넌트 구현 및 프리뷰 동기화 준비
- [x] Atoms/ Molecules/ Organisms 우선순위 B 대상 컴포넌트 파일을 `fe-app/app/components` 하위에 생성한다.
- [x] 각 컴포넌트에 대한 스토리북 스토리 초안을 `*.stories.tsx`로 추가한다.
- [x] Vitest 기반 테스트 스켈레톤을 `*.test.tsx` 형식으로 생성하고 기본 렌더링 검증을 작성한다.
- [x] Dev Preview(`fe-app/app/dev/page.tsx`)와 Storybook 간 props, variant 목록이 일치하는지 확인한다.
- [x] 생성된 컴포넌트/스토리/테스트 경로를 `tasks/01-UI-components.md`의 매핑 테이블에 반영한다.

## 01-3. 컴포넌트 구현 및 프리뷰 동기화 준비
- [x] Atoms/ Molecules/ Organisms 우선순위 C 대상 컴포넌트 파일을 `fe-app/app/components` 하위에 생성한다.
- [x] 각 컴포넌트에 대한 스토리북 스토리 초안을 `*.stories.tsx`로 추가한다.
- [x] Vitest 기반 테스트 스켈레톤을 `*.test.tsx` 형식으로 생성하고 기본 렌더링 검증을 작성한다.
- [x] Dev Preview(`fe-app/app/dev/page.tsx`)와 Storybook 간 props, variant 목록이 일치하는지 확인한다.
- [x] 생성된 컴포넌트/스토리/테스트 경로를 `tasks/01-UI-components.md`의 매핑 테이블에 반영한다.
