import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminPostEditPage from "./page";
import React from "react";

const push = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => new URLSearchParams(),
}));

const createPost = vi.fn(async () => ({ postId: "p1" }));
vi.mock("@/api/posts", () => ({
  createPost,
  updatePost: vi.fn(),
  getPost: vi.fn(),
}));

describe("AdminPostEditPage", () => {
  it("creates a post and redirects to list", async () => {
    render(<AdminPostEditPage />);
    fireEvent.change(screen.getByLabelText("제목"), { target: { value: "t" } });
    fireEvent.change(screen.getByLabelText("카테고리"), { target: { value: "ir" } });
    fireEvent.change(screen.getByLabelText("본문"), { target: { value: "body" } });
    fireEvent.click(screen.getByRole("button", { name: "저장" }));
    await waitFor(() => expect(createPost).toHaveBeenCalled());
    await waitFor(() => expect(push).toHaveBeenCalledWith("/admin/posts"));
  });
});

