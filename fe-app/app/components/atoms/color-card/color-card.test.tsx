import { render, screen } from "@testing-library/react";
import { ColorCard } from "./color-card";

it("컬러 카드를 렌더링한다", () => {
  render(<ColorCard tone="tint" color="blue">내용</ColorCard>);
  expect(screen.getByText("내용")).toBeInTheDocument();
});

