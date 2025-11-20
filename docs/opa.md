# OPA(Policy as Code) 통합 가이드

## 1. 목적
백엔드(FastAPI)가 접근 통제(Authorization)를 OPA(Rego) 정책으로 일관되게 평가할 수 있도록 구성한다.  
개발 시 로컬 번들 경로를 사용하고, 배포 시 Lambda Layer(`/opt`)를 통해 동일 번들을 주입한다.

## 2. 접근 방식
- 정책 표현: Rego(`.rego`)
- 배포 아티팩트: OPA WASM 번들(`policy.wasm` + 선택 `data.json`)
- 실행 패턴: 애플리케이션에서 WASM을 로드해 입력(JSON)을 평가 → `allow`/`deny` 등 결과 반환

## 3. 디렉터리/번들 구조
```
be-app/opa/
├─ policies/          # Rego 정책 소스(.rego)
│  └─ authz.rego
├─ data/              # 선택: 정책 평가에 사용될 정적 데이터(JSON)
│  └─ data.json
└─ build/             # 배포/테스트용 WASM 번들 산출물
   ├─ policy.wasm
   └─ data.json       # 필요 시 포함
```

## 4. 경로 전략(개발/배포)
- 환경변수 `OPA_BUNDLE_PATH`로 번들 루트 경로를 주입
  - 개발(로컬): 기본값 `be-app/opa/build`
  - Lambda(배포): Lambda Layer로 마운트된 `/opt/opa/bundle`

예)
```
# Dev
OPA_BUNDLE_PATH=be-app/opa/build

# Lambda(Runtime)
OPA_BUNDLE_PATH=/opt/opa/bundle
```

> 현재 버전에서는 OPA를 실제 런타임에서 사용하지 않고, FastAPI 레이어에서 Cognito JWT 서명/역할 검증 후 엔드포인트 단에서 접근 제어를 수행한다. 본 문서는 향후 고도화 시 OPA를 도입하기 위한 설계 레퍼런스로 유지한다.

## 5. 평가 입력/출력 규약(예시)
- 입력(JSON): 요청자, 리소스, 메서드 등
```
{
  "subject": { "id": "user-123", "roles": ["fm-web:admin"] },
  "resource": { "type": "post", "id": "abcd" },
  "action": { "method": "GET", "path": "/v1/posts/abcd" },
  "context": { "ip": "1.2.3.4" }
}
```
- 출력(JSON): 최소 `allow: boolean` 및 선택 `reason`
```
{ "allow": true, "reason": "role=fm-web:admin" }
```

## 6. Rego 정책 스켈레톤
`be-app/opa/policies/authz.rego`
```
package authz

default allow = false

allow {
  some r
  input.subject.roles[r] == "fm-web:admin"
}

allow {
  # 예: 게시물 GET은 모두 허용(샘플)
  input.action.method == "GET"
  startswith(input.action.path, "/v1/posts")
}
```

## 7. FastAPI 연동(개요)
- 미들웨어/의존성(dependency)로 평가 함수를 주입하여 엔드포인트 전/후단에 검사
- 구현 포인트(예시): `be-app/app/authz.py`
  - `OPA_BUNDLE_PATH`에서 `policy.wasm`(및 `data.json`) 로드
  - 요청 정보를 입력으로 변환해 평가
  - 실패 시 403 반환

참고: WASM 로더 구현은 프로젝트 선택 라이브러리에 따라 달라질 수 있다. 기본 아이디어는 동일하다(번들 경로만 dev/lambda로 전환).

## 8. Lambda Layer 구성(개요)
- SAM 템플릿에 OPA 레이어를 정의하고, `BackendFunction`에 연결
- 레이어는 `/opt/opa/bundle`에 `policy.wasm`(+ `data.json`)을 제공
- 상세 내용: `docs/infra.md`의 SAM 섹션 참조

## 9. 테스트 가이드(요약)
- 단위 테스트: 입력/출력 규약에 따른 허용/거부 케이스 생성
- 로컬 스모크: `OPA_BUNDLE_PATH=be-app/opa/build`로 서버 실행 후 보호 엔드포인트 요청
- 배포 스모크: SAM 배포 후 `/health` + 보호 엔드포인트 최소 케이스 호출
