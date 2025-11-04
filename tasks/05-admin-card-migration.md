# 관리자 콘솔: 카드 아톰(Card) 적용 마이그레이션

## 배경
- 어드민 화면에서 카드 형태의 컨테이너를 개별 컴포넌트가 직접 Tailwind 유틸로 구현하고 있음.
- 디자인 일관성과 유지보수성 향상을 위해 atoms `Card` 컴포넌트(`fe-app/app/components/atoms/card/card.tsx`)로 통일 필요.
- 범위: 어드민 페이지에서 사용되는 organisms/molecules 중, 카드로 대체 가능한 컨테이너.

## 영향 범위(대상 컴포넌트)
- Organisms
  - `fe-app/app/components/organisms/admin-header/admin-header.tsx:1` — 헤더 컨테이너(rounded-2xl + border + p-3)
  - `fe-app/app/components/organisms/admin-sidebar/admin-sidebar.tsx:1` — 사이드바 컨테이너(rounded-2xl + border + p-6)
  - `fe-app/app/components/organisms/admin-dashboard-overview/admin-dashboard-overview.tsx:1` — 우측 "알림 및 경고" 패널(rounded-2xl + border + p-6)
- Molecules
  - `fe-app/app/components/molecules/filter-bar/filter-bar.tsx:1` — 필터 바 외곽 컨테이너(rounded-2xl + border + p-3)
  - `fe-app/app/components/molecules/data-table/data-table.tsx:1` — 테이블 래퍼 컨테이너(rounded-2xl + border)
  - `fe-app/app/components/molecules/empty-state/empty-state.tsx:1` — 빈 상태 카드(rounded-2xl + border + p-8)

## 마이그레이션 원칙(Atoms 우선)
- 시각적 컨테이너는 `Card`로 통일하고, 개별 컴포넌트는 배치/레이아웃 책임만 갖는다.
- 접근성/시맨틱 태그(header/nav/section)는 유지하되, 내부에 `Card`를 중첩하여 스타일을 위임한다.
- 기존 클래스는 `Card`의 `variant|padding|theme`로 대체하고, 부족한 경우 최소한의 유틸만 추가한다.

## 체크리스트(작업 단위)
- [ ] 공통: `Card` API 확인 및 가이드 반영 — `variant(outline|elevated|ghost|soft)`, `padding(none|sm|md|lg)`, `theme(light|dark)`
- [ ] AdminHeader: 루트 `<header>` 내부에 `<Card padding="sm" className="flex items-center justify-between gap-3">`로 래핑
  - [x] 기존 외곽 클래스(rounded/border/p-3) 제거, `Card`로 위임 — `fe-app/app/components/organisms/admin-header/admin-header.tsx:34`
  - [x] 다크/라이트 토글 시 `theme`를 `Card`에도 전달
  - [ ] 스냅샷/렌더 테스트 업데이트
- [ ] AdminSidebar: `<Card padding="md" className="w-64">`로 래핑, 내부 `<nav>` 유지
  - [x] 기존 외곽 클래스 제거 — `fe-app/app/components/organisms/admin-sidebar/admin-sidebar.tsx:13`
  - [x] 다크/라이트 `theme` 전달, 스토리/테스트 업데이트
- [ ] DashboardOverview(알림 패널): 알림 섹션을 `<Card variant="soft" padding="md" className="border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300">`로 교체
  - [x] 헤딩/목록 마크업 유지 — `fe-app/app/components/organisms/admin-dashboard-overview/admin-dashboard-overview.tsx:92`
  - [x] theme 연동 및 콘트라스트 확인(AA)
- [ ] FilterBar: 루트 컨테이너를 `<Card padding="sm" className="flex flex-wrap items-center gap-2">`로 교체
  - [x] 외곽선/배경 클래스 제거 — `fe-app/app/components/molecules/filter-bar/filter-bar.tsx:12`
  - [ ] 스토리/테스트에서 회귀(regression) 확인
- [ ] DataTable: 최상위 래퍼를 `<Card padding="none" className="relative overflow-x-auto">`로 교체
  - [x] 테이블 경계선 유지(헤더/바디 구분선은 기존 유지) — `fe-app/app/components/molecules/data-table/data-table.tsx:60`
  - [x] 페이지네이션 상단 보더는 내부 `div`에 유지
- [ ] EmptyState: 루트 컨테이너를 `<Card padding="lg" className="grid place-items-center text-center">`로 교체
  - [x] 텍스트/아이콘 색상은 Card theme에 맞춰 최소 조정 — `fe-app/app/components/molecules/empty-state/empty-state.tsx:24`

## 기타 아톰 대체 체크리스트(카드 외)
- [ ] AdminHeader: 구분선 `Divider` 아톰 사용
  - [x] 드롭다운 내부 임시 구분선(`div.my-1.h-px`) → `Divider`로 교체, 다크 모드 대비 보정 — `fe-app/app/components/organisms/admin-header/admin-header.tsx:96`
- [ ] AdminHeader: 메뉴 항목 `Button` 아톰으로 교체
  - [x] 현재 `button` + 유틸 클래스 → `<Button variant="ghost" size="sm" theme={theme}>`로 치환(아이콘은 children로 유지)
  - [x] 접근성 속성(`role="menuitem"`) 유지, 포커스 링 확인
- [ ] AdminSidebar: 네비게이션 항목을 `Button asChild + <Link>`로 마이그레이션
  - [x] 현재 `Link` + 유틸 클래스 → `<Button asChild variant="ghost" color={item.active ? 'primary' : 'neutral'} size="sm"><Link .../></Button>`
  - [x] 중첩 앵커 금지 규칙 준수, 활성/호버 상태를 Button 팔레트로 일원화 — `fe-app/app/components/organisms/admin-sidebar/admin-sidebar.tsx:17`
- [ ] SearchInput: 내부 입력 요소를 `Input` 아톰으로 대체
  - [x] 라벨은 `hideLabel`로 숨기고, 좌측 돋보기는 `prefix`로 전달, 지우기(X)는 `suffix` 버튼 처리
  - [x] 현재 커스텀 `input` 스타일 제거, 포커스/에러 상태는 `Input` 상태 토큰 사용 — `fe-app/app/components/molecules/search-input/search-input.tsx:34`
- [ ] DataTable: 로딩 상태에 `Skeleton` 아톰 적용
  - [x] "불러오는 중..." 단일 셀 → 각 열에 맞춘 스켈레톤 행 렌더(열 폭 상속), 스크린리더용 `aria-live` 유지
  - [x] 빈 상태는 기존 `EmptyState` 사용 유지 — `fe-app/app/components/molecules/data-table/data-table.tsx:134`
- [ ] Pagination: 페이지 이동 버튼을 `Button` 아톰으로 교체
  - [ ] `<button>` → `<Button variant="ghost" size="sm" color="neutral">`로 치환, 비활성 시 `disabled` 처리
  - [ ] 전/후 이동 버튼에 `aria-label` 유지, 포커스 표시 일관화 — `fe-app/app/components/molecules/pagination/pagination.tsx:20`
- [ ] DashboardOverview: 지표(trend) 표시를 `Badge` 아톰으로 통일
  - [ ] up=success, down=warning, flat=default 맵핑, 화살표 아이콘은 `children`로 포함 — `fe-app/app/components/organisms/admin-dashboard-overview/admin-dashboard-overview.tsx:30`

## 검증 항목
- [ ] 시각 회귀: Dev 카탈로그(`/app/dev`) 및 Storybook(카드/필터바/테이블/빈 상태) 스크린 비교
- [ ] 접근성: 역할/aria 유지, 콘트라스트(AA) 충족, 포커스 흐름 변화 없음
- [ ] 유닛 테스트 통과 — `npm run test -- --run`
- [ ] 린트 통과 — `npm run lint`

## 후속 작업(선택)
- [ ] `Card`에 폴리모픽 지원 추가(`asChild` 또는 `as` prop) — 시맨틱 태그를 루트로 사용할 수 있도록 개선
- [ ] `Card` 컬러 톤 토큰화(경고/정보 등 강조 카드) — amber/red/blue 소프트 톤 프리셋

## 참조
- 디자인: `docs/design-guide.md`
- 규칙: `AGENTS.md`의 “컴포넌트 개발·수정 규칙(Atoms 우선 디자인)”
- 아톰: `fe-app/app/components/atoms/card/card.tsx`
