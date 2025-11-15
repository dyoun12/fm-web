import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PostList } from "./post-list";

describe("PostList", () => {
  it("공지 항목을 렌더링한다", () => {
    render(
      <PostList
        items={[
          {
            postId: "1",
            title: "새로운 공지",
            category: "공지",
            createdAt: "2025-10-01T00:00:00.000Z",
            updatedAt: "2025-10-01T00:00:00.000Z",
            summary: "test summary 입니다."
          },
        ]}
      />,
    );
    expect(screen.getByText("새로운 공지")).toBeInTheDocument();
  });

  it("빈 상태 메시지를 표시한다", () => {
    render(<PostList items={[]} emptyMessage="현재 공지가 없습니다." />);
    expect(screen.getByText("현재 공지가 없습니다.")).toBeInTheDocument();
  });
});
