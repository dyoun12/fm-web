import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, vi, expect } from "vitest";
import { MenuItem } from "./menu-item";

describe("MenuItem", () => {
  it("renders with icon and label", () => {
    render(
      <MenuItem>
        <i className="ri-settings-3-line" aria-hidden="true" /> 환경설정
      </MenuItem>
    );
    expect(screen.getByRole("menuitem")).toBeInTheDocument();
    expect(screen.getByText("환경설정")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const onClick = vi.fn();
    render(<MenuItem onClick={onClick}>테스트</MenuItem>);
    fireEvent.click(screen.getByRole("menuitem"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

