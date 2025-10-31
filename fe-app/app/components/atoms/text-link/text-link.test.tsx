import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TextLink } from "./text-link";

describe("TextLink", () => {
  it("링크를 렌더링한다", () => {
    render(<TextLink href="#">문서 보기</TextLink>);
    const link = screen.getByRole("link", { name: "문서 보기" });
    expect(link).toBeInTheDocument();
    // 내부 링크에도 외부 아이콘을 표시한다(왼쪽 배치)
    const icon = (link as HTMLElement).querySelector("i.ri-external-link-line");
    expect(icon).not.toBeNull();
  });

  it("외부 링크는 noopener를 추가한다", () => {
    render(
      <TextLink href="https://example.com" target="_blank">
        외부 링크
      </TextLink>,
    );
    const link = screen.getByRole("link", { name: "외부 링크" });
    expect(link).toHaveAttribute("rel");
    expect(link.getAttribute("rel")).toMatch(/noopener/);
    // external 아이콘 존재(접근성 이름에는 영향 없음)
    const icon = (link as HTMLElement).querySelector("i.ri-external-link-line");
    expect(icon).not.toBeNull();
  });

  it("아이콘은 텍스트 왼쪽에 위치하고, 텍스트 색을 상속한다", () => {
    render(<TextLink href="#">링크</TextLink>);
    const link = screen.getByRole("link", { name: "링크" });
    const firstEl = (link as HTMLElement).firstElementChild as HTMLElement | null;
    expect(firstEl?.tagName.toLowerCase()).toBe("i");
    // 색상 상속(`text-current`) 적용 확인
    expect(firstEl?.className).toMatch(/text-\[0\.95em\]/);
    expect(firstEl?.className).toMatch(/text-current/);
  });

  it("showIcon=false 일 때 아이콘을 렌더링하지 않는다", () => {
    render(
      <TextLink href="#" showIcon={false}>
        텍스트
      </TextLink>,
    );
    const link = screen.getByRole("link", { name: "텍스트" });
    const icon = (link as HTMLElement).querySelector("i.ri-external-link-line");
    expect(icon).toBeNull();
  });

  it("기본은 언더라인이 없고 hover에서도 나타나지 않는다", () => {
    render(<TextLink href="#">링크</TextLink>);
    const link = screen.getByRole("link", { name: "링크" });
    expect(link).toHaveClass("no-underline");
    expect(link.className).not.toMatch(/hover:underline/);
    // 링크 컬러 토큰 적용
    expect(link.className).toMatch(/text-\[var\(--link-color\)\]/);
    expect(link.className).toMatch(/hover:text-\[var\(--link-color-hover\)\]/);
  });

  it("visited 상태에서 색상 변경 및 언더라인이 제거되도록 클래스를 포함한다", () => {
    render(<TextLink href="#">방문 링크</TextLink>);
    const link = screen.getByRole("link", { name: "방문 링크" });
    expect(link).toHaveClass("visited:no-underline");
    // 방문 후에도 링크 컬러 유지
    expect(link.className).toMatch(/visited:text-\[var\(--link-color\)\]/);
  });
});
