# 03A. 연락처 문의 플로우(contact → admin + email)

## 목표/범위
- `/contact` 페이지의 문의 폼 제출 시:
  - 백엔드에 `ContactInquiry` 엔티티로 문의 내용을 저장하고,
  - 관리자 페이지에서 목록/상세로 조회 가능하도록 하며,
  - 회사 정보 메타에 설정된 대표 이메일(`corpmeta.email`/`CorpInfo.email`)로 알림 메일을 발송한다.
- 프론트엔드, 백엔드, 데이터 스키마, 테스트, 문서를 일관되게 정비한다.

## 참조 문서
- `docs/prd.md`: 연락처 페이지 요구사항(문의 폼 + 관리자/이메일 플로우)
- `docs/spec.md`: 3.2 연락처 문의 처리, `/api/contact` 및 `/v1/contact` 계약
- `docs/backend.md`: 백엔드 런타임/연동 가이드(문의 API 구현 시 참조)
- `docs/dynamodb-schema.md`: `ContactInquiry` 엔티티 스키마

## 산출물(요약)
- 프론트엔드:
  - `/contact` 페이지 `ContactForm`이 실제 API(`/api/contact` → `/v1/contact`)를 호출하여 문의를 전송
  - 문의 제출 성공/실패 UI 피드백(로딩, 성공, 오류 메시지) 구현
- 백엔드:
  - `POST /v1/contact` 엔드포인트(문의 저장 + 알림 메일 발송)
  - 관리자용 문의 목록/상세 API(`GET /v1/contact`, `GET /v1/contact/{inquiryId}`)
  - `ContactInquiry` 엔티티를 DynamoDB 단일 테이블(또는 현행 테이블)로 저장
- 관리자 콘솔:
  - 문의 목록/상세 화면(예: `/admin/contact`) 스켈레톤 및 연결
  - 처리 상태(`new`, `in_progress`, `done`) 변경 기능(1차 버전에서는 읽기 전용도 허용)
- 테스트/문서:
  - 단위 테스트/통합 테스트(프론트/백엔드)로 플로우 검증
  - `docs/prd.md`, `docs/spec.md`, `docs/backend.md`, `docs/dynamodb-schema.md` 동기화

## 체크리스트

### 1) 요구사항/계약 정리
- [x] `docs/prd.md`의 연락처 페이지 설명에 관리자 저장 및 이메일 발송 요구사항 반영
- [x] `docs/spec.md`에 `/api/contact` → `/v1/contact` 플로우 및 바디 스키마 정의
- [ ] `docs/backend.md`에서 문의 API 구현 시 고려할 연동/에러 모델 검토
- [x] `docs/dynamodb-schema.md`에 `ContactInquiry` 엔티티 구조 추가

### 2) 백엔드 구현
- [x] `be-app/app/api/routers/contact.py`(또는 기존 라우터)에 `POST /v1/contact` 추가
- [x] 요청 DTO/응답 DTO 정의(회사명, 직책, 이름, 이메일, 유입경로, 제목, 내용, 생성일시 등)
- [x] `ContactInquiry` 저장 로직 구현(DynamoDB 단일 테이블 또는 기존 테이블)
- [x] 회사 대표 이메일 조회(`corpmeta.email`/`CorpInfo.email`) 헬퍼 구현
- [ ] 메일 발송 구현(AWS SES 등), 실패 시 재시도/로그 전략 정의
- [ ] 백엔드 단위 테스트/통합 테스트 추가(Pytest)

### 3) 프론트엔드 구현(문의 폼 제출)
- [x] `fe-app/api/contact.ts` (또는 기존 API 레이어)에 `postContactInquiry` 함수 추가
- [x] `/api/contact` Route Handler에서 백엔드 `/v1/contact` 호출 연동
- [x] `ContactForm`/`/contact` 페이지에서 `onSubmit`을 통해 API 호출하도록 연결
- [x] 제출 성공/실패 상태에 따라 UI 메시지/상태(로딩, Disabled, 에러) 처리
- [x] 프론트엔드 단위 테스트 추가(Vitest + Testing Library, MSW로 네트워크 모킹)

### 4) 관리자 콘솔 연동
- [x] 관리자 라우트(예: `/admin/contact`) 추가 및 네비게이션에 노출
- [x] 문의 목록 테이블(접수일시, 이름, 이메일, 제목, 상태) 구현
- [ ] 행 클릭 시 상세 보기(회사명, 직책, 유입경로, 전체 메시지) 모달/페이지 구현 (후속 고도화 태스크로 분리 가능)
- [ ] 처리 상태 변경 기능(옵션: `PATCH /v1/contact/{inquiryId}`) 및 토스트 알림 (후속 고도화 태스크로 분리 가능)
- [ ] 관리자 화면 테스트 추가(렌더/상호작용 스모크) (후속 테스트 강화 태스크로 분리 가능)

### 5) 품질/운영
- [ ] 메일 발송 실패/저장 실패 케이스에 대한 에러 처리/로그 정책 정의
- [ ] 개인정보 처리 관점에서 문의 데이터 보관 기간/마스킹 전략 검토(필요 시 후속 태스크로 분리)
- [ ] `npm run lint`, `npm run test -- --run` 통과 확인
- [x] 본 태스크 파일(`tasks/contact-inquiry-flow.md`) 체크리스트 및 관련 PR/스크린샷 링크 업데이트

## 완료 기준(DoD)
- [ ] `/contact` → 백엔드 → 관리자 콘솔까지 문의 플로우가 일관되게 동작
- [ ] 문의 데이터가 관리자 페이지에서 확인 가능하고, 대표 이메일로 알림 메일이 수신됨
- [ ] 오류/예외 상황(저장 실패, 메일 발송 실패)이 사용자/운영자에게 명확히 노출됨
- [ ] 관련 문서/태스크 로그가 최신 상태로 유지됨
