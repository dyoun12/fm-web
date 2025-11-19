import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BrandColorPalette } from "./brand-color-palette";

describe("BrandColorPalette", () => {
  it("팔레트와 설명이 렌더링된다", () => {
    const palette = [
      { name: "Primary", hex: "#2563EB" },
      { name: "Secondary", hex: "#10B981" },
    ];
    render(
      <BrandColorPalette
        title="브랜드 컬러 팔레트"
        description="브랜드 가이드"
        palette={palette}
      />,
    );
    expect(screen.getByText("브랜드 컬러 팔레트")).toBeInTheDocument();
    expect(screen.getByText("브랜드 가이드")).toBeInTheDocument();
    expect(screen.getByText("Primary")).toBeInTheDocument();
    expect(screen.getByText("Secondary")).toBeInTheDocument();
  });

  it("커스텀 bullets를 표시한다", () => {
    const palette = [{ name: "Primary", hex: "#2563EB" }];
    render(
      <BrandColorPalette
        title="브랜드 컬러 팔레트"
        description="브랜드 컬러 의미"
        palette={palette}
        bullets={["신뢰를 상징하는 블루", "지속 가능성을 나타내는 그린"]}
      />,
    );

    expect(screen.getByText("신뢰를 상징하는 블루")).toBeInTheDocument();
    expect(screen.getByText("지속 가능성을 나타내는 그린")).toBeInTheDocument();
  });
});
