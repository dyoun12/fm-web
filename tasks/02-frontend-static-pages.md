
## 02. 정적 페이지 구축 — 세부 태스크

### 범위
- 정적 라우트: `/`, `/about`, `/vision`, `/contact` (App Router 기반)
- 공통 레이아웃(`fe-app/app/layout.tsx`)과 네비게이션/푸터 재사용(organisms) 전제
- SEO/접근성 기본 준수, 빌드 시 정적 포함(SSR/ISR 불필요)

### 준비/설계
- [x] PRD/Spec/Design 교차 확인: `docs/prd.md`, `docs/spec.md`, `docs/design-guide.md`
- [x] 정적 페이지 정보구조(IA) 확정 및 섹션 구성 표 작성 — `docs/spec.md` 4절 추가
- [x] 메타데이터 정책 합의: title/description/OG/canonical, JSON-LD(Organization, WebSite)

### 라우트 스캐폴딩(App Router)
- [x] 홈: `fe-app/app/page.tsx` — 섹션 컨테이너만 배치(콘텐츠 목업)
- [x] 회사 소개: `fe-app/app/about/page.tsx`
- [x] 비전/이념: `fe-app/app/vision/page.tsx`
- [x] 연락처: `fe-app/app/contact/page.tsx`
- [x] 각 페이지에 `metadata` 정적 객체 정의(OG/Cano 포함)
- [x] 정적 빌드 보장 메모: 외부 데이터 호출 금지(빌드 타임 정적)

### 레이아웃/네비게이션
- [x] 공통 헤더/푸터 연결 확인: `fe-app/app/layout.tsx` / `fe-app/app/site-header.tsx`
- [x] 현재 활성 메뉴 표시 및 Skip Link 제공(접근성)
- [x] 푸터에 회사 기본 정보(사업자/주소/문의) 목업 반영

### 섹션 구현(Organisms 중심, atoms 변형 우선)
- [x] 홈(`/`): Hero(슬로건), Feature Grid(주요 사업), Latest News Summary(링크), CTA 섹션
- [x] 소개(`/about`): Company Overview, 연혁(Timeline), Team Grid(사진/역할), Location(지도 자리표시자)
- [x] 비전(`/vision`): Mission/Vision/Values, 이미지 또는 일러스트 자리표시자
- [x] 연락처(`/contact`): 연락처 카드(전화/이메일/주소) + Contact Form(UI만, 전송 모킹)
- [x] 기존 atoms/molecules 우선 재사용, 필요한 경우 organisms 레벨 조합으로 구성
- [x] 스타일은 atoms의 variant/size/state로 제어(상위 레이어 임의 유틸 추가 금지)

### 접근성·국제화
- [x] 페이지별 H1 단일성, landmark(role="main", header, footer, nav) 적용
- [x] 키보드 포커스 흐름 및 `:focus-visible` 확인, aria-label/aria-describedby 점검
- [x] 이미지 대체텍스트/장식 아이콘 `aria-hidden` 처리(Remix Icon 가이드 준수)

### SEO
- [x] 메타 태그: title/description/og:title/og:description/og:image/twitter 카드
- [x] canonical 링크 및 언어 속성(html lang)
- [x] JSON-LD(Organization, WebSite) 스키마 추가 및 검증 메모

### 테스트/검증
- [x] 렌더 스모크 테스트(SSR 없음): `fe-app/tests/pages/*.test.tsx`
- [x] 접근성 속성 단위 검증(heading/landmark 존재 여부, aria-label 노출)
- [ ] `npm run lint` 통과, `npm run test -- --run` 통과, `npm run build` 성공

### 문서/태스크 로그
- [x] 라우팅/섹션 정의를 `docs/spec.md`에 반영 및 링크 추가
- [x] 생성 파일 경로와 스크린샷을 `tasks/02-frontend-static-pages.md`에 기록
- [x] Dev Preview 참고 사항(컴포넌트 카탈로그 경로) 메모: `fe-app/app/dev/page.tsx`

### 완료 기준(DoD)
- [ ] 각 정적 페이지 빌드 포함 및 콘솔 경고 없음
- [ ] Lighthouse 접근성 ≥ 90(수동/간이 측정 허용), 메타/OG/JSON-LD 노출 확인
- [x] 디자인 가이드와 원칙(Atoms 우선) 위반 없음, 문서 동기화 완료

### 생성/변경 파일 경로
- pages
  - `fe-app/app/page.tsx`
  - `fe-app/app/about/page.tsx`
  - `fe-app/app/vision/page.tsx`
  - `fe-app/app/contact/page.tsx`
- layout/header/footer
  - `fe-app/app/layout.tsx`
  - `fe-app/app/site-header.tsx`
- tests
  - `fe-app/tests/pages/home.test.tsx`
  - `fe-app/tests/pages/about.test.tsx`
  - `fe-app/tests/pages/vision.test.tsx`
  - `fe-app/tests/pages/contact.test.tsx`
- docs
  - `docs/spec.md` (정적 페이지 IA 추가)
