import { render, screen } from "@testing-library/react";
import { StatCard } from "./stat-card";

it("renders label and value", () => {
  render(<StatCard label="전체 게시물" value="128" />);
  expect(screen.getByText("전체 게시물")).toBeInTheDocument();
  expect(screen.getByText("128")).toBeInTheDocument();
});

