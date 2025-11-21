# 가족법인 홈페이지 상세 스펙 문서 (spec.md)

## 1. 프로젝트 개요
이 문서는 `prd.md`를 기반으로 실제 개발을 위한 **기능별 상세 명세서**를 정의한다.  
Codex를 통해 자동 생성되는 파일/코드 구조와, 수동 구현이 필요한 영역을 구분하여 명시한다.

백엔드 런타임: FastAPI(ASGI)
- 배포 환경은 AWS Lambda이며, API Gateway의 이벤트는 `Mangum` 어댑터를 통해 HTTP 요청으로 변환되어 FastAPI 앱으로 전달된다(앱 코드는 ASGI 순수성 유지).
- 인프라/배포(SAM, API GW 연결)는 `docs/infra.md`에 정의한다.

---

## 2. 프론트엔드 앱 구조 (Next.js)

```bash
fe-app/
├── app/                          # Next.js App Router (라우팅 루트)
│   ├── layout.tsx                # 전체 공통 레이아웃
│   ├── page.tsx                  # 메인 페이지 (/)
│   ├── about/
│   │   └── page.tsx              # 회사 소개 (/about)
│   ├── vision/
│   │   └── page.tsx              # 기업 이념 (/vision)
│   ├── contact/
│   │   └── page.tsx              # 문의 페이지 (/contact)
│   ├── category/
│   │   └── [slug]/
│   │       └── page.tsx          # 동적 게시판 페이지 (/category/[slug])
│   ├── auth/
│   │   └── login/
│   │       └── page.tsx          # 로그인 페이지 (/auth/login)
│   ├── admin/                    # 관리자 영역 (/admin)
│   │   ├── layout.tsx            # 관리자 전용 레이아웃
│   │   ├── page.tsx              # /admin
│   │   ├── posts/
│   │   │   └── page.tsx          # /admin/posts
│   │   ├── categories/
│   │   │   └── page.tsx          # /admin/categories
│   │   └── users/
│   │       └── page.tsx          # /admin/users
│   ├── api/                      # (선택) Route Handlers API endpoint
│   │   ├── posts/
│   │   │   └── route.ts          # /api/posts
│   │   └── contact/
│   │       └── route.ts          # /api/contact
│   └── globals.css               # 전역 스타일 (import via layout.tsx)
│
├── components/
│   ├── layout/                   # Header, Footer, Sidebar 등
│   ├── ui/                       # Button, Card, Modal 등 UI 요소
│   ├── form/                     # Input, Select, FormGroup 등
│   ├── auth/                     # 로그인, 권한 체크 관련
│   └── post/                     # 게시물 관련 컴포넌트
│
├── hooks/                        # custom hooks
├── store/                        # Zustand, Redux, Recoil 등 상태관리
├── lib/                          # API 클라이언트, 유틸리티, fetch 함수 등
├── styles/                       # 모듈 CSS, SCSS 등
├── public/                       # 정적 자원 (이미지, favicon 등)
└── next.config.js

```

### 2.1 AWS Amplify 배포·Cognito 인증

- 프론트엔드 전체는 AWS Amplify Hosting(`main` 브랜치 기준, Next.js App Router)에서 `npm run build`를 실행하여 빌드/배포되며, `amplify.yml`을 통해 `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_COGNITO_USER_POOL_ID`, `NEXT_PUBLIC_COGNITO_CLIENT_ID` 등 환경 변수를 주입한다.
- Amplify는 호스팅만 담당하며, Cognito User Pool은 별도의 AWS 스택(예: Terraform/CloudFormation)으로 관리된다. 프론트엔드는 제공된 환경 변수(Cognito Region/User Pool ID/Client ID)를 사용해 해당 User Pool에 연결하고, 로그인/회원가입 흐름은 Cognito Hosted UI 또는 커스텀 페이지(`/auth/login`, `/auth/signup`)에서 ID/Access 토큰을 발급받아 HTTP-only 쿠키로 저장한다. 토큰 자동 갱신은 Cognito 전용 클라이언트(Amplify Auth 또는 AWS SDK 기반 클라이언트)를 활용한다.
- Cognito User Pool에는 `custom:role` 또는 그룹 중심 역할 할당을 적용하며, 백엔드(`docs/backend.md`)의 사용자 등록 API에서 Cognito Admin API/SDK를 호출하여 신규 사용자와 역할 메타를 동기화해야 한다.
- Next.js `app/middleware.ts`의 `matcher`는 `/admin/:path*`, `/secure/:path*` 등을 포함하도록 구성하여 관리자 영역 접근 전에 Cognito JWT를 디코드하고 `roles`/`cognito:groups` 클레임을 확인하여 자격이 없는 경우 `/auth/forbidden` 또는 `/auth/login`으로 리디렉트한다.
- 모든 API 요청은 Cognito JWT를 `Authorization: Bearer` 헤더나 HTTP-only 쿠키로 포함하고, FastAPI가 해당 토큰에서 서명을 검증한 뒤 역할 정보를 추출하여 엔드포인트 레벨에서 접근 허용 여부를 판단한다. 추후에는 OPA(`docs/opa.md`)에 `subject.roles`를 전달해 보다 세밀한 정책 평가를 수행할 수 있도록 확장한다.

---

## 3. 기능 상세 명세

### 3.1 사용자 인증 (SSO + 2FA)

| 구분 | 항목 | 설명 |
|------|------|------|
| 인증 방식 | OIDC (Cognito) | AWS Cognito User Pool의 Authorization Code Flow |
| 인증 제공자 | AWS Cognito User Pool | Amplify Hosting과는 별도로 관리되는 User Pool, `custom:role`/groups 기반 역할 정보를 포함 |
| MFA 방식 | Google Authenticator | OTP 6자리 검증 |
| 세션 관리 | Access Token + Refresh Token | Access 15분, Refresh 30일 |

#### 로그인 흐름
1. `/admin` 접근 시 → `/auth/login`으로 리다이렉트  
2. OIDC 서버 로그인 성공 → `callback` 엔드포인트로 Authorization Code 전달  
3. 서버에서 Token 교환 후 JWT 저장  
4. 2FA 활성화 계정의 경우, OTP 코드 추가 요청  
5. 인증 성공 시 `/admin` 대시보드 진입

#### 백엔드 Cognito 연계
- 프론트는 `POST /v1/auth/signup`과 `POST /v1/auth/login`을 통해 Cognito User Pool과 연동하며, 백엔드가 Cognito Admin API/SDK를 호출하여 사용자 등록·역할 메타를 저장하고 토큰을 받아 HTTP-only 쿠키로 전달해야 한다(동일한 `custom:role` 값은 백엔드 역할 검증과 향후 OPA 입력에도 그대로 전달됨).
- 관리자 또는 내부 오퍼레이터는 `POST /v1/auth/users` 등 별도 엔드포인트에서 Cognito 사용자 생성·역할 할당 작업을 수행하며, 필요한 경우 `PATCH /v1/auth/users/{userId}/role`로 역할 변경을 반영하고 DynamoDB 혹은 별도 사용자 메타 테이블에 트래킹한다.
- 백엔드는 Cognito JWT에서 서명을 검증한 뒤 `sub`, `email`, `roles`/`cognito:groups`를 추출하여 요청 컨텍스트에 주입하고, 이를 기반으로 엔드포인트 레벨에서 역할 기반 접근 허용 여부를 결정한다. API Gateway Cognito Authorizer를 사용하는 경우, 서명 검증은 게이트웨이에서 선행되고 백엔드는 역할 검증에 집중할 수 있으며, 구성은 `docs/backend.md`를 따른다.

#### Next.js 미들웨어/페이지 보호
- `app/middleware.ts`는 `/admin/:path*`, `/secure/:path*`, `/api/admin/:path*` 같은 관리자 전용 경로에 대해 Cognito JWT 존재 여부와 `roles`/`cognito:groups` 클레임을 검증하고, 허용된 역할이 아닐 경우 `/auth/forbidden`이나 `/auth/login`으로 리디렉트하여 페이지가 렌더링되지 않도록 막는다.
- 미들웨어는 환경 변수로 주입된 Cognito Region/User Pool ID/Client ID와 Cognito JWKS를 사용해 토큰 서명을 확인하고, 필요한 경우 백엔드 `GET /v1/auth/me`를 통해 최신 역할 정보를 동기화한다.
- 역할 검증 결과는 Next.js 미들웨어, 백엔드 역할 검증 레이어, Cognito 사용자 메타 모두 동일한 역할 사전을 참고해야 하며, 각 흐름은 `{서비스명}:{역할명}` 포맷을 사용한다. 본 프로젝트에서는 `fm-web:admin`, `fm-web:editor`, `fm-web:viewer` 3가지 역할군을 사용한다.

#### 관련 API
| 메서드 | 엔드포인트 | 설명 |
|---------|-------------|------|
| `GET` | `/api/auth/login` | OIDC 로그인 요청 |
| `POST` | `/api/auth/2fa/verify` | 2FA 코드 검증 |
| `GET` | `/api/auth/me` | 로그인 사용자 정보 반환 |
| `POST` | `/api/auth/logout` | 세션 종료 |

---

### 3.2 게시물 관리 (Admin CMS)

#### 주요 기능
- 게시물 CRUD
- 썸네일 이미지 업로드
- 카테고리 분류 및 필터링
- Markdown 편집기 내장 (예: `react-markdown` + `editor.js`)

#### 관련 API

| 메서드 | 엔드포인트 | 설명 |
|--------|-------------|------|
| `GET` | `/v1/posts` | 게시물 목록 조회 |
| `GET` | `/v1/posts/{id}` | 특정 게시물 상세 조회 |
| `POST` | `/v1/posts` | 게시물 생성 (텍스트/이미지 포함) |
| `PUT` | `/v1/posts/{id}` | 게시물 수정 |
| `DELETE` | `/v1/posts/{id}` | 게시물 삭제 |

#### 게시물 예시 스키마 (DynamoDB)
```json
{
  "postId": "UUID",
  "category": "ir",
  "title": "2025년 3월 사업보고서",
  "content": "Markdown content...",
  "thumbnailUrl": "https://s3.amazonaws.com/familycorp/posts/ir_2025.png",
  "author": "admin",
  "createdAt": "2025-03-15T09:00:00Z",
  "updatedAt": "2025-03-15T09:30:00Z"
}
```

배포 타깃
- 개발/테스트: S3 + CloudFront(OAC) 정적(SPA/CSR) 또는 `next export`
- 운영(SSR 필요): CloudFront + Lambda@Edge + S3 에셋(이미지/정적)

SSR/캐싱 정책
- 기본: `origin-request`에서 SSR 핸들러 실행, 사용자별 콘텐츠는 `Cache-Control: private, no-store` 또는 vary 헤더 적절히 설정
- 정적 패스(`_next/static/*`, `static/*`): 장기 캐시(`max-age=31536000, immutable`)
- 이미지 최적화(`_next/image*`): 이미지 핸들러(옵션) 연결, 원본 S3에서 변환/캐시

---

## 4. 정적 페이지 IA 및 라우팅

- 홈 (`/`)
  - Hero(슬로건/CTA)
  - Feature Grid(주요 사업)
  - Latest News Summary(공지 요약)
  - CTA 섹션

- 회사 소개 (`/about`)
  - Company Overview
  - 연혁(Timeline)
  - Team Grid(사진/역할)
  - Location(지도 자리표시자)

- 비전 (`/vision`)
  - Mission / Vision / Values
  - 일러스트/이미지 자리표시자

- 연락처 (`/contact`)
  - 연락처 카드(전화/이메일/주소)
  - Contact Form(UI)

참고: 각 페이지는 App Router 정적 빌드 대상이며 외부 데이터 호출을 수행하지 않는다. 메타데이터(title/description/OG/canonical)와 JSON-LD(Organization, WebSite)는 `app/layout.tsx` 및 개별 `page.tsx`에서 정의한다.

---

### 3.2 연락처 문의 처리

- 목적: `/contact` 페이지에서 방문자가 남긴 문의를 **관리자 페이지에서 조회 가능**하도록 저장하고, 동시에 **회사 대표 이메일(corpmeta.email)**로 알림 메일을 발송한다.

#### 플로우 개요
1. 사용자가 `/contact` 페이지에서 문의 폼(회사명, 직책, 이름, 이메일, 유입경로, 제목, 내용 등)을 입력한다.
2. "문의하기" 버튼 클릭 시 프론트엔드는 `POST /api/contact`(Next.js Route Handler)를 호출한다.
3. `/api/contact`는 백엔드 API `POST /v1/contact`로 요청을 위임한다.
4. 백엔드는 요청 본문을 기반으로 `ContactInquiry` 엔티티를 생성하여 데이터베이스(DynamoDB 단일 테이블 또는 현행 테이블)에 저장한다.
5. 저장이 성공하면, 회사 정보 메타(`corpmeta.email` 또는 단일 테이블 상 `CorpInfo.email`)에서 대표 이메일 주소를 조회한 뒤, 동일한 문의 내용을 포함한 알림 메일을 발송한다.
6. 최종적으로 클라이언트에는 성공 여부(`success`, `error`)를 포함한 응답을 반환하고, 실패 시 적절한 에러 메시지와 함께 재시도 가능 상태를 유지한다.

#### 요청/응답 예시(개략)

- 요청(프론트엔드 → 백엔드 `POST /v1/contact`)

```json
{
  "company": "패밀리매니지먼트",
  "title": "팀장",
  "name": "홍길동",
  "email": "user@example.com",
  "referral": "search",
  "subject": "협업 문의",
  "message": "협업 관련해서 문의드립니다."
}
```

- 응답(성공)

```json
{
  "success": true,
  "data": {
    "inquiryId": "UUID",
    "createdAt": "2025-11-15T09:00:00Z"
  }
}
```

#### 관리자 페이지 연계
- 백엔드는 `ContactInquiry` 목록/상세 조회용 API를 제공한다(예: `GET /v1/contact`, `GET /v1/contact/{inquiryId}`).
- 관리자 콘솔에서는 별도 섹션(예: `/admin/contact`)을 통해 문의 목록과 상세 내용을 확인하고, 처리 상태(예: `new`, `in_progress`, `done`)를 갱신할 수 있다.
- 목록 화면에는 최소한 다음 정보가 노출된다.
  - 접수일시, 이름, 이메일, 제목, 상태
  - 행 클릭 시 상세(회사명, 직책, 유입경로, 전체 메시지)를 표시

---

### 3.3 카테고리 관리

| 메서드 | 엔드포인트 | 설명 |
|--------|-------------|------|
| `GET` | `/v1/categories` | 카테고리 목록 조회 |
| `POST` | `/v1/categories` | 카테고리 생성 |
| `PUT` | `/v1/categories/{id}` | 카테고리 수정 |
| `DELETE` | `/v1/categories/{id}` | 카테고리 삭제 |

카테고리 데이터는 정렬 순서와 slug 기반 라우팅을 지원한다.

```json
{
  "categoryId": "UUID",
  "name": "IR",
  "slug": "ir",
  "description": "투자자 관련 보고 자료",
  "order": 1
}
```

---

### 3.4 이미지/파일 업로드

- **방식:** S3 Presigned URL
- **보안:** 서버에서 S3 presigned URL 발급 후, 클라이언트가 직접 업로드
- **제한:**  
  - 파일 크기: 10MB 이하  
  - 확장자: jpg, png, pdf, zip  

#### API
| 메서드 | 엔드포인트 | 설명 |
|--------|-------------|------|
| `POST` | `/v1/upload` | presigned URL 발급 요청 |
| `PUT` | `<presigned-url>` | 실제 파일 업로드 |

---

### 3.5 데이터 저장소 전략(백엔드)

- 기본 저장소: NoSQL — DynamoDB (SAM 템플릿으로 배포)
  - 연결: Lambda → DynamoDB (AWS SDK, VPC 비의존)
  - ORM/드라이버: SQLAlchemy(+ Alembic), 엔진에 맞는 async 드라이버 선택
  - 주요 테이블: posts, categories, users, sessions 등 정합성 요구 데이터
- 보조 저장소: DynamoDB
  - 용도: 이벤트/로그성 데이터, 고스루풋 조회 패턴, 비정규/키-값 데이터
  - 예: 조회 카운트, 비동기 작업 상태, 임시 토큰
- 캐시: ElastiCache(Redis)
  - 용도: 목록/상세 캐시, 세션/토큰 단기 저장(보안정책 부합 시), 레이트 리미팅
  - 원칙: 캐시 미스 시 RDB/DynamoDB 소스 조회 → 캐시 채우기, 강제 무효화 훅 제공

참고: 백엔드 앱은 FastAPI(ASGI)로 작성하며, Lambda에서는 `Mangum`이 API Gateway 이벤트를 HTTP로 변환해 앱에 진입한다.

## 4. 프론트엔드 상세

### 4.1 컴포넌트 구조
| 컴포넌트 | 설명 |
|-----------|------|
| `Navbar.tsx` | 상단 고정 네비게이션 |
| `Footer.tsx` | 하단 정보 |
| `PostList.tsx` | 게시물 목록 뷰 |
| `PostEditor.tsx` | 관리자 게시물 작성용 |
| `LoginForm.tsx` | OIDC 로그인 폼 |
| `OtpForm.tsx` | 2FA 코드 입력 |
| `Dashboard.tsx` | 관리자 메인 |
| `CategoryManager.tsx` | 카테고리 CRUD UI |

### 4.2 상태 관리
- **Pinia-like 구조:** Zustand or Redux Toolkit
- **Auth Store:** 사용자 정보, 토큰 저장
- **Post Store:** 게시물 캐시, CRUD 연동
- **UI Store:** 모달/로딩 상태 관리

---

## 5. 백엔드 상세

### 5.1 주요 Controller

| 컨트롤러 | 설명 |
|-----------|------|
| `AuthController` | 로그인, 2FA, 토큰 관리 |
| `PostController` | 게시물 CRUD |
| `CategoryController` | 카테고리 CRUD |
| `UploadController` | S3 업로드 presigned URL |
| `UserController` | 관리자 계정 관리 |

### 5.2 주요 Service
- `AuthService`: OIDC 통합 및 OTP 검증
- `PostService`: 게시물 로직 처리
- `CategoryService`: 카테고리 관리
- `StorageService`: S3 연동
- `AuditService`: 관리자 로그 추적

---

## 6. 보안 및 정책

| 항목 | 정책 |
|------|------|
| 비밀번호 | 외부 로그인만 허용 (패스워드 저장 금지) |
| 토큰 저장소 | HttpOnly Cookie |
| HTTPS | 필수 |
| CORS | 회사 도메인만 허용 |
| CSRF | Header 기반 CSRF Token |
| XSS 방지 | React sanitization + Markdown sanitization |
| 파일 업로드 | MIME type 검증 후 업로드 |

---

## 7. 로그 및 감사

- 관리자 액션 로그 (게시물 작성/수정/삭제)
- 로그인 시도 로그
- 2FA 실패 로그
- API Access 로그 (CloudWatch 기반)

---

## 8. 배포 및 인프라

| 항목 | 내용 |
|------|------|
| Frontend | S3 + CloudFront (정적 배포) |
| Backend | AWS Lambda (Spring Native) 또는 EC2 |
| Database | DynamoDB |
| CI/CD | GitHub Actions (push 시 빌드 → 배포) |
| 모니터링 | CloudWatch + SNS 알림 |

---

## 9. 향후 확장 고려

| 항목 | 설명 |
|------|------|
| 다국어 지원 | i18n (ko/en/jp) 구조 고려 |
| 통합 대시보드 | 내부 서비스별 상태 모니터링 |
| 지자체 사업공고 수집기 | Python 크롤러 + n8n 자동화 |
| 투자 포트폴리오 관리 | 내부 전용 관리자 탭 추가 |

---

**문서 작성일:** 2025.10.21  
**문서 버전:** v1.0  
**참조 문서:** `prd.md` (v1.0)
