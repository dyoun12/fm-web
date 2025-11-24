import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import SiteFooter from "./site-footer";

const listCategoriesMock = vi.fn();

vi.mock("@/api/categories", () => ({
  listCategories: (...args: Parameters<typeof listCategoriesMock>) => listCategoriesMock(...args),
}));

vi.mock("next/navigation", async (actual) => {
  const real = await actual();
  return {
    ...real,
    usePathname: () => "/",
  };
});

vi.mock("@/app/hooks/use-corp-meta", () => ({
  useCorpMeta: () => null,
}));

describe("SiteFooter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("자료 영역에 카테고리 기반 링크를 렌더링한다", async () => {
    listCategoriesMock.mockResolvedValue({
      items: [
        {
          categoryId: "c1",
          name: "IR",
          slug: "ir",
          description: "",
          order: 1,
          createdAt: "now",
          updatedAt: "now",
        },
        {
          categoryId: "c2",
          name: "공지",
          slug: "notice",
          description: "",
          order: 2,
          createdAt: "now",
          updatedAt: "now",
        },
      ],
    });

    render(<SiteFooter />);

    await waitFor(() => {
      expect(screen.getByRole("link", { name: "IR" })).toHaveAttribute("href", "/posts?category=ir");
      expect(screen.getByRole("link", { name: "공지" })).toHaveAttribute("href", "/posts?category=notice");
    });
  });
});
