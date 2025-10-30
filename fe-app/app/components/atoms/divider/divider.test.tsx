import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Divider } from "./divider";

describe("Divider", () => {
  it("라벨을 포함한 구분선을 렌더링한다", () => {
    render(<Divider label="또는" />);
    expect(screen.getByText("또는")).toBeInTheDocument();
  });
});
