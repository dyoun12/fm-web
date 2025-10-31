import reducer, { increment, decrement } from "@/store/counter-slice";

describe("counter-slice", () => {
  it("initial state → 0", () => {
    // @ts-expect-error init action shape
    expect(reducer(undefined, { type: "__init__" })).toEqual({ value: 0 });
  });

  it("increment", () => {
    expect(reducer({ value: 0 }, increment())).toEqual({ value: 1 });
  });

  it("decrement", () => {
    expect(reducer({ value: 1 }, decrement())).toEqual({ value: 0 });
  });
});

