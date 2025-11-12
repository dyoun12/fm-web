## 03. 동적 콘텐츠·게시판(프론트)

### 범위
- 사용자 라우트: 
  - 카테고리 목록 `/category/[slug]`
  - 게시물 상세 `/category/[slug]/[postId]`(라우팅 구성만, 내부 링크 또는 동적 세그먼트)
- 컴포넌트: 게시물 카드(Card), 리스트(List/Pagination), 카테고리 필터(선택), EmptyState
- 데이터: API 클라이언트 + MSW 목를 통한 격리 테스트(네트워크 차단 환경)

### 준비/설계
- [x] PRD/Spec 확인: `docs/prd.md` 7.1/7.2, `docs/spec.md` 3.2/3.3 참조
- [ ] 레이아웃 스케치 및 IA 확정(`docs/spec.md` 라우팅 표 갱신)
- [ ] 에러/빈 상태 UX 정의(로딩, 실패, 빈 목록)

### 라우트/페이지 스캐폴딩(App Router)
- [ ] `fe-app/app/category/[slug]/page.tsx` 생성(SSR/ISR 없이 클라이언트 페칭 전제)
- [ ] `fe-app/app/category/[slug]/[postId]/page.tsx` 생성(상세 템플릿)
- [ ] 메타데이터 정의(title/description/canonical) — slug/post 기준 동적 메타 초안

### UI 컴포넌트(Atoms/Molecules/Organisms 재사용 우선)
- [ ] `PostCard`(썸네일/제목/카테고리/작성일) 컴포넌트 추가
- [ ] `PostList`(그리드/목록 토글 가능) + `Pagination`(간이)
- [ ] `CategoryFilter`(선택) — 초기엔 라우팅 slug만 사용
- [ ] 접근성: 카드 링크 포커스, heading 구조, aria-label/aria-describedby

### 데이터 연동(API 클라이언트 + 목)
- [ ] `fe-app/api/posts.ts` 작성: `listPosts(params)`, `getPost(id)` 타입/함수
- [ ] `fe-app/api/categories.ts` 작성: `listCategories()` 타입/함수
- [ ] MSW 핸들러: 성공/실패/빈 목록 케이스 포함

### 테스트/검증
- [ ] 단위: 목록/상세 렌더 및 상태별 UI 분기 테스트(`fe-app/tests/pages/category-*.test.tsx`)
- [ ] 접근성: heading/landmark/포커스 이동 테스트
- [ ] 커버리지 ≥ 80%, 네트워크 호출은 MSW로 차단
- [ ] `npm run lint` 무경고, `npm run test -- --run` 그린

### 문서/태스크 로그
- [ ] 라우팅/컴포넌트/테스트 경로를 본 문서에 기록하고 `docs/spec.md` 링크 추가

### DoD
- [ ] 카테고리 목록/상세 페이지 라우트 동작
- [ ] 실패/빈/로딩 상태 UI 정의 및 테스트 그린
- [ ] 문서/테스트/Dev Preview 경로 동기화

### 생성/변경 파일(예정)
- pages
  - `fe-app/app/category/[slug]/page.tsx`
  - `fe-app/app/category/[slug]/[postId]/page.tsx`
- components
  - `fe-app/app/components/organisms/post-card/post-card.tsx`
  - `fe-app/app/components/organisms/post-list/post-list.tsx`
  - `fe-app/app/components/molecules/pagination/pagination.tsx`
- api
  - `fe-app/api/posts.ts`
  - `fe-app/api/categories.ts`
- tests
  - `fe-app/tests/pages/category-list.test.tsx`
  - `fe-app/tests/pages/category-detail.test.tsx`

