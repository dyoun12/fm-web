import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TextLink } from "./text-link";

describe("TextLink", () => {
  it("링크를 렌더링한다", () => {
    render(<TextLink href="#">문서 보기</TextLink>);
    const link = screen.getByRole("link", { name: "문서 보기" });
    expect(link).toBeInTheDocument();
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
  });
});

