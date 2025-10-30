import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { IconButton } from "./icon-button";

describe("IconButton", () => {
  it("아이콘 버튼을 렌더링한다", () => {
    render(
      <IconButton aria-label="즐겨찾기">★</IconButton>,
    );
    expect(screen.getByRole("button", { name: "즐겨찾기" })).toBeInTheDocument();
  });
});
