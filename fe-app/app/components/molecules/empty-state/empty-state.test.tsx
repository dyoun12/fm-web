import { render, screen } from "@testing-library/react";
import { EmptyState } from "./empty-state";

describe("EmptyState", () => {
  it("renders title and optional description", () => {
    render(<EmptyState title="없음" description="설명" />);
    expect(screen.getByText("없음")).toBeInTheDocument();
    expect(screen.getByText("설명")).toBeInTheDocument();
  });
});

