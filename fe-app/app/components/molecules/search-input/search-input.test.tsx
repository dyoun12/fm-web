import { render, screen } from "@testing-library/react";
import { SearchInput } from "./search-input";

describe("SearchInput", () => {
  it("renders input with aria-label", () => {
    render(<SearchInput aria-label="검색" />);
    expect(screen.getByRole("searchbox", { name: "검색" })).toBeInTheDocument();
  });
});

