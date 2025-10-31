import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card } from "./card";

describe("Card", () => {
  it("자식 콘텐츠를 렌더링한다", () => {
    render(
      <Card>
        <span>내용</span>
      </Card>,
    );
    expect(screen.getByText("내용")).toBeInTheDocument();
  });

  it("variant에 따라 클래스가 달라진다 (elevated)", () => {
    const { container } = render(<Card variant="elevated">e</Card>);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toMatch(/shadow/);
  });
});

