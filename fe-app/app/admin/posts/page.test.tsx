import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminPostsPage from "./page";
import React from "react";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

vi.mock("@/api/posts", () => ({
  listPosts: vi.fn(async () => ({ items: [], count: 0 })),
  deletePost: vi.fn(async () => ({ deleted: true, postId: "x" })),
}));
vi.mock("@/api/categories", () => ({
  listCategories: vi.fn(async () => ({ items: [
    { categoryId: "c1", name: "IR", slug: "ir", createdAt: "", updatedAt: "" },
    { categoryId: "c2", name: "공지", slug: "notice", createdAt: "", updatedAt: "" },
  ] })),
}));

describe("AdminPostsPage", () => {
  it("renders empty state and navigates to edit on action", async () => {
    render(<AdminPostsPage />);
    expect(await screen.findByText("게시물이 없습니다")).toBeInTheDocument();
    const btn = await screen.findByRole("button", { name: "새 게시물" });
    fireEvent.click(btn);
    await waitFor(() => expect(push).toHaveBeenCalledWith("/admin/posts/edit"));
  });
});
