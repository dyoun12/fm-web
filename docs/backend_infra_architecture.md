# Backend Infrastructure Architecture (Lambda + Terraform)

## 1. 문서 목적
이 문서는 홈페이지의 백엔드 인프라를 AWS Lambda 기반으로 설계하고,  
**Terraform을 통한 자동화된 배포 파이프라인**을 정의하기 위한 기술 명세이다.

Codex 문서화 철학에 따라,
- **명확성(Clarity)**: 모든 리소스와 의존성을 코드로 정의하고 설명한다.  
- **재현성(Reproducibility)**: 동일한 코드를 어디서든 동일한 결과로 배포할 수 있어야 한다.  
- **자동화(Automation)**: CI/CD 파이프라인과 IaC를 통한 운영 개입 최소화를 목표로 한다.

---

## 2. 전체 아키텍처 개요

```mermaid
graph TD
    A[GitHub Actions] -->|Terraform Apply| B[AWS Provider]
    B --> C[ECR (Container Image Registry)]
    B --> D[IAM Role & Policy]
    B --> E[AWS Lambda (Spring Boot Container)]
    B --> F[API Gateway (HTTP API)]
    B --> G[CloudWatch Logs]
    E --> H[DynamoDB]
    E --> I[S3 Bucket (Presigned Upload)]
    F --> E
```

**핵심 구성요소**
| 영역 | 서비스 | 설명 |
|------|----------|------|
| Compute | AWS Lambda | Spring Boot 컨테이너 이미지 실행 환경 |
| Registry | Amazon ECR | 빌드된 Docker 이미지를 저장 |
| IAM | Role & Policy | Lambda의 S3, DynamoDB 접근 권한 제어 |
| API Gateway | HTTP API | 프론트엔드(Next.js)와의 통신 진입점 |
| Database | DynamoDB | 게시물, 카테고리 데이터 관리 |
| Storage | S3 | 이미지 및 파일 업로드 저장소 |
| Monitoring | CloudWatch | 로그 및 지표 모니터링 |

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
└── s3.tf
```

---

## 4. Terraform 배포 순서

### (1) ECR 생성
```hcl
resource "aws_ecr_repository" "backend_repo" {
  name = "familycorp-backend"
  image_scanning_configuration {
    scan_on_push = true
  }
}
```

### (2) IAM Role 정의
```hcl
resource "aws_iam_role" "lambda_exec_role" {
  name = "familycorp-lambda-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
      Action = "sts:AssumeRole"
    }]
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

### (5) DynamoDB 테이블
```hcl
resource "aws_dynamodb_table" "posts_table" {
  name         = "familycorp-posts"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "postId"

  attribute {
    name = "postId"
    type = "S"
  }
}
```

### (6) S3 버킷
```hcl
resource "aws_s3_bucket" "uploads" {
  bucket = "familycorp-uploads"
  acl    = "private"
  versioning { enabled = true }
}
```

---

## 5. Dockerfile (Spring Boot → Lambda Image)

```Dockerfile
FROM public.ecr.aws/lambda/java:17
COPY build/libs/familycorp-backend.jar ${LAMBDA_TASK_ROOT}
CMD ["com.familycorp.LambdaHandler::handleRequest"]
```

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
      - name: Terraform Init & Apply
        run: |
          terraform -chdir=terraform init
          terraform -chdir=terraform apply -auto-approve
```

---

## 7. 비용 예측
| 리소스 | 구성 | 예상비용(USD/월) |
|---------|-------|------------------|
| Lambda | 1GB, 30만 요청 | $3.00 |
| API Gateway | 30만 요청 | $1.00 |
| DynamoDB | PAY_PER_REQUEST | $0.50 |
| S3 | 10GB 저장 | $0.25 |
| CloudWatch | 로그 저장 | $0.50 |
| **총합** |  | **$5.25 / 월 (예상)** |

---

**작성일:** 2025.11  
**작성자:** GPT-5 (Codex Agent)  
**문서 버전:** v1.0  
**참조 문서:** `spec.md`, `prd_full.md`

---

## 8. 환경/보안/관찰가능성 가이드(요약)

### 8.1 환경(Environments)
- Dev/Stage/Prod 3계층을 기본으로 하며, 동일 파이프라인(Prod parity) 원칙을 따른다.
- 리소스 네이밍/태깅 표준: `familycorp-<env>-<service>`
- 구성 차이는 변수/워크스페이스로만 제어(IaC에서 선언)

### 8.2 네트워크/보안(Security)
- HTTPS 의무, CORS는 회사 도메인만 허용
- OIDC + 2FA, 토큰은 HttpOnly 쿠키에 저장, 만료(Access 15m/Refresh 30d)
- S3 업로드는 presigned URL만 허용, 서버에서 파일 크기/MIME 검증
- 최소 권한 IAM, 시크릿은 Parameter Store/Secrets Manager 관리

### 8.3 관찰가능성(Observability)
- 구조화 로깅(JSON), 상관관계 ID(요청/트랜잭션) 포함
- 주요 지표: 요청 지연/오류율, Lambda 콜드스타트, DynamoDB 지연/프로비저닝
- 경보: 오류율/지연 임계 초과, 배포 실패, 권한 오류
- 대시보드: API Gateway/Lambda/DynamoDB/S3/CloudWatch Logs 핵심 지표 묶음
