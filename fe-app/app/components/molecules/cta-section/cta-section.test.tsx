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

  it("props로 버튼 테마와 텍스트 색상을 주입해 tone 계산을 덮어쓴다", () => {
    render(
      <CtaSection
        title="오버라이드 체크"
        description="테마 강제 적용"
        primaryAction={{ label: "주요 액션", href: "#" }}
        secondaryAction={{ label: "보조 액션", href: "#" }}
        tone="gradient" // 일반적으로 dark로 계산되지만
        textOnColor="light" // 텍스트는 밝은(검정) 톤으로 강제
        primaryButtonTheme="dark"
        secondaryButtonTheme="light"
      />,
    );

    // 텍스트 컬러는 상위 section에 적용됨
    const heading = screen.getByText("오버라이드 체크");
    const section = heading.closest("section");
    expect(section?.className).toContain("text-zinc-900");

    // 보조 버튼은 light 테마의 neutral ghost 스타일 일부를 포함
    const secondary = screen.getByRole("link", { name: "보조 액션" });
    expect(secondary.className).toContain("text-zinc-600");
  });
});
