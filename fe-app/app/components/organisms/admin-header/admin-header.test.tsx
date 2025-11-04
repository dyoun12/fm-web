import { render, screen } from "@testing-library/react";
import { AdminHeader } from "./admin-header";

describe("AdminHeader", () => {
  it("renders title and search input", () => {
    render(<AdminHeader title="대시보드" />);
    expect(screen.getByText("대시보드")).toBeInTheDocument();
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
  });
});

