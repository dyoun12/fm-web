import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NewsTicker } from "./news-ticker";

const items = [
  { id: "1", title: "첫 번째 소식", href: "#", category: "공지" },
  { id: "2", title: "두 번째 소식", href: "#", category: "IR" },
];

describe("NewsTicker", () => {
  it("소식을 렌더링하고 인디케이터로 전환한다", () => {
    render(<NewsTicker items={items} autoplay={false} />);
    expect(screen.getByText("첫 번째 소식")).toBeInTheDocument();

    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[1]);
    expect(buttons[1]).toHaveAttribute(
      "aria-label",
      "2번째 소식 보기",
    );
  });
});
