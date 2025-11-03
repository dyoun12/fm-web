import { render, screen } from "@testing-library/react";
import VisionPage from "../../vision/page";

describe("Vision page", () => {
  it("renders mission/vision/values with main heading", () => {
    render(<VisionPage />);
    expect(screen.getByRole("heading", { level: 1, name: /비전/i })).toBeInTheDocument();
    expect(screen.getByText(/사람 중심의 기술/i)).toBeInTheDocument();
  });
});

