import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Tag } from "./tag";

describe("Tag", () => {
  it("태그를 제거할 수 있다", () => {
    const onRemove = vi.fn();
    render(
      <Tag removable onRemove={onRemove}>
        선택
      </Tag>,
    );
    fireEvent.click(screen.getByRole("button", { name: "태그 제거" }));
    expect(onRemove).toHaveBeenCalled();
  });
});
