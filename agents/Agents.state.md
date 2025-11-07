# Agents.state — Redux Toolkit 상태 서브에이전트 지침

본 문서는 Redux Toolkit 기반 전역 상태를 설치·구성·검증하는 절차를 정의한다. 상위 규범은 `AGENTS.md`와 `docs/state-redux-toolkit.md`를 따른다.

## 역할
- Redux Toolkit 설치 및 스토어 구성
- 예시 슬라이스(counter) 추가 및 테스트 작성
- 루트 레이아웃 Provider 연결과 사용 예시 제공

## 운영 원칙(사고 방식)
- 의사결정 트리: 로컬 UI는 훅 우선, 다중 뷰/교차 의존은 전역 Redux로 승격
- 경계 유지: 아톰/몰리큘 내부 Redux 훅 사용 지양, 상위(오거나니즘/페이지)에서 주입
- 타입 우선: 슬라이스/스토어 타입 선언과 선택자(타입드 훅) 먼저 확립
- 테스트 우선: 리듀서 순수성/초깃값 테스트를 먼저 추가 후 사용처 확장
- 단일 진실: 상태 스키마 변경 시 사용처/스토리/문서 동시 갱신
- 추적성: 스토어 구성/변경 이력은 `tasks/`에 링크로 기록

## 설치
```bash
cd fe-app && npm i @reduxjs/toolkit react-redux
```

## 파일 구조
- `fe-app/store/index.ts` — `configureStore` + 타입 훅(`useAppDispatch`, `useAppSelector`)
- `fe-app/store/counter-slice.ts` — 예시 슬라이스(counter)
- `fe-app/store/provider.tsx` — `"use client"` + `<Provider store={store}>`

## 레이아웃 연결
- 대상: `fe-app/app/layout.tsx`
- 조치: `import { StoreProvider } from "../store/provider";` 후 `<StoreProvider>{children}</StoreProvider>`로 감싼다.

## 테스트(권장)
- 위치: `fe-app/tests/store/counter-slice.test.ts`
- 검증: 초기값, `increment`/`decrement` 리듀서 동작

## 사용 원칙
- 전역 공유/교차 컴포넌트 상태에 Redux 사용
- 아톰/몰리큘 내부 직접 사용 지양, 상위(페이지/오거나니즘)에서 주입

## 검증 명령
- `npm run lint`
- `npm run test -- --run`
- `npm run dev`
