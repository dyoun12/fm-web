import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NoticeList } from "./notice-list";

describe("NoticeList", () => {
  it("공지 항목을 렌더링한다", () => {
    render(
      <NoticeList
        items={[
          {
            id: "1",
            title: "새로운 공지",
            category: "공지",
            publishedAt: "2025-10-01T00:00:00.000Z",
            href: "#",
          },
        ]}
      />,
    );
    expect(screen.getByText("새로운 공지")).toBeInTheDocument();
  });

  it("빈 상태 메시지를 표시한다", () => {
    render(<NoticeList items={[]} emptyMessage="현재 공지가 없습니다." />);
    expect(screen.getByText("현재 공지가 없습니다.")).toBeInTheDocument();
  });
});
