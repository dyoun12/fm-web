import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LogoDescription } from "./logo-description";

describe("LogoDescription", () => {
  it("제목/설명과 우측 이미지가 렌더링된다", () => {
    render(
      <LogoDescription
        title="브랜드 로고 소개"
        description="타이포 베이스의 심플한 로고타입"
        imageUrl="/logo.png"
        imageAlt="브랜드 로고"
      />,
    );
    expect(screen.getByText("브랜드 로고 소개")).toBeInTheDocument();
    expect(screen.getByText("타이포 베이스의 심플한 로고타입")).toBeInTheDocument();
    const img = screen.getByAltText("브랜드 로고");
    expect(img).toBeInTheDocument();
  });
});

