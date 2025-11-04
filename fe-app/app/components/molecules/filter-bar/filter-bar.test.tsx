import { render, screen } from "@testing-library/react";
import { FilterBar } from "./filter-bar";

describe("FilterBar", () => {
  it("renders children", () => {
    render(<FilterBar><span>필터</span></FilterBar>);
    expect(screen.getByText("필터")).toBeInTheDocument();
  });
});

