# 05. 관리자 콘솔 구현

## 목표/범위
- PRD·Spec의 관리자 영역 요구사항을 충족하는 기본 콘솔(UI 라우팅, 네비게이션, 대시보드, CRUD 섹션 스켈레톤)을 구현한다.
- 인증/보안(SSO + 2FA)은 `04. 인증 및 보안` 태스크와 연동하며, 본 태스크에서는 보호 라우팅 훅/게이트 연동 지점만 정의한다.
- API는 목업 우선 전개(클라이언트 목 API)로 연결하고, 스키마는 `docs/spec.md`와 `docs/spec-api.yaml`에 기록한다.

참조: docs/prd.md:59, docs/spec.md:28, docs/spec.md:74

## 산출물(요약)
- 라우팅: `/admin`, `/admin/posts`, `/admin/categories`, `/admin/users`
- 레이아웃: 사이드바(`AdminSidebar`) + 헤더(간단) + 콘텐츠 영역
- 대시보드: `AdminDashboardOverview` 적용(통계/활동/알림 카드)
- CRUD 섹션 스켈레톤: 게시물/카테고리/사용자 목록 + 생성 버튼 UI 골격
- API 목업: `fe-app/api/admin.ts` (posts/categories/users 기본 목 함수)
- 테스트: 페이지 렌더 스모크 + 접근성 속성 검사, 목 API 단위 테스트
- 문서: 스펙/설계 반영 및 링크

## 전제/의존
- [ ] `04. 인증 및 보안`에서 보호 라우팅(로그인/2FA 완료 토큰 검증, HttpOnly 쿠키) 훅 제공
- [ ] 디자인 시스템(Atoms/Molecules/Organisms) 재사용 우선. 신규 스타일은 Atoms 변형으로만 추가

## 디렉터리/파일 계획(생성 대상)
- [ ] `fe-app/app/admin/layout.tsx` — 관리자 공통 레이아웃(사이드바 포함)
- [ ] `fe-app/app/admin/page.tsx` — 대시보드(개요)
- [ ] `fe-app/app/admin/posts/page.tsx` — 게시물 관리 리스트 스켈레톤
- [ ] `fe-app/app/admin/categories/page.tsx` — 카테고리 관리 리스트 스켈레톤
- [ ] `fe-app/app/admin/users/page.tsx` — 사용자 관리 리스트 스켈레톤
- [ ] `fe-app/api/admin.ts` — 목 API(posts/categories/users)
- [ ] `fe-app/tests/pages/admin/dashboard.test.tsx` — 대시보드 렌더 테스트
- [ ] `fe-app/tests/pages/admin/posts.test.tsx` — 게시물 페이지 렌더 테스트
- [ ] `fe-app/tests/pages/admin/categories.test.tsx` — 카테고리 페이지 렌더 테스트
- [ ] `fe-app/tests/pages/admin/users.test.tsx` — 사용자 페이지 렌더 테스트
- [ ] `docs/spec-api.yaml` — 관리자 API 섹션 추가(엔드포인트/스키마)

## 선행 구현 컴포넌트 리스트(Atoms → Molecules → Organisms)
- 목적: 관리자 콘솔 페이지 스캐폴딩 전에 필수 UI를 확보하여 재사용성을 극대화한다. 신규는 디자인 가이드 변형 규칙을 준수하고 Dev 카탈로그에 먼저 등록한다.

- Atoms(기존 사용 가능)
  - Button `fe-app/app/components/atoms/button/button.tsx`
  - IconButton `fe-app/app/components/atoms/icon-button/icon-button.tsx`
  - Input `fe-app/app/components/atoms/input/input.tsx`
  - Select `fe-app/app/components/atoms/select/select.tsx`
  - TextArea `fe-app/app/components/atoms/text-area/text-area.tsx`
  - Checkbox `fe-app/app/components/atoms/checkbox/checkbox.tsx`
  - Radio `fe-app/app/components/atoms/radio/radio.tsx`
  - Tooltip `fe-app/app/components/atoms/tooltip/tooltip.tsx`
  - Skeleton `fe-app/app/components/atoms/skeleton/skeleton.tsx`
  - Spinner `fe-app/app/components/atoms/spinner/spinner.tsx`
  - Badge `fe-app/app/components/atoms/badge/badge.tsx`
  - Tag `fe-app/app/components/atoms/tag/tag.tsx`
  - Divider `fe-app/app/components/atoms/divider/divider.tsx`
  - Card `fe-app/app/components/atoms/card/card.tsx`

- Atoms(신규 권장)
  - Avatar `fe-app/app/components/atoms/avatar/avatar.tsx` — 관리자 헤더용(이니셜/이미지, sm|md|lg)

- Molecules(신규 — 관리자 리스트/툴바 공통)
  - DataTable `fe-app/app/components/molecules/data-table/data-table.tsx`
    - props: `columns`, `rows`, `loading`, `onSort`, `onSelect`
    - 변형: `density(compact|comfortable)`, `zebra(boolean)`
  - Pagination `fe-app/app/components/molecules/pagination/pagination.tsx`
    - props: `page`, `pageSize`, `total`, `onChange`
    - 변형: `size(sm|md)`
  - SearchInput `fe-app/app/components/molecules/search-input/search-input.tsx`
    - Input + 검색 아이콘 결합, `aria-label` 기본 제공
  - FilterBar `fe-app/app/components/molecules/filter-bar/filter-bar.tsx`
    - Select/Tag 조합, 카테고리/역할 필터 공용
  - ConfirmDialog `fe-app/app/components/molecules/confirm-dialog/confirm-dialog.tsx`
    - 삭제/위험 작업 확인용, 변형: `variant(default|destructive)`
  - Toast `fe-app/app/components/molecules/toast/toast.tsx`
    - 성공/오류 알림, auto dismiss 옵션
  - EmptyState `fe-app/app/components/molecules/empty-state/empty-state.tsx`
    - 아이콘/설명/CTA 버튼 포함 빈 목록 안내

- Organisms(기존/신규)
  - (기존) AdminSidebar `fe-app/app/components/organisms/admin-sidebar/admin-sidebar.tsx`
  - (기존) AdminDashboardOverview `fe-app/app/components/organisms/admin-dashboard-overview/admin-dashboard-overview.tsx`
  - (신규) AdminHeader `fe-app/app/components/organisms/admin-header/admin-header.tsx`
    - 좌측 제목/우측 검색 또는 아바타/테마 토글 자리표시자

메모
- 신규 컴포넌트는 반드시 스토리/테스트를 먼저 작성하고 Dev 카탈로그(`fe-app/app/dev/page.tsx`)에 등록한다.
- Organisms에는 임의 Tailwind 유틸을 추가하지 말고 Atoms 변형으로 해결한다.

## 선행 작업 진행사항(완료 체크)
- [x] Avatar(Atom) 스캐폴딩 + 스토리/테스트
- [x] Molecules 스캐폴딩 + 스토리/테스트: DataTable, Pagination, SearchInput, FilterBar, ConfirmDialog, Toast, EmptyState
- [x] AdminHeader(Organism) 스캐폴딩 + 스토리/테스트
- [x] Dev 카탈로그 등록 및 프리뷰 추가(Atoms/Molecules/Organisms 섹션)
- [x] ConfirmDialog 프리뷰/스토리 버튼 트리거 적용(기본 자동 출력 방지)

## 세부 태스크(체크리스트)

### 1) 라우팅/레이아웃 스캐폴딩
- [ ] App Router 경로 생성: `/admin`, `/admin/posts`, `/admin/categories`, `/admin/users`
- [ ] `fe-app/app/admin/layout.tsx`에서 사이드바 배치(Organisms `AdminSidebar` 사용)
- [ ] 레이아웃 내 헤더(간단한 페이지 타이틀/아바타 자리표시자) 구성
- [ ] 보호 라우팅 훅 연동 지점 작성(의존 태스크 완료 시 `requireAuth()` 같은 훅 연결)

### 2) 대시보드(개요)
- [ ] `AdminDashboardOverview` 조합하여 통계/최근 활동/알림 섹션 렌더
- [ ] 통계 카드/활동/알림 데이터는 목 데이터로 주입(파일 상단 주석에 샘플 스키마 명시)
- [ ] 반응형 레이아웃(그리드) 및 a11y 속성(label/aria-live 등) 확인

### 3) 게시물 관리 스켈레톤
- [ ] 테이블/리스트 레이아웃(Atoms Card/Table 대체 조합 가능 시 사용) 스켈레톤 구성
- [ ] 상단 툴바: 검색, 필터(카테고리), `새 게시물` 버튼
- [ ] 행 액션: 보기/수정/삭제 버튼 자리표시자(아이콘은 Remix 아이콘 규칙 적용)
- [ ] 페이지ने이션 UI 자리표시자(후속 API 연동 시 활성)

### 4) 카테고리 관리 스켈레톤
- [ ] 카테고리 리스트 + 생성/수정/삭제 버튼 자리표시자
- [ ] 정렬(order) 필드 노출, slug 표시
- [ ] 사용처 주석: 프론트 라우팅 `/category/[slug]` 연계 메모

### 5) 사용자 관리 스켈레톤
- [ ] 사용자 목록(이메일/역할/상태) + 초대/권한변경/비활성화 버튼 자리표시자
- [ ] 역할(RBAC): admin/editor/viewer 탭/필터 UI
- [ ] 감사 로그 링크 자리표시자(후속 구현 참조)

### 6) API 목업 및 스키마 문서화
- [ ] `fe-app/api/admin.ts`에 posts/categories/users용 목 데이터/비동기 함수 구현
- [ ] 요청/응답 인터페이스를 파일 상단 주석에 정리하고 `docs/spec-api.yaml`에 동기화
- [ ] 업로드는 presigned URL 정책 메모만 추가(실제 업로드는 백엔드 태스크 참조)

### 7) Dev Preview 연동
- [x] `fe-app/app/dev/page.tsx`에 Organisms 프리뷰 검토(이미 존재: AdminSidebar, AdminDashboardOverview) 및 AdminHeader 추가
- [x] 대시보드 상태 예시(통계/활동/알림) 샘플을 Dev 카탈로그에 유지(이름/Docs 링크 확인)
- [x] Docs 버튼 규칙(title → `/docs/organisms-...`) 준수 확인

### 8) 테스트(단위/접근성)
- [ ] 각 페이지 렌더 스모크 테스트(Vitest + Testing Library)
- [ ] 주요 상호작용 버튼 접근성 속성(`aria-label`, `role`, `tabindex`) 검사
- [ ] MSW 기반 목 API로 네트워크 호출 차단
- [ ] 선택: Playwright E2E 스모크(`/admin` 보호 리다이렉트 확인) — `fe-app/tests/e2e/admin/`

### 9) 문서화/로그
- [ ] `docs/spec.md`의 관리자 IA/흐름 최신화(라우트/컴포넌트 매핑)
- [ ] `docs/spec-api.yaml`에 엔드포인트/스키마 추가: posts/categories/users
- [ ] 본 태스크 파일(`tasks/05-admin-console.md`)에 생성 파일 경로 및 스크린샷 링크(가능 시) 기록

## 구현 가이드(요약)
- Atomic Design 원칙 준수: 스타일 변경은 Atoms 변형으로만. Organisms에는 임의 유틸 클래스 추가 금지
- 상태 관리: 전역 상태는 `fe-app/store`를 사용하고 하위 레이어에는 props로 주입
- 아이콘: Remix Icon(CDN), 장식용은 `aria-hidden`, 텍스트 없는 버튼은 `aria-label`
- Link+Button: `Button asChild + <Link>` 패턴 유지

## 완료 기준(DoD)
- [ ] 라우트 4종(`/admin`, `/admin/posts`, `/admin/categories`, `/admin/users`) 렌더/내비게이션 동작
- [ ] 대시보드/리스트 스켈레톤 UI 렌더 시 콘솔 경고 없음
- [ ] Lint/Type 체크 통과(`npm run lint`)
- [ ] 단위 테스트 통과(`npm run test -- --run`), 네트워크 호출은 MSW로 모킹
- [ ] 접근성 기본 속성 충족(포커스 표시, aria 속성)
- [ ] `docs/` 문서 동기화 및 본 태스크 체크리스트 업데이트 완료

## 생성/변경 예정 파일 경로 기록
- pages/layout
  - `fe-app/app/admin/layout.tsx`
  - `fe-app/app/admin/page.tsx`
  - `fe-app/app/admin/posts/page.tsx`
  - `fe-app/app/admin/categories/page.tsx`
  - `fe-app/app/admin/users/page.tsx`
- api(mock)
  - `fe-app/api/admin.ts`
- tests
  - `fe-app/tests/pages/admin/dashboard.test.tsx`
  - `fe-app/tests/pages/admin/posts.test.tsx`
  - `fe-app/tests/pages/admin/categories.test.tsx`
  - `fe-app/tests/pages/admin/users.test.tsx`
  - `fe-app/tests/e2e/admin/` (선택)
- docs
  - `docs/spec.md` (관리자 IA/흐름 업데이트)
  - `docs/spec-api.yaml` (엔드포인트/스키마 추가)

Refs: docs/prd.md, docs/spec.md, docs/design-guide.md, AGENTS.md
