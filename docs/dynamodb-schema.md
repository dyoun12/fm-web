# DynamoDB 단일 테이블 스키마 문서

**프로젝트:** Codex Agent Unified Data Layer
**Version:** 2025.11
**Purpose:**
Codex Agent가 사용하는 모든 도메인 엔티티(User, Category, Post, Banner, CorpInfo)를
단일 DynamoDB 테이블로 관리하여 **SSoT (Single Source of Truth)** 역할을 수행한다.

---

## 0. 적용 범위와 현재 상태

| 구분 | 내용 | 참고 |
| --- | --- | --- |
| 현행 백엔드(SAM) | `PostsTable`, `CategoriesTable`, `CorpMetaTable` 세 개의 테이블을 `PAY_PER_REQUEST` 모드로 운영 | `sam/template.be.yaml` |
| API 접근 계층 | FastAPI Lambda → `be-app/app/aws/dynamo.py` 헬퍼로 DynamoDB 호출 | `be-app/app/aws/dynamo.py` |
| 타깃 설계(본 문서) | 모든 엔티티를 `PK/SK` 조합 기반 단일 테이블(`FMWebAppTable`, 가칭)로 통합 | 본 문서 |

**적용 가이드**
1. SAM 템플릿에 단일 테이블 리소스를 추가하고 기존 Posts/Categories 테이블은 마이그레이션 완료 후 제거한다.
2. FastAPI 서비스는 `PK/SK` 빌더 유틸을 사용해 단일 테이블과 상호작용한다.
3. 데이터 이전 시 `Type`과 GSI(`Type_CreatedAt`) 값이 누락되지 않도록 Delta 마이그레이션 스크립트를 포함한다.

---

## 1. 테이블 기본 구조

| 항목 | 값 | 설명 |
| --- | --- | --- |
| **TableName** | `FMWebAppTable` (가칭, SAM `Parameters`로 주입) | 통합 테이블 이름. IaC에서 환경별 접미사 지정 |
| **BillingMode** | `PAY_PER_REQUEST` | PRD/DEV 간 용량 분리 필요 없음. 현행 SAM 설정과 동일 |
| **Streams** | `DISABLED` (필요 시 `NEW_AND_OLD_IMAGES`) | Codex Syncer 모듈이 필요할 때만 활성화 |
| **TTL** | `null` (후속 모듈에서 관리) | 공지/배너 만료 시나리오가 생기면 `expiresAt` 속성을 TTL로 사용 |

| 속성명           | 타입               | 설명                                                        |
| ------------- | ---------------- | --------------------------------------------------------- |
| **PK**        | String           | Partition Key — 데이터의 파티션 및 그룹 구분자                         |
| **SK**        | String           | Sort Key — PK 내부에서 정렬 및 관계 표현                             |
| **Type**      | String           | 엔티티 유형 (`User`, `Category`, `Post`, `Banner`, `CorpInfo`) |
| **id**        | String           | 엔티티 고유 식별자                                                |
| **CreatedAt** | String (ISO8601) | 생성 시각                                                     |
| **UpdatedAt** | String (ISO8601) | 수정 시각                                                     |

> `PK`/`SK` 접두사 체계와 `Type` 속성은 Codex Agent DSL의 분기 조건으로 사용되므로, 어떤 엔티티라도 공통 변환 파이프라인을 거칠 수 있다.

---

## 2. 엔티티 타입별 구조

### 2.1 User

| 속성                           | 설명          |
| ---------------------------- | ----------- |
| `PK`: `USER#<userId>`        | 유저 엔티티 파티션  |
| `SK`: `METADATA`             | 단일 유저 메타데이터 |
| 추가 속성: `displayName`, `role` |             |

**예시 아이템**

```json
{
  "PK": "USER#u001",
  "SK": "METADATA",
  "Type": "User",
  "id": "u001",
  "displayName": "김대연",
  "role": "admin",
  "CreatedAt": "2025-11-14T03:00:00Z"
}
```

---

### 2.2 Category

| 속성                            | 설명         |
| ----------------------------- | ---------- |
| `PK`: `CATEGORY#<categoryId>` | 카테고리 파티션   |
| `SK`: `METADATA`              | 카테고리 기본 정보 |
| 추가 속성: `title`, `desc`        |            |

**예시 아이템**

```json
{
  "PK": "CATEGORY#c001",
  "SK": "METADATA",
  "Type": "Category",
  "id": "c001",
  "title": "회사 소식",
  "desc": "보도자료 및 공지",
  "CreatedAt": "2025-11-10T01:00:00Z",
  "UpdatedAt": "2025-11-10T01:00:00Z"
}
```

---

### 2.3 Post

| 속성                                                        | 설명                |
| --------------------------------------------------------- | ----------------- |
| `PK`: `CATEGORY#<categoryId>`                             | 소속 카테고리           |
| `SK`: `POST#<postId>`                                     | 게시물 정렬키 (생성 시각 순) |
| 추가 속성: `authorId`, `title`, `contents` (Markdown 또는 JSON) |                   |

**예시 아이템**

```json
{
  "PK": "CATEGORY#c001",
  "SK": "POST#p001",
  "Type": "Post",
  "id": "p001",
  "categoryId": "c001",
  "authorId": "u001",
  "title": "2025년 3월 사업보고서",
  "contents": "Markdown contents...",
  "CreatedAt": "2025-11-12T05:00:00Z",
  "UpdatedAt": "2025-11-12T05:30:00Z"
}
```

---

### 2.4 Banner

| 속성                                                       | 설명     |
| -------------------------------------------------------- | ------ |
| `PK`: `BANNER#<bannerId>`                                | 배너 파티션 |
| `SK`: `METADATA`                                         | 배너 정보  |
| 추가 속성: `title`, `desc`, `imgUri`, `btn1Text`, `btn2Text` |        |

**예시 아이템**

```json
{
  "PK": "BANNER#bn001",
  "SK": "METADATA",
  "Type": "Banner",
  "id": "bn001",
  "title": "2025 신규 프로젝트",
  "desc": "지금 문의하기",
  "imgUri": "https://cdn.fm-web/banner/bn001.png",
  "btn1Text": "자세히 보기",
  "btn2Text": "문의하기",
  "CreatedAt": "2025-11-13T09:00:00Z",
  "UpdatedAt": "2025-11-13T09:00:00Z"
}
```

---

### 2.5 CorpInfo

| 속성                                    | 설명                |
| ------------------------------------- | ----------------- |
| `PK`: `CORP#INFO`                     | 고정 키 (회사정보 단일 항목) |
| `SK`: `METADATA`                      | 회사 기본 정보          |
| 추가 속성: `name`, `address`, `email`, `fax`, `corpNum` 등 |                   |

**예시 아이템**

```json
{
  "PK": "CORP#INFO",
  "SK": "METADATA",
  "Type": "CorpInfo",
  "id": "corp-info",
  "name": "패밀리매니지먼트",
  "address": "서울특별시 ...",
  "email": "contact@family.com",
  "fax": "+82-2-000-0000",
  "corpNum": "123-45-67890",
  "CreatedAt": "2025-11-14T00:00:00Z",
  "UpdatedAt": "2025-11-14T00:00:00Z"
}
```

---

### 2.6 ContactInquiry

| 속성                                           | 설명                           |
|----------------------------------------------|------------------------------|
| `PK`: `CONTACT#<inquiryId>`                  | 문의 단위 파티션                     |
| `SK`: `METADATA`                             | 문의 메타데이터                       |
| 추가 속성: `name`, `email`, `company`, `title`, `referral`, `subject`, `message`, `status`, `notifiedEmail`, `CreatedAt`, `UpdatedAt` | 문의 내용 및 처리 상태, 알림 메일 정보 |

**예시 아이템**

```json
{
  "PK": "CONTACT#inq001",
  "SK": "METADATA",
  "Type": "ContactInquiry",
  "id": "inq001",
  "name": "홍길동",
  "email": "user@example.com",
  "company": "패밀리매니지먼트",
  "title": "팀장",
  "referral": "search",
  "subject": "협업 문의",
  "message": "협업 관련해서 문의드립니다.",
  "status": "new",
  "notifiedEmail": "contact@family.com",
  "CreatedAt": "2025-11-15T09:00:00Z",
  "UpdatedAt": "2025-11-15T09:00:00Z"
}
```

> `notifiedEmail` 필드는 당시 알림 메일이 발송된 대상 주소를 기록하여, 이후 회사 대표 이메일이 변경되더라도 기존 문의에 대한 추적 가능성을 유지한다.

---

## 3. 인덱스 설계

### 3.1 Primary Key

| 키                       | 설명            |
| ----------------------- | ------------- |
| **Partition Key:** `PK` | 엔티티 단위 파티션    |
| **Sort Key:** `SK`      | 계층 관계 및 정렬용 키 |

**특징:**

* `PK + SK` 조합이 유일해야 함
* `begins_with(SK, 'POST#')` 형태로 하위 엔티티 조회 가능

---

### 3.2 Global Secondary Index (GSI)

#### **GSI1: Type_CreatedAt**

| 항목            | 설명          |
| ------------- | ----------- |
| Partition Key | `Type`      |
| Sort Key      | `CreatedAt` |
| Projection    | `ALL`       |

**사용 목적:**

* Type별 전체 데이터 조회 (예: 모든 배너, 모든 게시물 등)
* 최신순 정렬 지원
* Posts/Category가 동일 파티션(`CATEGORY#<id>`)을 공유하더라도, 전체 목록 화면에서는 `Type_CreatedAt` 쿼리로 cross-category 정렬이 가능

**예시 쿼리:**

```js
await dynamo.query({
  TableName: 'AppTable',
  IndexName: 'Type_CreatedAt',
  KeyConditionExpression: 'Type = :type',
  ExpressionAttributeValues: { ':type': 'Banner' },
  ScanIndexForward: false // 최신순
});
```

---

## 4. 조회 패턴 요약 및 키 빌더

### 4.1 공통 키 빌더

```ts
export const buildKeys = {
  user: (id: string) => ({ PK: `USER#${id}`, SK: 'METADATA' }),
  category: (id: string) => ({ PK: `CATEGORY#${id}`, SK: 'METADATA' }),
  post: (categoryId: string, postId: string) => ({
    PK: `CATEGORY#${categoryId}`,
    SK: `POST#${postId}`
  }),
  banner: (id: string) => ({ PK: `BANNER#${id}`, SK: 'METADATA' }),
  corp: () => ({ PK: 'CORP#INFO', SK: 'METADATA' })
};
```

### 4.2 조회 패턴

| 조회 목적      | KeyConditionExpression                  | 예시 값                      | 설명              |
| ---------- | --------------------------------------- | ------------------------- | --------------- |
| 특정 유저 조회   | `PK = :pk AND SK = :sk`                 | USER#u001 / METADATA      | 유저 메타데이터        |
| 카테고리 상세    | `PK = :pk AND SK = :sk`                 | CATEGORY#c001 / METADATA  | 카테고리 정보         |
| 카테고리 내 게시물 | `PK = :pk AND begins_with(SK, :prefix)` | CATEGORY#c001 / POST#     | 해당 카테고리의 게시물 목록 |
| 특정 게시물 조회  | `PK = :categoryPk AND SK = :postSk`     | CATEGORY#c001 / POST#p001 | 단일 게시물          |
| 모든 배너 조회   | `Type = :type` (GSI1)                   | Banner                    | 전체 배너 목록        |
| 회사 정보 조회   | `PK = :pk AND SK = :sk`                 | CORP#INFO / METADATA      | 단일 회사정보         |

---

## 5. Naming 규칙

| 요소        | 규칙 예시                                             | 설명                     |
| --------- | ------------------------------------------------- | ---------------------- |
| PK 접두사    | `USER#`, `CATEGORY#`, `POST#`, `BANNER#`, `CORP#` | 엔티티 식별 접두사             |
| SK 접두사    | `METADATA`, `POST#<id>`                           | 정렬 및 구분 목적             |
| GSI 이름    | `<PartitionKey>_<SortKey>`                        | 조회 기준 명시               |
| Timestamp | ISO 8601 형식                                       | `YYYY-MM-DDTHH:mm:ssZ` |

---

## 6. 단일 진실원천(Single Source of Truth) 규약

1. **데이터 중복 최소화:**
   모든 엔티티는 PK/SK 조합으로 고유하게 식별되며, 중복 데이터는 저장하지 않는다.

2. **조회 패턴 우선 설계:**
   테이블 구조는 액세스 패턴에 맞춰 설계하며, 조회 속도를 위해 조인을 배제한다.

3. **GSI 사용은 최소화:**
   주요 정렬 축 외의 조회만 인덱스로 분리한다.
   (현재: `Type_CreatedAt` 만 운영)

4. **Codex Agent 접근 정책:**

   * `AppTable`은 Codex Agent의 **Read/Write API Layer**를 통해서만 접근한다.
   * 각 엔티티의 `Type` 속성은 Agent의 DSL(도메인 정의) 매핑 기준이 된다.
   * Agent는 `Type` 기반 Query를 통해 유연하게 Entity 확장 가능하다.

---

## 7. 확장 가이드라인

| 시나리오        | 확장 방식                                |
| ----------- | ------------------------------------ |
| 새 엔티티 추가    | 새로운 `Type` 및 `PK` 접두사 정의             |
| 추가 정렬/필터 요구 | GSI 추가 (예: `AuthorId_CreatedAt`)     |
| 복합 관계 필요    | `SK` 내 접두사(`USER#u001#POST#p001`) 사용 |

---

## 8. 데이터 일관성

* 기본 일관성 수준: **Eventually Consistent Reads**
* 강한 일관성이 필요한 경우: `ConsistentRead: true` 지정
* TTL, Streams, Lambda Triggers는 후속 모듈(Codex Syncer)에서 관리

---

## 9. 버전 관리

| 항목             | 내용                                                    |
| -------------- | ----------------------------------------------------- |
| Schema Version | v1.0.0                                                |
| Maintainer     | Codex Data Platform                                   |
| Last Updated   | 2025-11-14                                            |
| Contact        | [devops@codex-agent.io](mailto:devops@codex-agent.io) |

---

## 10. 참고: 주요 설계 원칙

1. **한 테이블 = 한 도메인**
   모든 도메인 엔티티를 하나의 물리적 테이블에 통합

2. **접근 패턴 기반 설계**
   쿼리 패턴이 곧 데이터 모델링이다.

3. **조인 금지**
   애플리케이션 레벨에서 조인 로직 대신 계층형 키 구조 활용

4. **명시적 Naming 규칙**
   Codex Agent의 DSL과 매핑될 수 있도록 일관된 접두사 체계 유지

---

## 11. 구현 정합성 점검 체크리스트

| 항목 | 점검 내용 | 담당 |
| --- | --- | --- |
| SAM 템플릿 | 단일 테이블 리소스 추가 및 `DynamoDBCrudPolicy` 정리 | `agents.backend`, `agents.infra` |
| API 계층 | `be-app/app/aws/dynamo.py`에 PK/SK 빌더 포함, 단일 테이블 호출로 통일 | `agents.backend` |
| 데이터 마이그레이션 | 기존 `PostsTable`, `CategoriesTable` 데이터를 본 테이블로 이관, `Type`/타임스탬프 보전 | `agents.backend` |
| 테스트 | `npm run test`, `pytest`에서 단일 테이블 목/fixture 적용 | `agents.qa` |

> 위 체크리스트에 따라 작업이 완료되면 `tasks/tasks.md`에 추적 기록을 남겨 단일 진실 원천을 유지한다.
