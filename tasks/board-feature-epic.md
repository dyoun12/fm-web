# 게시판 기능 에픽(EPIC)

## 목적
- PRD/Spec 기반 게시판(카테고리별 리스트/상세, 관리자 CRUD) 기능을 에이전트별( UI / API / State / QA / Docs / Backend )로 분해하여 일관된 DoD와 추적성을 확보한다.

## 범위
- 프론트: 카테고리별 목록(`/category/[slug]`), 게시물 상세, 기본 페이지네이션/정렬/검색(간이)
- 관리자: 게시물 CRUD(초안→게시), 카테고리 CRUD, 이미지 업로드(Presigned URL 연동)
- 백엔드: `/api/posts`, `/api/categories`, `/api/upload` 계약/에러 모델/목 엔드포인트(초기), FastAPI 실제 엔드포인트(후속)
- 상태관리: 목록/상세/페이지 상태, 요청 상태(idle/loading/succeeded/failed), 에러 모델 정합
- 테스트: 단위/통합(프론트) + MSW 목, E2E(선택) 기본 시나리오
- 문서/정합성: PRD/Spec/Design과 코드/스토리/테스트 간 링크 유지

## 선행 문서
- `docs/prd.md` 7.1/7.2 (Post/Category)
- `docs/spec.md` 3.2(게시물), 3.3(카테고리), 3.4(업로드)
- `docs/backend.md`(FastAPI, 에러 모델 권장)

## 체크리스트(에이전트 분해)
- [ ] UI: 카테고리 목록 페이지 스캐폴딩 + 카드/리스트 컴포넌트 + 상세 페이지
- [ ] API: 계약 타입/클라이언트/목(MSW) 추가, 오류 케이스 포함
- [ ] State: posts/categories 슬라이스 설계, typed hooks, 기본 테스트
- [ ] Backend: FastAPI 라우트 스켈레톤(`/posts`, `/categories`, `/upload`), 헬스체크
- [ ] QA: 실패/경계 케이스 테스트, 커버리지 목표 80%
- [ ] Docs: 스펙/PRD 교차 링크와 변경 로그 반영

## DoD(Definition of Done)
- 프론트 목록/상세 라우트 동작, MSW로 API 격리 테스트 통과
- 계약/타입/에러 모델 문서화, 단위 테스트 그린, 커버리지 ≥ 80%
- 관리자 편집 페이지에서 생성→목 저장까지 동작(실서버는 후속)

## 산출물 링크
- UI: `tasks/board-ui.md`
- API: `tasks/api-board-contract.md`
- State: `tasks/state-board-slices.md`
- Backend: `tasks/backend-board-endpoints.md`
- QA: `tasks/qa-board.md`
- Docs: `tasks/docs-board-consistency.md`

