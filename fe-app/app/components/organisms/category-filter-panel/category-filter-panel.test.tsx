import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CategoryFilterPanel } from "./category-filter-panel";

const categories = [
  { id: "notice", label: "공지", count: 3 },
  { id: "ir", label: "IR", count: 2 },
];

describe("CategoryFilterPanel", () => {
  it("필터 선택을 콜백으로 전달한다", () => {
    const handleChange = vi.fn();
    render(
      <CategoryFilterPanel
        categories={categories}
        onFilterChange={handleChange}
      />,
    );
    const checkbox = screen.getByLabelText("공지");
    fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalledWith(["notice"]);
  });
});
