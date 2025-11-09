# Backend Architecture (FastAPI)

## 1. 문서 목적
백엔드 애플리케이션의 런타임/계약/데이터 저장 전략을 정의한다. 인프라/배포 세부(리소스, 네트워킹, CI/CD)는 `docs/infra.md`에서 관리한다.

## 2. 런타임(ASGI)과 Lambda 연계
- 런타임: FastAPI(ASGI)
- Lambda 연계: API Gateway의 JSON 이벤트를 AWS Lambda Web Adapter가 HTTP 요청으로 변환하여 FastAPI 앱으로 전달한다.
- 원칙: 애플리케이션 코드는 ASGI 순수성을 유지하며, 인프라 종속 로직(어댑터, 컨테이너, 템플릿)은 인프라 계층에서 처리한다.

### 2.1 OPA 기반 접근 통제(Authorization)
- 정책: Rego(OPA), 번들은 WASM(`policy.wasm` + 선택 `data.json`)
- 경로: 개발=`be-app/opa/build`, 배포(Lambda Layer)=`/opt/opa/bundle`
- 설정: 환경변수 `OPA_BUNDLE_PATH`로 경로 제어
- 통합 방식: FastAPI 미들웨어/의존성에서 OPA 평가 호출 → 허용(false 시 403)
- 자세한 구조/샘플 정책: `docs/opa.md` 참조

## 3. API 계약/버전/에러 모델
- 계약 우선(Spec-first): 엔드포인트/스키마/에러 코드는 `docs/spec.md`에 정의하고 변경 시 동시 갱신한다.
- 버전: 파괴적 변경은 `/v1` 등 버전 프리픽스 도입으로 관리한다.
- 에러 모델 권장 예시: `{ success, data, error{ code, message, details, traceId } }` + 적절한 HTTP status.

## 4. 데이터 저장소 전략
- 기본 저장소: 관계형 DB — Aurora DSQL
  - 용도: 정합성과 트랜잭션이 필요한 핵심 데이터(posts, categories, users, sessions 등)
  - 연결: Lambda → RDS Proxy → Aurora DSQL (VPC 프라이빗)
  - 기술 스택: SQLAlchemy(또는 SQLModel) + Alembic 마이그레이션, 적합한 async 드라이버 선택
- 보조 저장소: DynamoDB
  - 용도: 이벤트/로그성, 고스루풋 키-값, 비정규 데이터, 액세스 패턴 최적화(GSI 포함)
  - 예: 조회 카운트, 비동기 작업 상태, 임시 토큰/세션 스냅샷
- 캐시: ElastiCache(Redis)
  - 용도: 목록/상세 캐시, 레이트 리미팅, 단기 세션 캐시(보안 정책 부합 시)
  - 전략: 캐시 키 네이밍/TTL/무효화 규칙 정의, 소스-오브-트루스는 Aurora/DynamoDB

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
- 인프라/배포(컨테이너/ECR, Web Adapter 주입, API Gateway 연결, VPC, Aurora/RDS Proxy/DynamoDB/ElastiCache, CI/CD, OPA Layer)는 `docs/infra.md`를 참조한다.
