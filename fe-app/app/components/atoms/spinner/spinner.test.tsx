import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Spinner } from "./spinner";

describe("Spinner", () => {
  it("기본 크기로 렌더링된다", () => {
    render(<Spinner data-testid="spinner" />);
    const spinner = screen.getByTestId("spinner");
    expect(spinner).toHaveAttribute("role", "status");
  });
});
