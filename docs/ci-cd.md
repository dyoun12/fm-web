## CI/CD 설정 가이드 (GitHub Actions + SAM + CloudFront/Lambda@Edge)

본 문서는 레포지토리 변수/시크릿 구성과 배포 파이프라인(개발/프로덕션 매트릭스)을 설명합니다.

### 1) 레포지토리 변수(vars)
Settings → Variables → Repository variables에 추가

- FRONTEND_DOMAIN_DEV: 개발 도메인 (예: dev.example.com)
- HOSTED_ZONE_ID_DEV: 개발 도메인의 Route53 Hosted Zone ID
- ACM_CERT_ARN_DEV: us-east-1(버지니아) ACM 인증서 ARN(CloudFront용)
- FRONTEND_DOMAIN_PROD: 운영 도메인 (예: www.example.com)
- HOSTED_ZONE_ID_PROD: 운영 Hosted Zone ID
- ACM_CERT_ARN_PROD: us-east-1 ACM 인증서 ARN
- EDGE_CODE_BUCKET: (선택) us-east-1의 Edge 코드 보관용 S3 버킷명. 미설정 시 워크플로가 fm-web-edge-code-<accountId>로 자동 생성

추가로 커스텀 시나리오(리전, 프라이스 클래스 등)는 `.github/workflows/deploy.yml`의 env를 수정하세요.

### 2) 레포지토리 시크릿(secrets)
- AWS_ROLE_ARN: GitHub OIDC가 Assume할 IAM Role ARN (배포 권한 포함)

신뢰 정책 예시(신뢰 주체: token.actions.githubusercontent.com):
- StringEquals: token.actions.githubusercontent.com:aud = sts.amazonaws.com
- StringLike: token.actions.githubusercontent.com:sub = repo:<OWNER>/<REPO>:ref:refs/heads/main

### 3) 파이프라인 개요
- 백엔드: SAM(sam/template.yaml) — ap-northeast-2
- 프론트엔드(SSR): CloudFront + Lambda@Edge + S3(sam/template.edge.yaml) — us-east-1
- 매트릭스: dev/prod, 스테이지별 도메인/버킷/스택명 분리

### 4) OpenNext 빌드 및 핸들러 산출물
- 빌드 명령: npx open-next@latest build
- 기대 산출물(있을 경우):
  - .open-next/handlers/server-function/
  - .open-next/handlers/image-optimization-function/
  - .open-next/handlers/route-handlers-function/
- 주의: Next.js 버전 호환 및 타입 에러가 빌드를 차단할 수 있습니다. 핸들러 디렉터리가 생성되지 않으면 코드/설정 정비가 필요합니다.

### 5) GitHub CLI로 자동 구성(선택)
scripts/configure-github-vars.sh를 참고하여 gh CLI로 vars/secrets를 설정할 수 있습니다.

