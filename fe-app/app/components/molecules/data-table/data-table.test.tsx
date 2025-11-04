import { render, screen } from "@testing-library/react";
import { DataTable } from "./data-table";

describe("DataTable", () => {
  it("renders table with rows", () => {
    render(
      <DataTable
        caption="테이블"
        columns={[{ key: "title", header: "제목" }]}
        rows={[{ title: "A" }]}
      />,
    );
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("A")).toBeInTheDocument();
  });
});

