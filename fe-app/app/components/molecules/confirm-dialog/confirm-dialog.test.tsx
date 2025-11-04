import { render, screen } from "@testing-library/react";
import { ConfirmDialog } from "./confirm-dialog";

describe("ConfirmDialog", () => {
  it("renders when open", () => {
    render(<ConfirmDialog open title="확인" />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});

