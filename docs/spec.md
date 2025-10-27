# 가족법인 홈페이지 상세 스펙 문서 (spec.md)

## 1. 프로젝트 개요
이 문서는 `prd.md`를 기반으로 실제 개발을 위한 **기능별 상세 명세서**를 정의한다.  
Codex를 통해 자동 생성되는 파일/코드 구조와, 수동 구현이 필요한 영역을 구분하여 명시한다.

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

---

## 3. 기능 상세 명세

### 3.1 사용자 인증 (SSO + 2FA)

| 구분 | 항목 | 설명 |
|------|------|------|
| 인증 방식 | OIDC | OpenID Connect (Authorization Code Flow) |
| 인증 제공자 | TBD | Keycloak / Authentik / Google Identity Platform 중 택 1 |
| MFA 방식 | Google Authenticator | OTP 6자리 검증 |
| 세션 관리 | Access Token + Refresh Token | Access 15분, Refresh 30일 |

#### 로그인 흐름
1. `/admin` 접근 시 → `/auth/login`으로 리다이렉트  
2. OIDC 서버 로그인 성공 → `callback` 엔드포인트로 Authorization Code 전달  
3. 서버에서 Token 교환 후 JWT 저장  
4. 2FA 활성화 계정의 경우, OTP 코드 추가 요청  
5. 인증 성공 시 `/admin` 대시보드 진입

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
| `GET` | `/api/posts` | 게시물 목록 조회 |
| `GET` | `/api/posts/{id}` | 특정 게시물 상세 조회 |
| `POST` | `/api/posts` | 게시물 생성 (텍스트/이미지 포함) |
| `PUT` | `/api/posts/{id}` | 게시물 수정 |
| `DELETE` | `/api/posts/{id}` | 게시물 삭제 |

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

---

### 3.3 카테고리 관리

| 메서드 | 엔드포인트 | 설명 |
|--------|-------------|------|
| `GET` | `/api/categories` | 카테고리 목록 조회 |
| `POST` | `/api/categories` | 카테고리 생성 |
| `PUT` | `/api/categories/{id}` | 카테고리 수정 |
| `DELETE` | `/api/categories/{id}` | 카테고리 삭제 |

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
| `POST` | `/api/upload` | presigned URL 발급 요청 |
| `PUT` | `<presigned-url>` | 실제 파일 업로드 |

---

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
