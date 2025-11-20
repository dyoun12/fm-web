# Backend Architecture (FastAPI)

## 1. 문서 목적
백엔드 애플리케이션의 런타임/계약/데이터 저장 전략을 정의한다. 인프라/배포 세부(리소스, 네트워킹, CI/CD)는 `docs/infra.md`에서 관리한다.

## 2. 런타임(ASGI)과 Lambda 연계
- 런타임: FastAPI(ASGI)
- Lambda 연계: API Gateway의 이벤트는 `Mangum` 어댑터가 HTTP 요청으로 변환하여 FastAPI 앱으로 전달한다.
- 원칙: 애플리케이션 코드는 ASGI 순수성을 유지하며, 인프라 종속 로직은 SAM 템플릿에서 관리하고, 앱 코드에서는 `handler = Mangum(app)`로 최소한만 인지한다.

### 2.1 환경별 구동 분리
- 로컬 개발(Dev): `uvicorn app.main:app --reload`로 FastAPI를 직접 구동. `Mangum` 관련 코드는 실행되지 않는다.
- Lambda 배포(Prod/Stage): `app.main:handler`가 Lambda 핸들러로 지정되며, `Mangum`이 API Gateway 이벤트를 HTTP로 변환해 FastAPI로 전달한다.

### 2.2 로컬 DynamoDB + SAM 개발 루프
1. DynamoDB Local 컨테이너 기동  
   `docker compose -f sam/local/docker-compose.dynamodb.yml up -d`
2. 테이블 프로비저닝(스키마 동일)  
   `python3 scripts/dynamodb_local_bootstrap.py --endpoint http://localhost:8000`
3. SAM Lambda(FastAPI in Lambda) 로컬 실행  
   `sam local start-api --env-vars sam/local/env.local.json --parameter-overrides DynamoEndpointUrl=http://host.docker.internal:8000`
4. FastAPI 직접 실행 시에도 동일 엔드포인트 사용  
   ```bash
   export USE_DYNAMO=1
   export DYNAMODB_ENDPOINT=http://localhost:8000
   export POSTS_TABLE=fm_posts_local
   export CATEGORIES_TABLE=fm_categories_local
   uvicorn app.main:app --reload
   ```
`sam/local/env.local.json`은 Lambda 컨테이너에 `USE_DYNAMO=1`, `DYNAMODB_ENDPOINT=http://host.docker.internal:8000` 등을 주입하며, template 파라미터 `DynamoEndpointUrl`로 동일 값을 넘기면 API가 DynamoDB Local에 실제 Insert를 수행할 수 있다.
전체 플로우를 한 번에 실행하려면 `./scripts/run_backend_local.sh up`을 사용한다. 스크립트는 도커 Compose → Dynamo 테이블 부트스트랩 → FastAPI(`uvicorn`) → Storybook(6006) → Next.js(3000, `--webpack`) 순으로 백그라운드 실행하고 `NEXT_PUBLIC_API_BASE_URL=http://localhost:8001`, `NEXT_PUBLIC_ADMIN_API_TOKEN=local-dev-token`을 자동 주입한다.  
중지 시에는 `./scripts/run_backend_local.sh down`을 실행해 컨테이너·프로세스를 정리하고 포트 점유를 방지한다. 실행 상태는 `./scripts/run_backend_local.sh status`로 확인 가능하며 로그는 `./.devserver/logs/*.log`에서 확인할 수 있다.  
`NEXT_PUBLIC_API_BASE_URL`을 비워 두더라도 프론트는 기본값으로 `http://localhost:8001`을 바라보므로 잘못된 3000번 루프백 호출을 피할 수 있다.

프로덕션 배포 시 프론트엔드는 기본적으로 `https://api.fmcorp.kr`을 API 베이스 URL로 사용하며, 필요 시 `NEXT_PUBLIC_API_BASE_URL` 환경변수로 재정의할 수 있다.

### 2.3 OPA 기반 접근 통제(Authorization)
- 정책: Rego(OPA), 번들은 WASM(`policy.wasm` + 선택 `data.json`)
- 경로: 개발=`be-app/opa/build`, 배포(Lambda Layer)=`/opt/opa/bundle`
- 설정: 환경변수 `OPA_BUNDLE_PATH`로 경로 제어
- 통합 방식: FastAPI 미들웨어/의존성에서 OPA 평가 호출 → 허용(false 시 403)
- 자세한 구조/샘플 정책: `docs/opa.md` 참조

### 2.4 Cognito 사용자 등록/역할 검증
- Cognito User Pool은 프론트엔드 Amplify 호스팅과는 별도로 관리되며, 백엔드는 `boto3.client("cognito-idp")` 등의 SDK를 통해 사용자 등록/로그인/역할 복제를 책임진다. `POST /v1/auth/signup`은 이메일·비밀번호·`role`을 받아 `AdminCreateUser`/`InitiateAuth`를 호출하고, `POST /v1/auth/login`은 `ADMIN_NO_SRP_AUTH` 또는 `InitiateAuth`로 토큰을 받아 HTTP-only 쿠키로 반환한다.
- 관리자용 `POST /v1/auth/users`과 `PATCH /v1/auth/users/{userId}/role`에서는 Cognito `custom:role` 또는 그룹을 갱신하고, DynamoDB(또는 별도 `users` 테이블)에 `sub`, 이메일, 역할, 내부 메타를 기록하여 이후 Next.js 미들웨어와 백엔드 역할 검증이 같은 역할 사전을 참조할 수 있도록 한다.
- 로그인 사용자로부터 전달받은 Cognito JWT(`Authorization: Bearer` 또는 쿠키)를 검증하고(`python-jose` 기반 서명 검증, issuer/audience/만료 확인), `sub`, `email`, `roles`/`cognito:groups`, `custom:role`을 추출하여 FastAPI 요청 컨텍스트에 주입한 뒤, 엔드포인트 레벨에서 역할 기반 접근 제어를 수행한다. 역할 값은 `{서비스명}:{역할명}` 포맷을 사용하며, fm-web 프로젝트에서는 `fm-web:admin`, `fm-web:editor`, `fm-web:viewer`만 인식한다. API Gateway에서 Cognito Authorizer를 사용하는 경우, 서명 검증은 게이트웨이에서 선행되고 백엔드는 역할 검증에 집중하되, `COGNITO_TRUST_API_GATEWAY=1` 설정으로 백엔드 서명 검증을 비활성화할 수 있다.
- 실패 시에는 401/403을 명시하여 프론트가 `/auth/login` 또는 `/auth/forbidden`으로 리디렉트할 수 있도록 하며, 로그에는 요청 ID·토큰 `sub`·역할 정보를 남겨 추적성을 확보한다. OPA(`docs/opa.md`) 기반 세밀한 정책 평가는 향후 고도화 단계에서 추가된다.

## 3. API 계약/버전/에러 모델
- 계약 우선(Spec-first): 엔드포인트/스키마/에러 코드는 `docs/spec.md`에 정의하고 변경 시 동시 갱신한다.
- 버전: 파괴적 변경은 `/v1` 등 버전 프리픽스 도입으로 관리한다.
- 에러 모델 권장 예시: `{ success, data, error{ code, message, details, traceId } }` + 적절한 HTTP status.

## 4. 데이터 저장소 전략
- 기본 저장소: NoSQL — DynamoDB
  - 용도: 정합성과 트랜잭션이 필요한 핵심 데이터(posts, categories, users, sessions 등)
  - 연결: Lambda → DynamoDB (AWS SDK, VPC 비의존)
  - 기술 스택: SQLAlchemy(또는 SQLModel) + Alembic 마이그레이션, 적합한 async 드라이버 선택
- 보조 저장소: DynamoDB
  - 용도: 이벤트/로그성, 고스루풋 키-값, 비정규 데이터, 액세스 패턴 최적화(GSI 포함)
  - 예: 조회 카운트, 비동기 작업 상태, 임시 토큰/세션 스냅샷
- 캐시: ElastiCache(Redis)
  - 용도: 목록/상세 캐시, 레이트 리미팅, 단기 세션 캐시(보안 정책 부합 시)
  - 전략: 캐시 키 네이밍/TTL/무효화 규칙 정의, 소스-오브-트루스는 DynamoDB

## 5. 개발 가이드(요약)
- 디렉터리: `be-app/app`(애플리케이션), `be-app/tests`(테스트)
- 의존성: `fastapi`, `uvicorn[standard]`, `sqlalchemy`, `alembic`, (드라이버) `aiomysql`/`asyncpg`, `redis`, `boto3`(필요 시 `aioboto3`)
- 헬스체크: `GET /health`는 200과 `{status: "ok"}` 반환
- 테스트: Pytest 기반, 실패/경계 케이스 우선

### 5.1 AWS 리소스 연동 가이드(AWS SDK 우선)
- 공용 헬퍼 위치: `be-app/app/aws/`
  - `clients.py`: 공통 `boto3`/`aioboto3` 클라이언트/리소스 팩토리(재시도/타임아웃 포함)
  - `s3.py`: Presigned URL 생성 등 S3 헬퍼
  - `dynamo.py`: Get/Put/카운터 업데이트 헬퍼
- 원칙: 직접 HTTP 호출 대신 SDK 사용(`boto3`/`aioboto3`)
- 구성: IAM Role, 표준 재시도/타임아웃, 필요 시 VPC 엔드포인트(인프라 참조)

### 5.1 AWS 리소스 연동 가이드(AWS SDK 우선)
- 원칙: 백엔드 로직에서 AWS 리소스에 접근할 때는 직접 HTTP 호출 대신 AWS SDK(파이썬: `boto3`/비동기 `aioboto3`)를 우선 사용한다.
- 이유: 서명/인증(IAM Role), 재시도/백오프, 지역/엔드포인트 해석, 에러 모델 표준화가 SDK에 내장되어 있어 신뢰성이 높다.
- 대표 사용처 예시
  - S3: presigned URL 생성/객체 메타 검증/삭제
  - DynamoDB: 키-값/카운터/세컨더리 인덱스 조회
  - SQS/SNS: 비동기 이벤트 발행
  - Secrets Manager/Parameter Store: 시크릿/구성 조회(캐싱 고려)
  - CloudWatch: 커스텀 메트릭/로그(필요 시)
- 구성 권장
  - 리전/자격 증명: Lambda 환경 기본값 사용(IAM Role), 로컬은 `aws configure` 또는 환경변수
  - 재시도/타임아웃: `botocore.config.Config`로 표준화(exponential backoff, connect/read timeout)
  - 네트워크: 가능 시 VPC 엔드포인트 사용(인프라에서 구성)
- 간단 예시(S3 presigned)
```python
import boto3
from botocore.config import Config

cfg = Config(retries={"max_attempts": 3, "mode": "standard"}, read_timeout=5, connect_timeout=3)
s3 = boto3.client("s3", config=cfg)

def create_presigned_put(bucket: str, key: str, content_type: str, ttl: int = 300) -> dict:
    return s3.generate_presigned_url(
        ClientMethod="put_object",
        Params={"Bucket": bucket, "Key": key, "ContentType": content_type},
        ExpiresIn=ttl,
        HttpMethod="PUT",
    )
```

## 6. 문서 경계
- 본 문서는 백엔드 구현 지침에 집중한다.
- 인프라/배포: API Gateway/Lambda/DynamoDB는 SAM 템플릿으로 배포하고, 네트워크/VPC/공통 리소스는 Terraform으로 관리한다. 상세는 `docs/infra.md`를 참조한다.
- 프론트엔드가 Lambda@Edge(CloudFront)로 전환되어도 백엔드는 기존 API 게이트웨이 엔드포인트(`/v1/*`)를 유지하며, 필요 시 CloudFront의 오리진/비헤이비어로 백엔드 도메인을 라우팅할 수 있다.
