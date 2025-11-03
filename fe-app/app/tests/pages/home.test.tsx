import { render, screen } from "@testing-library/react";
import Home from "../../page";

describe("Home page", () => {
  it("renders sections with headings", () => {
    const { container } = render(<Home />);
    expect(screen.getByRole("heading", { level: 1, name: /미래를 설계하는 FM Corp/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /주요 사업/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /최신 소식/i })).toBeInTheDocument();
    expect(container).toBeTruthy();
  });
});

