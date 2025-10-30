import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PostDetail } from "./post-detail";

describe("PostDetail", () => {
  it("게시물 제목과 내용을 렌더링한다", () => {
    render(
      <PostDetail
        title="테스트 게시물"
        category="공지"
        author="관리자"
        publishedAt="2025-10-01T00:00:00.000Z"
        content="<p>본문 내용</p>"
      />,
    );
    expect(screen.getByText("테스트 게시물")).toBeInTheDocument();
    expect(screen.getByText("본문 내용")).toBeInTheDocument();
  });
});
