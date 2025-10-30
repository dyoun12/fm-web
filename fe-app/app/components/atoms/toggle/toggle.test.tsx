import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Toggle } from "./toggle";

describe("Toggle", () => {
  it("스위치 상태를 토글한다", () => {
    const handleChange = vi.fn();
    render(<Toggle checked={false} onCheckedChange={handleChange} />);
    fireEvent.click(screen.getByRole("switch"));
    expect(handleChange).toHaveBeenCalledWith(true);
  });
});
