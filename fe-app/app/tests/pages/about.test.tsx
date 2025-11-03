import { render, screen } from "@testing-library/react";
import AboutPage from "../../about/page";

describe("About page", () => {
  it("renders overview, history and team sections with headings", () => {
    render(<AboutPage />);
    expect(screen.getByRole("heading", { level: 1, name: /회사 소개/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /연혁/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /팀/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /오시는 길/i })).toBeInTheDocument();
  });
});

