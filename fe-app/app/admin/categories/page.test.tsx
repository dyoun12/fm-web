import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import AdminCategoriesPage from "./page";
import React from "react";

const listCategoriesMock = vi.fn();
const createCategoryMock = vi.fn();
const updateCategoryMock = vi.fn();
const deleteCategoryMock = vi.fn();
const listPostsMock = vi.fn();

vi.mock("@/api/categories", () => ({
  listCategories: (...args: Parameters<typeof listCategoriesMock>) => listCategoriesMock(...args),
  createCategory: (...args: Parameters<typeof createCategoryMock>) => createCategoryMock(...args),
  updateCategory: (...args: Parameters<typeof updateCategoryMock>) => updateCategoryMock(...args),
  deleteCategory: (...args: Parameters<typeof deleteCategoryMock>) => deleteCategoryMock(...args),
}));

vi.mock("@/api/posts", () => ({
  listPosts: (...args: Parameters<typeof listPostsMock>) => listPostsMock(...args),
}));

const categoryFixture = {
  categoryId: "c1",
  name: "IR",
  slug: "ir",
  description: "",
  order: 1,
  createdAt: "now",
  updatedAt: "now",
};

function setupDefaultMocks() {
  listCategoriesMock.mockResolvedValue({ items: [categoryFixture] });
  createCategoryMock.mockResolvedValue(categoryFixture);
  updateCategoryMock.mockResolvedValue(categoryFixture);
  deleteCategoryMock.mockResolvedValue({ deleted: true, categoryId: "c1" });
}

describe("AdminCategoriesPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupDefaultMocks();
  });

  it("blocks deletion when related posts exist", async () => {
    listPostsMock.mockResolvedValue({
      items: [
        {
          postId: "p1",
          category: "ir",
          title: "분기 보고",
          content: "",
          createdAt: "now",
          updatedAt: "now",
        },
      ],
      count: 1,
    });

    render(<AdminCategoriesPage />);

    const editButton = await screen.findByRole("button", { name: "편집" });
    fireEvent.click(editButton);

    const deleteButtons = await screen.findAllByRole("button", { name: "삭제" });
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => expect(listPostsMock).toHaveBeenCalledWith({ category: "ir" }));

    const dialogs = screen.getAllByRole("dialog");
    const deleteModal = dialogs.find((dialog) => within(dialog).queryByText("연결된 게시물 보기 (1)"));
    expect(deleteModal).toBeDefined();
    const utils = within(deleteModal!);
    expect(utils.getByText("슬러그 'ir'에 포함된 게시물이 있어 삭제할 수 없습니다.")).toBeInTheDocument();
    expect(utils.getByRole("button", { name: "연결된 게시물 보기 (1)" })).toBeInTheDocument();
    expect(utils.queryByLabelText(/삭제 확인/)).not.toBeInTheDocument();
  });

  it("allows deletion when no related posts", async () => {
    listPostsMock.mockResolvedValue({ items: [], count: 0 });

    render(<AdminCategoriesPage />);

    const editButton = await screen.findByRole("button", { name: "편집" });
    fireEvent.click(editButton);
    const slugInput = await screen.findByLabelText(/슬러그/);
    expect(slugInput).toBeDisabled();

    const deleteButtons = await screen.findAllByRole("button", { name: "삭제" });
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => expect(listPostsMock).toHaveBeenCalled());

    const deleteConfirmButton = await screen.findByLabelText("IR 삭제 확인");
    fireEvent.click(deleteConfirmButton);

    await waitFor(() => expect(deleteCategoryMock).toHaveBeenCalledWith("c1"));
  });
});
