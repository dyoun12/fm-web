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

  it("align=right일 때 제목 줄이 우측 정렬되고 헤더가 우측 정렬된다", () => {
    render(
      <TimelineItem
        year="2024"
        title="해외 진출"
        description="3개국 프로젝트 런칭"
        align="right"
      />,
    );
    const titleEl = screen.getByText("해외 진출");
    expect(titleEl.parentElement?.className).toContain("justify-end");
    // Card 컨테이너에 text-right가 적용되어 텍스트가 우측 정렬됨
    const header = titleEl.parentElement as HTMLElement;
    const card = header.parentElement as HTMLElement;
    expect(card.className).toContain("text-right");
  });
});
