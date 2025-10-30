import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Tooltip } from "./tooltip";

describe("Tooltip", () => {
  it("포커스 시 툴팁을 표시한다", () => {
    render(
      <Tooltip content="설명">
        <button type="button">버튼</button>
      </Tooltip>,
    );
    fireEvent.focus(screen.getByRole("button"));
    expect(screen.getByRole("tooltip")).toHaveTextContent("설명");
  });
});
