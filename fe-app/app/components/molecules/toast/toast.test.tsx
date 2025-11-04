import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Toast } from "./toast";

describe("Toast", () => {
  it("renders message", () => {
    render(<Toast message="알림" />);
    expect(screen.getByRole("status")).toHaveTextContent("알림");
  });
  it("closes when close button clicked and calls onClose", () => {
    const onClose = vi.fn();
    render(<Toast message="닫기" close onClose={onClose} />);
    const btn = screen.getByRole("button", { name: "닫기" });
    fireEvent.click(btn);
    expect(onClose).toHaveBeenCalled();
  });
});
