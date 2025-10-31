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

  it("label 미주입 시 텍스트/라벨 요소를 렌더하지 않는다", () => {
    const { container } = render(<Toggle checked={false} />);
    // 라벨용 클래스가 존재하지 않아야 한다
    expect(container.querySelector(".text-sm.text-zinc-600")).toBeNull();
  });

  it("label 주입 시 텍스트가 표시된다", () => {
    render(<Toggle checked={false} label="알림" />);
    expect(screen.getByText("알림")).toBeInTheDocument();
  });
});
