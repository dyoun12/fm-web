# FM-web — 1인 개발 + Codex + AWS Serverless 실험 리포지토리

## 개요
- 이 리포지토리는 1인 개발자가 Codex CLI(에이전트 오케스트레이션)와 함께 작업하며, AWS Serverless 아키텍처를 기반으로 한 실제 개발·문서·자동화를 통합적으로 경험하기 위한 실험 공간입니다.
- 프론트엔드(Next.js)와 백엔드(FastAPI on Lambda), IaC(Terraform)와 서버리스 배포(SAM), 정책 기반 인가(OPA)를 하나의 모노리포에서 운영합니다.
- 문서/매니페스트/태스크를 단일 진실 원천으로 관리하며, 변경은 자동 검증 스크립트(`bash scripts/validate-manifests.sh`)로 확인합니다.

## 목적
- Codex와의 협업을 통한 스캐폴딩·문서화·리팩터링 워크플로 검증
- AWS Serverless(Λ + API GW + Aurora Serverless v2 + DynamoDB + ElastiCache + S3) 운영 경험 축적
- 백엔드 FastAPI + OPA(Policy as Code) 기반 접근 통제 적용
- 사양(개발 문서) ↔ 구현(코드) ↔ 운영(Infra) 간 정합성 유지 프로세스 실험

## 선택 기술 스택
- 프론트엔드: Next.js + TypeScript + TailwindCSS + Vitest + Playwright
- 백엔드: FastAPI(ASGI) on AWS Lambda(Web Adapter), SQLAlchemy/SQLModel, Alembic, OPA(Rego/WASM)
- 데이터: Aurora Serverless v2(기본), DynamoDB(보조), ElastiCache(Redis)
- 스토리지/연동: S3 Presigned, AWS SDK 우선(`boto3`/`aioboto3`)
- 인프라: Terraform(프로비저닝), AWS SAM(서버리스 빌드/배포/로컬)
- CI/CD: GitHub Actions(테라폼→SAM 배포→스모크 테스트)

## 문서 바로가기
- 백엔드 개요: `docs/backend.md`
- 인프라/IaC: `docs/infra.md`
- 스펙/요구사항: `docs/spec.md`, `docs/prd.md`
- OPA 가이드: `docs/opa.md`

## 개발 실행(요약)
- 프론트엔드: `cd fe-app && npm i && npm run dev`
- 문서 검증: `bash scripts/validate-manifests.sh`

# AWS cloud 구성도
![AWS Infrastructure](assets/aws_infrastructure.png)

# flowCharts
## 프론트엔드 컨텐츠 로드
![Frontend Content Load](assets/load_frontend_contents.png)

## 백엔드 API 요청
![Request Backend via API Gateway](assets/request_backend_api_gw.png)

## DB Connection 획득
![Get DB Connection](assets/get_db_connection.png)

## 사용자 인증(SSO)
![User Authentication for SSO](assets/user_athentification_for_sso.png)

## 사용자 인가(접근 통제)
![User Access Control](assets/user_access_controll.png)
