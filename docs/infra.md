# Infrastructure Architecture (Terraform + SAM)

## 1. 문서 목적
AWS 리소스는 Terraform으로 프로비저닝하고, 서버리스 애플리케이션(백엔드 FastAPI)은 AWS SAM으로 빌드/배포/테스트하는 기준을 정의한다. 기본 실행 패턴은 컨테이너 이미지 + AWS Lambda Web Adapter이다.

## 2. 전체 아키텍처 개요

```mermaid
graph TD
    A[GitHub Actions] -->|Terraform Apply| B[AWS Provider]
    B --> C[ECR (Container Image Registry)]
    B --> D[IAM Role & Policy]
    B --> E[AWS Lambda (FastAPI Container)]
    B --> F[API Gateway (HTTP API)]
    B --> G[CloudWatch Logs]
    E --> H[Aurora Serverless v2 (via RDS Proxy)]
    E --> I[DynamoDB]
    E --> J[ElastiCache (Redis)]
    E --> K[S3 Bucket (Presigned Upload)]
    F --> E
```

**핵심 구성요소**
| 영역 | 서비스 | 설명 |
|------|----------|------|
| Compute | AWS Lambda | FastAPI 컨테이너 이미지 실행 환경(Web Adapter) |
| Registry | Amazon ECR | 빌드된 Docker 이미지를 저장 |
| IAM | Role & Policy | Lambda의 S3, DynamoDB, RDS Proxy 접근 권한 제어 |
| API Gateway | HTTP API | 프론트엔드와의 통신 진입점 |
| Database | Aurora Serverless v2 | 관계형 데이터(기본) |
| NoSQL | DynamoDB | 보조 데이터/키-값/이벤트 |
| Cache | ElastiCache | 캐싱/레이트 리미팅 |
| Storage | S3 | 파일 업로드(Presigned) |
| Monitoring | CloudWatch | 로그 및 지표 |
| Deployment | AWS SAM | 서버리스 빌드/배포/로컬 테스트 |

---

## 3. 디렉토리 구조

```bash
terraform/
├── main.tf
├── variables.tf
├── outputs.tf
├── lambda.tf
├── iam.tf
├── ecr.tf
├── apigateway.tf
├── dynamodb.tf
├── rds.tf
├── vpc.tf
└── s3.tf
```

---

## 4. Terraform(리소스) 배포 순서

### (1) ECR 생성
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

### (3) Lambda Function (Container 기반)
```hcl
resource "aws_lambda_function" "backend_lambda" {
  function_name = "familycorp-backend"
  package_type  = "Image"
  image_uri     = "${aws_ecr_repository.backend_repo.repository_url}:latest"
  role          = aws_iam_role.lambda_exec_role.arn
  memory_size   = 1024
  timeout       = 30
}
```

### (4) API Gateway 연결
```hcl
resource "aws_apigatewayv2_api" "http_api" {
  name          = "familycorp-http-api"
  protocol_type = "HTTP"
}
```

### (5) DynamoDB 테이블(예시)
```hcl
resource "aws_dynamodb_table" "posts_table" {
  name         = "familycorp-posts"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "postId"
  attribute { name = "postId" type = "S" }
}
```

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

### (8) Aurora Serverless v2 + RDS Proxy
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

## 5. SAM(서버리스 앱) 템플릿/배포/테스트

기본은 컨테이너 이미지 + AWS Lambda Web Adapter 방식이며, 대안으로 Zip + Mangum도 가능하다.

### 5.1 템플릿 — 컨테이너(Image) + Web Adapter(기본)
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

### 5.2 템플릿 — Zip + Mangum(대안)
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
| Aurora Serverless v2 | 서버리스/프로비저닝 | 가변 |
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
- 본 문서는 인프라/배포 세부(컨테이너/ECR, Web Adapter, API Gateway, VPC, Aurora/DynamoDB/ElastiCache, CI/CD)를 다룬다.
