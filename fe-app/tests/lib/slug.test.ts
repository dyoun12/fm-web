import { describe, expect, it } from "vitest";
import { slugify } from "@/lib/slug";

describe("slugify", () => {
  it("lowercases and trims whitespace", () => {
    expect(slugify("  Hello World  ")).toBe("hello-world");
  });

  it("preserves korean letters while removing punctuation", () => {
    expect(slugify("IR & 공지!")).toBe("ir-공지");
  });

  it("collapses multiple separators", () => {
    expect(slugify("뉴스---2025   01")).toBe("뉴스-2025-01");
  });
});
