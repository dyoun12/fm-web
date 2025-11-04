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
});

