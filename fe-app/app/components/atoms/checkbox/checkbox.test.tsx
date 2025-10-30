import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Checkbox } from "./checkbox";

describe("Checkbox", () => {
  it("라벨과 함께 렌더링된다", () => {
    render(<Checkbox label="약관 동의" />);
    expect(screen.getByLabelText("약관 동의")).toBeInTheDocument();
  });

  it("체크 상태를 토글할 수 있다", () => {
    render(<Checkbox label="뉴스레터 구독" />);
    const checkbox = screen.getByLabelText("뉴스레터 구독") as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
  });
});
