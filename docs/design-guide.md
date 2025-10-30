# 법인 홈페이지 디자인 가이드 (v0.1)

## 1. 브랜드 아이덴티티
- **톤 앤 매너:** 미니멀, 신뢰감, 최신 기술 이미지 강조
- **컬러 팔레트**
  | 토큰 | 값 | 용도 |
  |------|-----|------|
  | `--color-primary` | `#0B5CF2` | 주요 액션, 하이라이트 |
  | `--color-primary-dark` | `#083F9B` | Hover, Active 상태 |
  | `--color-secondary` | `#00B6A0` | 보조 강조, 배지/상태 표시 |
  | `--color-neutral-900` | `#111827` | 본문 텍스트 |
  | `--color-neutral-600` | `#4B5563` | 서브 텍스트, 라벨 |
  | `--color-neutral-200` | `#E5E7EB` | 구분선, 카드 보더 |
  | `--color-background` | `#FFFFFF` | 기본 배경 |
  | `--color-background-alt` | `#F9FAFB` | 섹션 배경, 카드 배경 |
  | `--color-danger` | `#DC3545` | 오류, 경고 |
  | `--color-success` | `#16A34A` | 성공, 확인 |

- **그라디언트 가이드:** `linear-gradient(135deg, #0B5CF2 0%, #00B6A0 100%)` — 히어로 배경, CTA 배너에 제한적으로 사용

## 2. 타이포그래피
- **기본 폰트:** Pretendard, 시스템 폰트 폴백
- **헤딩 스케일**
  | 토큰 | 예시 태그 | 크기/라인하이트 | 용도 |
  |------|-----------|------------------|------|
  | `--font-display` | `h1` | 48px / 56px | 히어로 제목 |
  | `--font-heading-lg` | `h2` | 36px / 44px | 섹션 메인 타이틀 |
  | `--font-heading-md` | `h3` | 28px / 36px | 카드 그룹 헤더 |
  | `--font-heading-sm` | `h4` | 22px / 30px | 보조 타이틀 |
  | `--font-body-lg` | `p` | 18px / 28px | 본문 강조, 요약 |
  | `--font-body` | `p` | 16px / 26px | 기본 본문 |
  | `--font-caption` | `span` | 14px / 20px | 캡션, 라벨 |

- **폰트 가중치:** Display/Heading Bold(700), Body Regular(400), 강조 Semi-bold(600)

## 3. 레이아웃 & 스페이싱
- **그리드:** 최대 폭 1200px, 12컬럼, 24px 거터
- **섹션 간격:** 데스크톱 상하 96px, 모바일 64px
- **내부 패딩:** 카드 24px, 버튼 12px 24px, 폼 필드 14px 16px
- **반응형 브레이크포인트**
  | 토큰 | 값 | 설명 |
  |------|-----|------|
  | `--bp-mobile` | 0-639px | 단일 컬럼 |
  | `--bp-tablet` | 640-1023px | 2컬럼 |
  | `--bp-desktop` | 1024px 이상 | 3~4컬럼 |

## 4. 컴포넌트 인벤토리

### 4.1 Atoms (우선순위: A=즉시, B=2차, C=후순위)
| 컴포넌트 | 우선순위 | 변형/상태 | 설명 |
|-----------|-----------|-------------|------|
| Button | A | Primary, Secondary, Ghost / Hover, Loading, Disabled | 주요 액션용 기본 버튼 |
| IconButton | B | Square, Circle / Hover | 아이콘 기반 액션 |
| TextLink | A | 기본, 강조 | 본문 내 링크 스타일 |
| Badge | B | 상태별 색상 (정보, 성공, 경고) | 상태 표시 |
| Tag | C | 필터 선택형 | 사용자가 선택 가능한 태그 |
| Input | A | 기본, 오류, 성공 | 텍스트 입력 |
| TextArea | B | 기본, 오류 | 문의 폼 등 멀티라인 입력 |
| Select | B | 기본, 비활성화 | 카테고리 선택 |
| Checkbox | A | 기본, 선택, 비활성화 | 동의 항목 |
| Radio | B | 기본, 선택, 비활성화 | 단일 선택 |
| Toggle | C | On/Off | 설정 제어 |
| Tooltip | C | 상/하/좌/우 | 헬프 텍스트 |
| Divider | B | 기본, 라벨 포함 | 섹션 구분 |
| Skeleton | B | 텍스트, 카드 | 로딩 상태 |
| Spinner | A | 기본 | 로딩 인디케이터 |

### 4.2 Molecules
| 컴포넌트 | 우선순위 | 구성 요소 | 설명 |
|-----------|-----------|-------------|------|
| HeroBanner | A | 헤딩, 서브 텍스트, CTA 버튼, 배경 | 메인 히어로 섹션용 |
| StatCard | A | 아이콘, 숫자, 라벨 | 핵심 수치 강조 |
| FeatureCard | A | 이미지/아이콘, 타이틀, 본문, 링크 | 사업 소개 |
| NewsTicker | B | 게시물 리스트, 자동 슬라이드 | 최신 소식 |
| ContactForm | A | Input, TextArea, Checkbox, Button | 문의 섹션 |
| CTASection | B | 헤딩, 설명, 버튼 | 폼/CTA 영역 |
| TimelineItem | B | 연도, 제목, 본문 | 연혁 표시 |
| TeamMemberCard | B | 아바타, 이름, 직함, 소셜 링크 | 팀 소개 |
| FooterLinks | A | 네비게이션 링크 그룹 | 풋터 내비게이션 |

### 4.3 Organisms
| 컴포넌트 | 우선순위 | 설명 |
|-----------|-----------|------|
| GlobalHeader | A | 상단 네비게이션, 로고, CTA |
| GlobalFooter | A | 회사 정보, 링크, 소셜, 저작권 |
| AboutOverview | A | 기업 소개 섹션 묶음 |
| VisionValues | A | 비전/미션/가치 탭 또는 카드 |
| ContactSection | A | 지도, 정보, 문의 폼 통합 영역 |
| NoticeList | A | 공지 리스트(프리뷰 카드) |
| PostDetail | B | 게시물 상세 뷰 |
| CategoryFilterPanel | B | 필터링, 검색 |
| AdminSidebar | A | 관리자 네비게이션 |
| AdminDashboardOverview | B | 통계 카드, 최근 활동 |

### 4.4 컴포넌트 속성 · 변형 · 상태 명세

#### Button (Atom)
- **주요 Props**: `variant("primary" | "secondary" | "ghost")`, `size("sm" | "md" | "lg")`, `leadingIcon`, `trailingIcon`, `loading`, `disabled`, `type`.
- **상태**: 기본(Default), Hover, Active, Focus, Disabled, Loading(스피너 + 텍스트 반투명).
- **사용 가이드**: Width는 기본 auto, 필요 시 `fullWidth` 플래그 사용. 아이콘만 사용하는 경우 `aria-label` 필수.

#### TextLink (Atom)
- **Props**: `href`, `target`, `variant("default" | "emphasis")`, `underline(boolean)`.
- **상태**: 기본, Hover(색상 진하게), Focus(점선 또는 바깥 여백), Visited(색상 변화 금지).
- **참고**: 외부 링크는 `aria-label`에 목적을 명시하고 `rel="noopener noreferrer"`를 기본 적용.

#### Input (Atom)
- **Props**: `label`, `name`, `type`, `helperText`, `errorMessage`, `state("default" | "error" | "success")`, `required`, `disabled`, `prefix`, `suffix`.
- **상태**: Default, Focus(보더 하이라이트), Error(보더/텍스트 Red), Success(보더/아이콘 Green), Disabled(배경 중성 + 커서 not-allowed).
- **검증**: label과 input은 `id`/`htmlFor`로 연결, 오류 문구는 `aria-describedby`로 참조한다.

#### Checkbox (Atom)
- **Props**: `label`, `description`, `checked`, `defaultChecked`, `onChange`, `disabled`, `required`, `indeterminate`.
- **상태**: Checked, Unchecked, Indeterminate, Disabled, Focus.
- **접근성**: 그룹 형태일 때는 `fieldset` + `legend`를 사용하고, 보조 설명은 `aria-describedby`로 연결한다.

#### Spinner (Atom)
- **Props**: `size("xs" | "sm" | "md" | "lg")`, `color("primary" | "neutral")`, `aria-label`.
- **상태**: Inline 사용(텍스트 대비), Overlay 사용(배경 dimmed) 두 가지 패턴을 명세. 애니메이션은 CSS `spin` 유틸리티 사용.

#### HeroBanner (Molecule)
- **Props**: `title`, `subtitle`, `primaryAction`, `secondaryAction`, `backgroundType("solid" | "gradient" | "image")`, `alignment("left" | "center")`.
- **변형**: CTA 1개(기본), CTA 2개(Primary + Secondary), 이미지 배경 사용 시 contrast overlay 적용.
- **상태**: 데스크톱 2컬럼(텍스트 + 미디어), 모바일 stack. 텍스트 길이 제한(최대 3줄).

#### FeatureCard (Molecule)
- **Props**: `icon`, `title`, `description`, `link`, `variant("default" | "emphasis")`.
- **상태**: Hover 시 그림자 확장, Focus 시 아웃라인. Disabled 없음.
- **참고**: 3~4개 그리드 사용 시 자동 균등 배치, 모바일에서는 카드 폭 100%.

#### StatCard (Molecule)
- **Props**: `label`, `value`, `unit`, `trend({direction, value})`, `icon`, `variant("default" | "compact")`.
- **상태**: Positive 트렌드(초록), Negative(빨강), Neutral(회색). 단위/값 대비를 유지한다.

#### ContactForm (Molecule)
- **Props**: `fields(FieldConfig[])`, `submitLabel`, `successMessage`, `errorMessage`, `onSubmit`.
- **상태**: Idle, Submitting(버튼 로딩 + 필드 비활성화), Success(배경 강조 + 메시지), Error(상단 경고 배너).
- **검증**: 필수 필드 표시(`*`), 폼 에러 요약 영역 제공, API 제출 실패 시 재시도 버튼 노출.

#### GlobalHeader (Organism)
- **Props**: `logo`, `navigation(MenuItem[])`, `cta`, `isSticky`, `onToggleMenu`.
- **변형**: 기본(투명 배경), 스크롤 후 Compact(배경 solid + 높이 축소), 모바일 Drawer.
- **상태**: Active 메뉴 하이라이트, 모바일 메뉴 열림 상태를 `aria-expanded`로 표시.

#### GlobalFooter (Organism)
- **Props**: `companyInfo`, `navigationSections`, `legalLinks`, `socialLinks`, `newsletter`.
- **변형**: 기본(4컬럼), 간소화(모바일 1컬럼), 다크 배경 버전.
- **상태**: 링크 Hover, 포커스 아웃라인 명확하게 유지. 뉴스레터 제출 성공 시 메시지 노출.

#### NoticeList (Organism)
- **Props**: `items(PostSummary[])`, `variant("grid" | "list")`, `ctaLabel`, `onLoadMore`, `isLoading`.
- **상태**: 로딩(스켈레톤), 빈 상태(Placeholder copy + CTA), 오류 상태(재시도 버튼).
- **정렬**: 최신순이 기본, 옵션으로 카테고리 필터・검색 입력을 상단에 둘 수 있다.

## 5. 컴포넌트 명세 문서화
- 각 컴포넌트는 `fe-app/app/components/{layer}/{component-name}.tsx`에 위치한다.
- 스토리와 테스트 파일은 동일 디렉터리에 `{component-name}.stories.tsx`, `{component-name}.test.tsx`로 생성한다.
- Props 명세는 TypeScript 인터페이스 + JSDoc(영문 허용)으로 기술한다.
- 접근성 체크리스트(역할, 레이블, 키보드 포커스)를 story 내 Docs 탭에 포함한다.

## 6. 컴포넌트 개발 우선순위 로드맵
- **스프린트 1:** Button, Input, Checkbox, Spinner, HeroBanner, GlobalHeader, GlobalFooter, FeatureCard, ContactForm, AboutOverview
- **스프린트 2:** StatCard, NewsTicker, TimelineItem, TeamMemberCard, NoticeList, VisionValues, ContactSection
- **스프린트 3:** PostDetail, CategoryFilterPanel, AdminSidebar, AdminDashboardOverview, Tooltip, Skeleton

## 7. Dev Preview 페이지 구성 가이드
- `fe-app/app/dev/page.tsx`는 Atom → Molecule → Organism 순으로 섹션을 구성한다.
- 각 섹션 상단에 안내 텍스트와 링크(컴포넌트 소스, 스토리 경로)를 제공한다.
- Props 변형을 확인할 수 있도록 `useState` 기반 Playground를 제공한다.
- 접근성 확인을 위해 키보드 포커스 이동, 다크 모드(선택), 고대비 옵션 토글을 포함한다.

## 8. 검토 및 변경 관리
- 디자이너 및 PO 검토 피드백은 `tasks/feedback/design-system.md`에 기록한다.
- 변경 사항 발생 시 `docs/design-guide.md` 버전을 갱신하고, `AGENTS.md` 운영 원칙과 일치하는지 확인한다.
- 최종 확정 후 컴포넌트 스펙과 스토리를 업데이트하고, `fe-app/app/dev/page.tsx`의 미리보기 콘텐츠를 동기화한다.

## 9. 변경 이력
| 일시 | 변경자 | 변경 내용 | 비고 |
|------|--------|-----------|------|
| 2025-10-27 | Codex Agent | 초기 디자인 토큰·컴포넌트 인벤토리 정의 | -
| 2025-10-27 | Codex Agent | Button/FeatureCard 등 주요 컴포넌트 속성·상태 명세 추가, Dev Preview 가이드 보강 | 피드백 없음
