import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GlobalHeader } from "./global-header";

const navigation = [
  { label: "회사 소개", href: "/about" },
  { label: "공지사항", href: "/notice" },
];

describe("GlobalHeader", () => {
  it("내비게이션 항목을 렌더링한다", () => {
    render(<GlobalHeader navigation={navigation} />);
    expect(
      screen.getAllByRole("link", { name: "회사 소개" }).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByRole("link", { name: "공지사항" }).length,
    ).toBeGreaterThan(0);
  });

  it("모바일 메뉴를 토글한다", () => {
    render(<GlobalHeader navigation={navigation} />);
    const button = screen.getByRole("button", { name: "모바일 메뉴 토글" });
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
  });
});
