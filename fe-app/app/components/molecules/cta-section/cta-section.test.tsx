import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CtaSection } from "./cta-section";

describe("CtaSection", () => {
  it("CTA 제목과 버튼을 렌더링한다", () => {
    render(
      <CtaSection
        title="프로젝트 상담"
        primaryAction={{ label: "상담 신청", href: "#" }}
      />,
    );
    expect(screen.getByText("프로젝트 상담")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "상담 신청" }),
    ).toBeInTheDocument();
  });

  it("primary 버튼은 흰색 배경(white pill)을 사용한다", () => {
    render(
      <CtaSection
        title="프로젝트 상담"
        primaryAction={{ label: "상담 신청", href: "#" }}
      />,
    );
    const primary = screen.getByRole("link", { name: "상담 신청" });
    expect(primary.className).toContain("bg-white");
  });
});
