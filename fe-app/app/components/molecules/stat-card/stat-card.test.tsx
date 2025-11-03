import { render, screen } from "@testing-library/react";
import { StatCard } from "./stat-card";

it("renders label and value", () => {
  render(<StatCard label="전체 게시물" value="128" />);
  expect(screen.getByText("전체 게시물")).toBeInTheDocument();
  expect(screen.getByText("128")).toBeInTheDocument();
});

it("옵션 그래프가 있으면 스파크라인을 렌더링한다", () => {
  render(
    <StatCard
      label="일간 방문자"
      value="1,284"
      graph={{ data: [1, 2, 1.5, 3, 2.7, 4] }}
    />,
  );
  expect(screen.getByTestId("statcard-graph")).toBeInTheDocument();
});
