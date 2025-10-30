import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TimelineItem } from "./timeline-item";

describe("TimelineItem", () => {
  it("연도와 설명을 렌더링한다", () => {
    render(
      <TimelineItem
        year="2025"
        title="새로운 프로젝트"
        description="테스트 설명"
      />,
    );
    expect(screen.getByText("2025")).toBeInTheDocument();
    expect(screen.getByText("새로운 프로젝트")).toBeInTheDocument();
  });
});
