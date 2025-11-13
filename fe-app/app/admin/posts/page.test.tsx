import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import AdminPostsPage from "./page";
import React from "react";

const listPostsMock = vi.fn();
const createPostMock = vi.fn();
const updatePostMock = vi.fn();
const deletePostMock = vi.fn();
const listCategoriesMock = vi.fn();

vi.mock("@/api/posts", () => ({
  listPosts: (...args: Parameters<typeof listPostsMock>) => listPostsMock(...args),
  createPost: (...args: Parameters<typeof createPostMock>) => createPostMock(...args),
  updatePost: (...args: Parameters<typeof updatePostMock>) => updatePostMock(...args),
  deletePost: (...args: Parameters<typeof deletePostMock>) => deletePostMock(...args),
}));
vi.mock("@/api/categories", () => ({
  listCategories: (...args: Parameters<typeof listCategoriesMock>) => listCategoriesMock(...args),
}));

const categoriesFixture = [
  { categoryId: "c1", name: "IR", slug: "ir", description: "", order: 1, createdAt: "now", updatedAt: "now" },
  { categoryId: "c2", name: "공지", slug: "notice", description: "", order: 2, createdAt: "now", updatedAt: "now" },
];

describe("AdminPostsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    listPostsMock.mockResolvedValue({ items: [], count: 0 });
    listCategoriesMock.mockResolvedValue({ items: categoriesFixture });
    createPostMock.mockResolvedValue({
      postId: "p-new",
      category: "ir",
      title: "신규",
      content: "본문",
      author: "admin",
      createdAt: "now",
      updatedAt: "now",
    });
    updatePostMock.mockResolvedValue({
      postId: "p-1",
      category: "ir",
      title: "업데이트",
      content: "내용",
      author: "writer",
      createdAt: "now",
      updatedAt: "now",
    });
    deletePostMock.mockResolvedValue({ deleted: true, postId: "p-1" });
  });

  it("opens modal via empty state and creates a post", async () => {
    render(<AdminPostsPage />);
    expect(await screen.findByText("게시물이 없습니다")).toBeInTheDocument();

    const createButtons = await screen.findAllByRole("button", { name: "새 게시물" });
    fireEvent.click(createButtons[0]);

    const dialog = await screen.findByRole("dialog");
    const dialogUtils = within(dialog);

    fireEvent.change(await dialogUtils.findByLabelText(/제목/), { target: { value: "새 제목" } });
    fireEvent.change(await dialogUtils.findByLabelText(/카테고리/), { target: { value: "ir" } });
    fireEvent.change(await dialogUtils.findByLabelText(/본문/), { target: { value: "본문 내용" } });

    fireEvent.click(screen.getByRole("button", { name: "게시물 생성" }));

    await waitFor(() =>
      expect(createPostMock).toHaveBeenCalledWith({
        title: "새 제목",
        category: "ir",
        content: "본문 내용",
        thumbnailUrl: undefined,
        author: undefined,
      })
    );
  });

  it("edits an existing post and saves changes", async () => {
    const existing = {
      postId: "p-1",
      category: "ir",
      title: "기존 제목",
      content: "기존 본문",
      author: "writer",
      createdAt: "now",
      updatedAt: "now",
    };
    listPostsMock.mockResolvedValue({ items: [existing], count: 1 });

    render(<AdminPostsPage />);

    const editButton = await screen.findByRole("button", { name: "편집" });
    fireEvent.click(editButton);

    const dialog = await screen.findByRole("dialog");
    const dialogUtils = within(dialog);
    expect(dialogUtils.getByDisplayValue("기존 제목")).toBeInTheDocument();

    fireEvent.change(await dialogUtils.findByLabelText(/제목/), { target: { value: "수정 제목" } });
    fireEvent.change(await dialogUtils.findByLabelText(/본문/), { target: { value: "수정 본문" } });
    fireEvent.click(dialogUtils.getByRole("button", { name: "변경 사항 저장" }));

    await waitFor(() =>
      expect(updatePostMock).toHaveBeenCalledWith("p-1", {
        title: "수정 제목",
        category: "ir",
        content: "수정 본문",
        thumbnailUrl: undefined,
        author: "writer",
      })
    );
  });

  it("deletes an existing post through the modal", async () => {
    const existing = {
      postId: "p-1",
      category: "ir",
      title: "기존 제목",
      content: "기존 본문",
      author: "writer",
      createdAt: "now",
      updatedAt: "now",
    };
    listPostsMock.mockResolvedValue({ items: [existing], count: 1 });

    render(<AdminPostsPage />);

    const editButton = await screen.findByRole("button", { name: "편집" });
    fireEvent.click(editButton);
    const dialog = await screen.findByRole("dialog");
    const dialogUtils = within(dialog);

    fireEvent.click(dialogUtils.getByRole("button", { name: "삭제" }));

    const deleteModalButton = await screen.findByLabelText("기존 제목 삭제 확인");
    fireEvent.click(deleteModalButton);

    await waitFor(() => expect(deletePostMock).toHaveBeenCalledWith("p-1"));
  });
});
