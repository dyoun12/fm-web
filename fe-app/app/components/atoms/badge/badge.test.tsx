import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./badge";

describe("Badge", () => {
  it("텍스트를 렌더링한다", () => {
    render(<Badge>공지</Badge>);
    expect(screen.getByText("공지")).toBeInTheDocument();
  });
});
