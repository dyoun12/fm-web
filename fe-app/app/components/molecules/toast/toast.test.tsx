import { render, screen } from "@testing-library/react";
import { Toast } from "./toast";

describe("Toast", () => {
  it("renders message", () => {
    render(<Toast message="알림" />);
    expect(screen.getByRole("status")).toHaveTextContent("알림");
  });
});

