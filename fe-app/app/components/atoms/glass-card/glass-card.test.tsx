import { render, screen } from "@testing-library/react";
import { GlassCard } from "./glass-card";

it("GlassCard 자식 내용을 렌더링한다", () => {
  render(<GlassCard>내용</GlassCard>);
  expect(screen.getByText("내용")).toBeInTheDocument();
});

