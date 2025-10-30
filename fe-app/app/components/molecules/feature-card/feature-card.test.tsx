import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FeatureCard } from "./feature-card";

describe("FeatureCard", () => {
  it("제목과 설명을 렌더링한다", () => {
    render(
      <FeatureCard
        title="글로벌 진출 전략"
        description="시장 조사부터 파트너 발굴까지 원스톱 지원"
      />,
    );
    expect(screen.getByText("글로벌 진출 전략")).toBeInTheDocument();
    expect(
      screen.getByText("시장 조사부터 파트너 발굴까지 원스톱 지원"),
    ).toBeInTheDocument();
  });
});
