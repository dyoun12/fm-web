import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HeroBanner } from "./hero-banner";

describe("HeroBanner", () => {
  it("제목과 부제목을 렌더링한다", () => {
    render(
      <HeroBanner
        title="법인 메인 페이지"
        subtitle="브랜드 정체성과 사업을 전달합니다."
      />,
    );
    expect(screen.getByText("법인 메인 페이지")).toBeInTheDocument();
    expect(
      screen.getByText("브랜드 정체성과 사업을 전달합니다."),
    ).toBeInTheDocument();
  });
});
