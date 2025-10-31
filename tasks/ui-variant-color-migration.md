# UI 변형→색상 분리 마이그레이션 가이드

> 목적: variant는 "스타일", color는 "팔레트"로 분리하여 일관된 API를 유지한다. 모든 컴포넌트는 `variant="default"`를 기본 제공한다.

## 적용 범위(이번 변경)
- Button(Atom): `variant(default|outline|ghost)` + `color(primary|neutral)`
- IconButton(Atom): `variant(default|ghost)` + `color(primary|neutral)`
- Badge(Atom): `variant(default)` + `color(default|info|success|warning)`

## 마이그레이션 규칙
- 금지: 색상 이름을 `variant`로 사용(예: `variant="primary"`).
- 필수: 변형은 항상 `default`를 갖는다.

### 치환 매핑
- Button
  - `variant="primary"` -> `variant="default"`, `color="primary"`
  - `variant="secondary"` -> `variant="outline"`, `color="primary"`
  - `variant="ghost"` -> `variant="ghost"`, `color="primary"`(기본값 허용 시 생략 가능)
- IconButton
  - `variant="primary"` -> `variant="default"`, `color="primary"`
  - `variant="subtle"` -> `variant="ghost"`, `color="neutral"`
- Badge
  - `variant="info|success|warning|default"` -> `variant="default"`, `color="info|success|warning|default"`

## 체크리스트
- [x] 코드 전역에서 금칙 패턴(`variant="primary"|"secondary"|"subtle"` 등) 검색 (남은 사용처 없음)
- [x] Button 호출부 일괄 치환 및 시각 확인(Dev Preview)
- [x] IconButton 호출부 일괄 치환 및 포커스/호버 상태 확인(Dev 카탈로그에서 프리뷰 갱신)
- [x] Badge 호출부 일괄 치환 및 다크/라이트 대비 검증(사용처 업데이트 완료)
- [x] 스토리 파일 업데이트(컨트롤 문구, Args 키) — IconButton, Badge 반영
- [x] 유닛 테스트 Prop 변경 반영(기존 테스트는 prop 의존성 없음, 영향 없음 확인)
- [x] 디자인 문서(`/docs/design-guide.md`) 정책 섹션 확인 및 링크 추가 완료

## 참고 커밋
- IconButton API: 22be677
- Button/Badge API 및 사용처 업데이트: 74bf4c4

## 검증 방법
- Dev Preview(`fe-app/app/dev/page.tsx`)에서 Atoms 섹션의 Button/IconButton/Badge 조합 확인
- 라이트/다크 테마 토글, 아이콘 전용(ghost) 접근성 라벨 확인
- ESLint, 테스트(`npm run lint`, `npm run test -- --run`) 정상 확인
