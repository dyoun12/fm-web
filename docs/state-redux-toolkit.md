# Redux Toolkit 상태관리 가이드

본 문서는 Redux Toolkit(RTK)과 React-Redux를 `fe-app`에 도입하고 사용하는 방법을 정의합니다. 설치, 폴더 구조, Provider 연결, 컴포넌트 사용 예시, 테스트 샘플을 포함합니다.

## 1) 설치(Dependencies)

- 명령어(프로젝트 루트에서 실행):
  - `cd fe-app && npm i @reduxjs/toolkit react-redux`

## 2) 폴더 구조(저장 위치)

- 스토어/슬라이스: `fe-app/store`
  - `fe-app/store/index.ts` — 루트 스토어 설정, 타입/훅(`useAppDispatch`, `useAppSelector`) 제공
  - `fe-app/store/counter-slice.ts` — 예시 슬라이스(counter)
  - `fe-app/store/provider.tsx` — Redux Provider 래퍼(클라이언트 컴포넌트)

## 3) 스토어 구성 코드

- `fe-app/store/index.ts`

```ts
import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import counterReducer from "./counter-slice";

export const store = configureStore({
  reducer: { counter: counterReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

- `fe-app/store/counter-slice.ts`

```ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CounterState = { value: number };
const initialState: CounterState = { value: 0 };

const slice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (s) => void (s.value += 1),
    decrement: (s) => void (s.value -= 1),
    addBy: (s, a: PayloadAction<number>) => void (s.value += a.payload),
    reset: (s) => void (s.value = 0),
  },
});

export const { increment, decrement, addBy, reset } = slice.actions;
export default slice.reducer;
```

## 4) Provider 연결(사용 위치)

- 연결 파일: `fe-app/app/layout.tsx`
- 방법: 루트 레이아웃에서 Redux Provider로 전체 앱을 감싼다.

```tsx
import { StoreProvider } from "../store/provider";

<body className="...">
  <StoreProvider>{children}</StoreProvider>
</body>
```

> 참고: Provider 컴포넌트는 클라이언트 컴포넌트(`"use client"`)로 구현되어 있습니다. 위치: `fe-app/store/provider.tsx`

## 5) 컴포넌트 사용 예시(어떻게 사용할지)

- 권장 위치: UI 컴포넌트는 Atomic Design을 따릅니다. 상태 의존 로직은 가능하면 상위 컨테이너(페이지/오거나니즘)에 두고, 아톰/몰리큘은 props로 전달받는 패턴을 우선합니다.
- 예시(페이지나 오거나니즘에서 직접 사용):

```tsx
// 예: fe-app/app/example/page.tsx (샘플)
"use client";
import { useAppDispatch, useAppSelector } from "@/store";
import { increment, decrement } from "@/store/counter-slice";

export default function ExamplePage() {
  const value = useAppSelector((s) => s.counter.value);
  const dispatch = useAppDispatch();
  return (
    <div className="space-y-4">
      <p className="text-lg">Count: {value}</p>
      <div className="flex gap-2">
        <button className="px-3 py-1 border" onClick={() => dispatch(increment())}>+1</button>
        <button className="px-3 py-1 border" onClick={() => dispatch(decrement())}>-1</button>
      </div>
    </div>
  );
}
```

> 아톰/몰리큘 내부에서 직접 Redux 훅을 사용하는 것은 지양합니다. 상위 레이어(오거나니즘/페이지)에서 값을 계산·제어 후, 하위 컴포넌트에는 명시적 props로 전달합니다.

## 6) 언제 Redux를 쓸지(어디서 사용해야 하는지)

- 전역 공유 상태: 다수의 페이지/오거나니즘에서 참조하는 값(예: 인증, 테마, 알림 카운트)
- 서버/클라이언트 경계 조율: 서버 페치 후 클라이언트 상호작용이 많은 경우(optimistic update 등)
- 복합 상호작용: 여러 컴포넌트/이벤트가 하나의 상태에 영향을 주는 경우
- 로컬 UI 상태는 React 훅(`useState`, `useReducer`)을 우선하고, 전역 상태 필요시 Redux로 승격합니다.

## 7) 테스트(샘플)

- 위치: `fe-app/tests/store/counter-slice.test.ts`
- 주요 검증: reducer 순수성(increment/decrement), 초기값

```ts
import reducer, { increment, decrement } from "@/store/counter-slice";

describe("counter-slice", () => {
  it("initial state → 0", () => {
    expect(reducer(undefined, { type: "__init__" })).toEqual({ value: 0 });
  });
  it("increment", () => {
    expect(reducer({ value: 0 }, increment())).toEqual({ value: 1 });
  });
  it("decrement", () => {
    expect(reducer({ value: 1 }, decrement())).toEqual({ value: 0 });
  });
});
```

## 8) 린트/테스트/실행

- `npm run lint` — 타입/ESLint 검사(경고도 실패 처리)
- `npm run test -- --run` — Vitest 단위 테스트 실행
- `npm run dev` — Next(3000) + Storybook(6006) 동시 실행

## 9) 네이밍/경로 규칙(요약)

- 파일명: kebab-case, 컴포넌트 export: PascalCase, 훅: camelCase
- 스토어는 `fe-app/store`, 컴포넌트는 `fe-app/app/components/{atoms|molecules|organisms}`

