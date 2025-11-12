# Infrastructure Architecture (Terraform + SAM)

## 1. 문서 목적
Terraform은 VPC/서브넷/보안그룹/VPC 엔드포인트/공통 S3/ECR/IAM 등 인프라 중심 리소스를 담당한다. API Gateway, Lambda, DynamoDB 등 애플리케이션 리소스는 AWS SAM으로 빌드/배포/테스트한다. 기본 실행 패턴은 Zip 패키지 + Mangum(함수 핸들러)이다.

## 2. 전체 아키텍처 개요

```mermaid
graph TD
    A[GitHub Actions] -->|Terraform Apply| B[AWS Provider]
    B --> C[ECR (Container Image Registry)]
    B --> D[IAM (Shared Roles/Policies)]
    B --> G[CloudWatch Logs]
    B --> K[S3 Bucket (Shared/Public)]
    A -->|SAM Deploy| E[AWS Lambda (FastAPI Container)]
    A -->|SAM Deploy| F[API Gateway (HTTP API)]
    A -->|SAM Deploy| I[DynamoDB]
    E --> J[ElastiCache (Redis)]
    F --> E
```

**핵심 구성요소**
| 영역 | 서비스 | 설명 |
|------|----------|------|
| Compute | AWS Lambda | FastAPI Zip 패키지 + Mangum(함수 핸들러) |
| Registry | Amazon ECR | 빌드된 Docker 이미지를 저장 |
| IAM | Role & Policy | 공통/기반 권한(Terraform), 함수별 미세 권한은 SAM에서 부여 |
| API Gateway | HTTP API | 프론트엔드와의 통신 진입점 |
| Database | DynamoDB | NoSQL(기본, SAM 배포) |
| NoSQL | DynamoDB | 보조 데이터/키-값/이벤트 |
| Cache | ElastiCache | 캐싱/레이트 리미팅 |
| Storage | S3 | 파일 업로드(Presigned) |
| Monitoring | CloudWatch | 로그 및 지표 |
| Deployment | AWS SAM | 서버리스 빌드/배포/로컬 테스트 |

---

## 3. 디렉토리 구조

```bash
terraform/
├── main.tf          # providers/backends/default tags
├── variables.tf     # region/env 등
├── vpc.tf           # (예정) VPC/서브넷/보안그룹
├── endpoints.tf     # (예정) VPC 엔드포인트(S3/DynamoDB/CloudWatch 등)
├── s3.tf            # (예정) 공통 S3 버킷
├── ecr.tf           # (선택) ECR 리포지터리
└── iam.tf           # (선택) 공통 IAM 리소스
```

---

## 4. 배포 책임 분리와 절차

### (A) Terraform — 인프라(네트워크/공통)
- VPC/서브넷/라우팅/보안그룹/VPC 엔드포인트 구성
- 공통 S3, ECR, 공용 IAM 역할/정책(필요 시)
- 실행: `terraform init && terraform apply -var-file=dev.tfvars`

### (B) SAM — 애플리케이션(API GW/Lambda/DynamoDB)
- SAM 템플릿에서 API Gateway, Lambda, DynamoDB(SimpleTable 또는 CFN 테이블)를 정의
- 실행: `sam build && sam deploy --guided`

### (1) ECR 생성(선택 — 컨테이너 이미지 사용 시)
```hcl
resource "aws_ecr_repository" "backend_repo" {
  name = "familycorp-backend"
  image_scanning_configuration { scan_on_push = true }
}
```

### (2) IAM Role 정의
```hcl
resource "aws_iam_role" "lambda_exec_role" {
  name = "familycorp-lambda-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{ Effect = "Allow", Principal = { Service = "lambda.amazonaws.com" }, Action = "sts:AssumeRole" }]
  })
}
```

### (3) Lambda Function (앱 리소스 — SAM 관리)
이 항목은 SAM 템플릿에서 정의/배포합니다.

### (4) API Gateway 연결(앱 리소스 — SAM 관리)
이 항목은 SAM 템플릿에서 정의/배포합니다.

### (5) DynamoDB 테이블(앱 리소스 — SAM 관리)
이 항목은 SAM 템플릿에서 정의/배포합니다(AWS::Serverless::SimpleTable 또는 CFN 리소스).

### (6) S3 버킷(업로드)
```hcl
resource "aws_s3_bucket" "uploads" {
  bucket = "familycorp-uploads"
  acl    = "private"
  versioning { enabled = true }
}
```

### (7) VPC & 네트워킹(요약)
```hcl
resource "aws_vpc" "main" { cidr_block = "10.0.0.0/16" }
resource "aws_subnet" "private_a" { vpc_id = aws_vpc.main.id cidr_block = "10.0.1.0/24" availability_zone = "ap-northeast-2a" }
resource "aws_subnet" "private_c" { vpc_id = aws_vpc.main.id cidr_block = "10.0.2.0/24" availability_zone = "ap-northeast-2c" }
resource "aws_security_group" "lambda_sg" { vpc_id = aws_vpc.main.id }

#### 7.1 VPC 엔드포인트(권장)
Lambda가 VPC 내부에서 AWS 리소스에 접근할 때 NAT 의존을 줄이고 지연/비용을 최적화하기 위해 인터페이스/게이트웨이 엔드포인트를 사용한다.

권장 엔드포인트(지역 지원 여부 확인):
- S3: 게이트웨이 엔드포인트(`com.amazonaws.<region>.s3`)
- DynamoDB: 게이트웨이 엔드포인트(`com.amazonaws.<region>.dynamodb`)
- SQS/SNS/Secrets Manager/STS/CloudWatch Logs: 인터페이스 엔드포인트(VPC Endpoint Service)

보안 그룹/서브넷에 맞춰 엔드포인트 정책을 최소권한으로 설정한다.
```

### (8) 관계형 DB(Aurora) — 현재 제외
> 비용 이슈로 프로젝트 범위에서 제외되었습니다. 아래 내용은 참고용이며, 활성화 시 별도 태스크에서 재검토/적용합니다.
```hcl
resource "aws_db_subnet_group" "aurora_subnets" {
  name       = "familycorp-aurora-subnets"
  subnet_ids = [aws_subnet.private_a.id, aws_subnet.private_c.id]
}

resource "aws_rds_cluster" "aurora" {
  cluster_identifier     = "familycorp-aurora"
  engine                 = "aurora-mysql"   # 실제 엔진으로 조정
  engine_mode            = "provisioned"    # 또는 serverless
  master_username        = var.db_user
  master_password        = var.db_password
  db_subnet_group_name   = aws_db_subnet_group.aurora_subnets.name
  vpc_security_group_ids = [aws_security_group.lambda_sg.id]
}

resource "aws_rds_cluster_instance" "aurora_instances" {
  count              = 2
  identifier         = "familycorp-aurora-${count.index}"
  cluster_identifier = aws_rds_cluster.aurora.id
  instance_class     = "db.serverless"
  engine             = aws_rds_cluster.aurora.engine
}

resource "aws_db_proxy" "rds_proxy" {
  name                   = "familycorp-rds-proxy"
  engine_family          = "MYSQL" # 엔진에 맞게
  role_arn               = aws_iam_role.lambda_exec_role.arn
  vpc_subnet_ids         = [aws_subnet.private_a.id, aws_subnet.private_c.id]
  vpc_security_group_ids = [aws_security_group.lambda_sg.id]
}
```

### (9) ElastiCache(Redis) — 캐시(선택)
```hcl
resource "aws_elasticache_subnet_group" "redis" {
  name       = "familycorp-redis-subnets"
  subnet_ids = [aws_subnet.private_a.id, aws_subnet.private_c.id]
}

resource "aws_elasticache_replication_group" "redis" {
  replication_group_id          = "familycorp-redis"
  replication_group_description = "App cache"
  engine                        = "redis"
  node_type                     = "cache.t4g.small"
  automatic_failover_enabled    = true
  subnet_group_name             = aws_elasticache_subnet_group.redis.name
  security_group_ids            = [aws_security_group.lambda_sg.id]
}
```

---

## 5. 프론트엔드 배포 옵션 및 SAM/CF 배포 체계

프론트엔드는 두 가지 방식 중 하나를 선택한다.

- 정적 호스팅: S3 + CloudFront(OAC) — SSR 없음, SPA/CSR 또는 `next export` 방식. 템플릿: `sam/template.yaml`의 Frontend 섹션.
- Lambda@Edge SSR: CloudFront + Lambda@Edge + S3 에셋 — SSR/이미지 최적화/API 라우트 지원. 템플릿: `sam/template.edge.yaml`(us-east-1 배포).

참고: Lambda@Edge는 us-east-1 리전에만 배포할 수 있으므로, 백엔드(APIs) 인프라(ap-northeast-2)와 분리된 스택/리전을 사용한다.

### 5.1 (백엔드) 템플릿 — 컨테이너(Image) + Web Adapter(레거시)
`template.yaml`
```yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31
Description: FastAPI on Lambda (Container)

Resources:
  BackendFunction:
    Type: AWS::Serverless::Function
    Properties:
      PackageType: Image
      Timeout: 30
      MemorySize: 1024
      Layers:
        - !Ref OpaLayer
      Events:
        Api:
          Type: HttpApi
          Properties:
            Path: /{proxy+}
            Method: ANY
    Metadata:
      Dockerfile: be-app/Dockerfile
      DockerContext: .
      DockerTag: latest

  OpaLayer:
    Type: AWS::Serverless::LayerVersion
    Properties:
      LayerName: familycorp-opa-bundle
      Description: OPA WASM bundle for authorization
      ContentUri: be-app/opa/build
      CompatibleRuntimes:
        - python3.12
      RetentionPolicy: Delete
```

참고: 컨테이너 내부에 AWS Lambda Web Adapter가 포함되어 있어야 하며, `CMD`로 `uvicorn app.main:app`이 실행된다.

### 5.2 (백엔드) 템플릿 — Zip + Mangum(기본)
`template.yaml`
```yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31
Description: FastAPI on Lambda (Zip + Mangum)

Globals:
  Function:
    Runtime: python3.12
    Timeout: 30
    MemorySize: 1024

Resources:
  BackendFunction:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: be-app/
      Handler: app.main:handler
      Layers:
        - !Ref OpaLayer
      Events:
        Api:
          Type: HttpApi
          Properties:
            Path: /{proxy+}
            Method: ANY
      Policies:
        - AWSLambdaBasicExecutionRole

  OpaLayer:
    Type: AWS::Serverless::LayerVersion
    Properties:
      LayerName: familycorp-opa-bundle
      Description: OPA WASM bundle for authorization
      ContentUri: be-app/opa/build
      CompatibleRuntimes:
        - python3.12
      RetentionPolicy: Delete
```

### 5.3 SAM 명령 요약
- 빌드: `sam build`
- 배포: `sam deploy --guided` (초기 1회) 또는 `sam deploy`
- 로컬 실행: `sam local start-api` → `curl http://127.0.0.1:3000/health`
- 로그: `sam logs -n BackendFunction --stack-name <STACK> --tail`

레이어/번들 경로
- Lambda 런타임에서 레이어는 `/opt`에 마운트되며, 번들 기준 경로는 `/opt/opa/bundle`로 가정한다.
- 빌드 단계에서 `be-app/opa/build` 하위에 `policy.wasm`(+ `data.json`)이 있어야 한다.

---

## 6. CI/CD (GitHub Actions)

```yaml
name: Deploy Backend

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v2
        with:
          terraform_version: 1.9.8
      - name: Setup AWS SAM CLI
        uses: aws-actions/setup-sam@v2
        with:
          use-installer: true
      - name: Terraform Init & Apply
        run: |
          terraform -chdir=terraform init
          terraform -chdir=terraform apply -auto-approve
      - name: SAM Build & Deploy
        run: |
          sam build
          sam deploy --no-confirm-changeset --stack-name familycorp-backend --resolve-s3
      - name: Post-deploy smoke test
        run: |
          API_URL=$(aws cloudformation describe-stacks --stack-name familycorp-backend \
            --query 'Stacks[0].Outputs[?OutputKey==`HttpApiUrl`].OutputValue' --output text)
          echo "Smoke testing: $API_URL/health"
          curl -fsSL "$API_URL/health" | tee /tmp/health.json
```

---

## 7. 비용 예측(개략)
| 리소스 | 구성 | 예상비용(USD/월) |
|---------|-------|------------------|
| Lambda | 1GB, 30만 요청 | $3.00 |
| API Gateway | 30만 요청 | $1.00 |
| DynamoDB | PAY_PER_REQUEST | $0.50 |
| DynamoDB | 서버리스 | 고스루풋/저지연 |
| ElastiCache | t4g.small | 가변 |
| S3 | 10GB 저장 | $0.25 |
| CloudWatch | 로그 저장 | $0.50 |

---

## 8. 환경/보안/관찰가능성 가이드(요약)

### 8.1 환경(Environments)
- Dev/Stage/Prod 3계층, 동일 파이프라인(Prod parity)
- 네이밍/태깅: `familycorp-<env>-<service>`

### 8.2 네트워크/보안(Security)
- HTTPS 의무, CORS는 회사 도메인만 허용
- OIDC + 2FA, 토큰은 HttpOnly 쿠키, 만료(Access 15m/Refresh 30d)
- S3 업로드는 presigned URL만 허용, 서버에서 파일 크기/MIME 검증
- 최소 권한 IAM, 시크릿은 Parameter Store/Secrets Manager 관리

### 8.3 관찰가능성(Observability)
- 구조화 로깅(JSON), 상관관계 ID 포함
- 주요 지표: 요청 지연/오류율, Lambda 콜드스타트, DB/캐시 지연
- 경보: 오류율/지연 임계 초과, 배포 실패, 권한 오류

---

부록) 문서 경계
- 백엔드 구현 지침은 `docs/backend.md`에서 관리한다.
- 본 문서는 인프라/배포 세부(컨테이너/ECR, API Gateway, VPC, DynamoDB/ElastiCache, CI/CD)를 다룬다.
### 5.3 (프론트엔드) 템플릿 — S3 + CloudFront(OAC) 정적 호스팅
`sam/template.yaml` 내 Frontend 섹션을 활성화하여 도메인/인증서가 주어지면 다음 리소스를 생성한다.

- `FrontendBucket`(S3, OAC 전용), `FrontendDistribution`(CloudFront), Route53 A/AAAA 레코드, OAC, 버킷 정책
- SPA 라우팅을 위해 403/404 → `/index.html` 커스텀 에러 응답

### 5.4 (프론트엔드) 템플릿 — CloudFront + Lambda@Edge SSR
`sam/template.edge.yaml`은 us-east-1에서 배포하며 다음을 포함한다.

- 파라미터: `FrontendDomainName`, `DomainHostedZoneId`, `AcmCertificateArn`, `AssetsBucketName`, `EdgeCodeBucket`(미지정 시 자동 생성), `DefaultLambdaKey`, (옵션) `ImageLambdaKey`, `ApiLambdaKey`, `BackendApiDomainName`, `BackendApiStageName`
- 리소스: `DefaultEdgeLambda`(+ Version), (옵션) 이미지/Api 람다(+ Version), `FrontendDistribution`(LambdaFunctionAssociations: origin-request), Route53 A/AAAA, OAC
- Outputs: CloudFront 도메인/배포 ID

배포 흐름(요약):
1) Next.js 빌드(SSR): OpenNext(`npx open-next@latest build`)로 Lambda@Edge 패키지 생성 → `.open-next/handlers/*`를 zip → `default-handler.zip`(SSR), 선택: `image-handler.zip`, `api-handler.zip`
2) us-east-1의 S3(`EdgeCodeBucket`)에 zip 업로드
3) `aws cloudformation deploy --region us-east-1 -t sam/template.edge.yaml ...` 실행
4) 정적 에셋(`public/`, `.next/static/`, `out/` 등)은 `AssetsBucketName`으로 동기화
5) CloudFront 전체 무효화

보안 주의:
- Lambda@Edge는 글로벌 복제되며 삭제/업데이트 지연이 발생할 수 있음
- 코드 버전은 `AWS::Lambda::Version`을 통해 고정되며, 함수 이름 변경 없이 새 버전 생성으로 롤아웃
- 인증서 ARN은 us-east-1이어야 함(CloudFront 제약)

백엔드 API 라우팅:
- `v1/*` 경로는 API Gateway 오리진으로 라우팅(허용 메서드: GET/HEAD/OPTIONS/PUT/POST/PATCH/DELETE)
- 헤더 전달: `Authorization`, `Content-Type`, CORS 프리플라이트 관련 헤더를 전달하도록 설정
