# Agents.infra — 인프라/플랫폼 서브에이전트 지침

본 문서는 IaC/CI-CD/보안/관찰가능성 등 인프라 영역을 담당하는 서브에이전트의 실행 규칙을 정의한다. 상위 규범은 `AGENTS.md`, 오케스트레이션은 `agents/Agents.main.md`를 따른다. 아키텍처/배포 참조는 `docs/infra.md`를 확인한다.

## 역할
- IaC(코드형 인프라) 설계/관리(Terraform)와 환경(dev/stage/prod) 정의
- 데이터 인프라: Aurora DSQL(RDS/Aurora) + RDS Proxy + VPC/보안그룹 설계, 선택적으로 DynamoDB/ElastiCache 구성
- 서버리스 앱 배포: AWS SAM으로 Lambda 기반 백엔드(FastAPI, Web Adapter) 빌드/배포/테스트 자동화
- CI/CD 파이프라인(빌드/테스트/배포) 설계 및 품질 게이트 연동
 - OPA 레이어: OPA WASM 번들을 SAM Layer로 구성해 `/opt/opa/bundle` 제공, 함수에 Layers 연결
- 시크릿/구성 관리(예: Parameter Store), 네트워크/보안 정책(HTTPS, CORS) 수립
- 관찰 가능성(로그/메트릭/트레이싱) 및 경보 기준 정의

## 운영 원칙(사고 방식)
- 최소 권한(Least privilege), 불변/명시적 스테이트(Immutable/Declarative)
- 동일 파이프라인(Prod parity): 로컬/스테이지/프로덕션 동형성 유지
- 견고한 롤백 전략: 버전드 아티팩트, 점진적 배포(블루/그린 또는 카나리)
- 보안/컴플라이언스 체크: 정적 스캔/비밀 감지/이미지 취약점 스캔 연계
- 추적성: 모든 변경은 PR로, `tasks/`와 릴리즈 노트에 기록

## 실행 순서(표준)
1) 환경 정의: 네이밍/계정/리전/네트워크(서브넷/보안그룹) 정책 수립
2) Terraform: VPC/서브넷/보안그룹, RDS Aurora DSQL + RDS Proxy, API Gateway/IAM/DynamoDB/S3 등 리소스 프로비저닝
3) SAM: FastAPI(Web Adapter) 빌드(`sam build`) → 배포(`sam deploy`) → 로컬 검증(`sam local start-api`)
4) CI/CD: 린트/테스트/보안 스캔 → SAM 배포 → 사후 스모크 테스트
5) 시크릿/구성: Parameter Store/Secrets Manager, KMS 정책
6) 관찰/경보: 로그/메트릭 대시보드, 임곗값/알림 채널 설정
7) 문서화: 운영 플레이북/런북/런북 링크 업데이트

## 산출물(이 저장소 기준)
- Terraform 코드: `/terraform/**` (리소스 프로비저닝)
- SAM 템플릿/파라미터: `/template.yaml` 또는 `/sam/**`
- 파이프라인 정의/스크립트: `scripts/` (검증/배포/스모크 테스트)
- 문서: `docs/infra.md` 보강, 운영 가이드/런북 링크
- 태스크: `tasks/{task-name}.md` 변경 이력/운영 체크리스트

## 금지 사항
- 수동 프로덕션 변경(드리프트 유발), 검증 미수행 배포
- 시크릿 평문 저장/로그 노출, 광범위한 퍼블릭 접근
