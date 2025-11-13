import { fireEvent, render, screen } from "@testing-library/react";
import { EntityDeleteModal } from "./entity-delete-modal";

describe("EntityDeleteModal", () => {
  it("shows blocking message and toggles related list", () => {
    render(
      <EntityDeleteModal
        open
        parentEntityDisplayName="IR 카테고리"
        parentEntityName="카테고리"
        parentEntityKeyLabel="슬러그"
        parentEntityKeyValue="ir"
        childEntityName="게시물"
        childEntityKey="title"
        relatedEntities={[{ id: "p1", title: "첫 번째 게시물", description: "작성자: admin" }]}
        onClose={() => undefined}
      />,
    );

    expect(screen.getByText("슬러그 'ir'에 포함된 게시물이 있어 삭제할 수 없습니다.")).toBeInTheDocument();
    const toggle = screen.getByRole("button", { name: "연결된 게시물 보기 (1)" });
    fireEvent.click(toggle);
    expect(screen.getByText("첫 번째 게시물")).toBeInTheDocument();
  });

  it("calls confirm handler when no relations", () => {
    const onConfirm = vi.fn();
    render(
      <EntityDeleteModal
        open
        parentEntityDisplayName="공지 카테고리"
        parentEntityName="카테고리"
        parentEntityKeyLabel="슬러그"
        parentEntityKeyValue="notice"
        childEntityName="게시물"
        childEntityKey="title"
        relatedEntities={[]}
        onClose={() => undefined}
        onConfirm={onConfirm}
      />,
    );

    fireEvent.click(screen.getByLabelText("공지 카테고리 삭제 확인"));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
