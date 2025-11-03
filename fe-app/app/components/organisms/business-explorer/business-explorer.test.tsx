import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { BusinessExplorer } from "./business-explorer";

describe("BusinessExplorer", () => {
  const items = [
    { key: "a", title: "A", content: <p>Alpha</p> },
    { key: "b", title: "B", content: <p>Beta</p> },
  ];

  it("초기 활성 항목의 컨텐츠를 보여준다", () => {
    render(<BusinessExplorer items={items} />);
    expect(screen.getByText("Alpha")).toBeInTheDocument();
  });

  it("카드 클릭 시 하단 컨텐츠가 변경된다", () => {
    render(<BusinessExplorer items={items} />);
    fireEvent.click(screen.getByRole("button", { name: /B/ }));
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });
});

