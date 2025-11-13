# 어드민 게시물 편집/생성 페이지 스캐폴딩

## 목적
- 관리자 게시물 목록의 EmptyState에서 CTA 클릭 시 게시물 편집 페이지로 이동하도록 액션을 활성화하고, 편집(생성) 페이지를 스캐폴딩한다.

## 체크리스트
- [x] 게시물 페이지 EmptyState에 `actionLabel`/`onAction` 활성화
- [x] 라우트 추가: `/admin/posts/edit`
- [x] 편집 폼 스캐폴딩(제목/카테고리/본문 + 취소/저장)
- [x] 목 API 연동 및 저장 로직(후속)
- [x] 단위 테스트 추가(후속)

## 생성/변경 파일
- 변경: `fe-app/app/admin/posts/page.tsx`, `fe-app/api/posts.ts`, `fe-app/app/admin/posts/page.test.tsx`, `be-app/app/models/schemas.py`, `be-app/tests/test_posts.py`
- 추가: `fe-app/app/admin/posts/edit/page.tsx`

## 참고
- 디자인/토큰은 기존 Atoms 변형을 사용(Button/Input/Select/TextArea, Card)
- 내비게이션은 `Button asChild + <Link>` 패턴과 `useRouter.push` 조합 사용

Refs: docs/prd.md, docs/spec.md, AGENTS.md
