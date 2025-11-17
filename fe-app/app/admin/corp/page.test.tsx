import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AdminCorpMetaPage from "./page";
import React from "react";

const listCorpMetaMock = vi.fn();
const createCorpMetaMock = vi.fn();
const updateCorpMetaMock = vi.fn();
const deleteCorpMetaMock = vi.fn();

vi.mock("@/api/corp-meta", () => ({
  listCorpMeta: (...args: Parameters<typeof listCorpMetaMock>) => listCorpMetaMock(...args),
  createCorpMeta: (...args: Parameters<typeof createCorpMetaMock>) => createCorpMetaMock(...args),
  updateCorpMeta: (...args: Parameters<typeof updateCorpMetaMock>) => updateCorpMetaMock(...args),
  deleteCorpMeta: (...args: Parameters<typeof deleteCorpMetaMock>) => deleteCorpMetaMock(...args),
}));

const corpMetaFixture = {
  corpMetaId: "corp-1",
  address: "서울특별시 서초구 123",
  corpNum: "123-45-67890",
  ceo: "홍길동",
  email: "contact@familycorp.com",
  hp: "02-1234-5678",
  createdAt: "now",
  updatedAt: "now",
};

function setupDefaultMocks() {
  listCorpMetaMock.mockResolvedValue({ items: [corpMetaFixture], count: 1 });
  createCorpMetaMock.mockResolvedValue({
    ...corpMetaFixture,
    corpMetaId: "corp-2",
    address: "서울 본사",
  });
  updateCorpMetaMock.mockResolvedValue(corpMetaFixture);
  deleteCorpMetaMock.mockResolvedValue({ deleted: true, corpMetaId: corpMetaFixture.corpMetaId });
}

describe("AdminCorpMetaPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupDefaultMocks();
  });

  it("renders existing corp meta data", async () => {
    render(<AdminCorpMetaPage />);
    expect(await screen.findByText(corpMetaFixture.corpNum)).toBeInTheDocument();
    expect(screen.getByText(corpMetaFixture.ceo)).toBeInTheDocument();
  });

  it("disables creating when a company record already exists", async () => {
    render(<AdminCorpMetaPage />);
    const registerButton = await screen.findByRole("button", { name: "회사 정보 등록" });
    expect(registerButton).toBeDisabled();
    expect(
      screen.getByText(/추가 등록은 불가하며, 기존 정보를 삭제한 다음 다시 등록하세요\./),
    ).toBeInTheDocument();
  });

  it("creates corp meta entries", async () => {
    listCorpMetaMock.mockResolvedValueOnce({ items: [], count: 0 });
    const created = {
      ...corpMetaFixture,
      corpMetaId: "corp-10",
      address: "부산광역시 해운대구",
    };
    createCorpMetaMock.mockResolvedValueOnce(created);

    render(<AdminCorpMetaPage />);

    const createButtons = await screen.findAllByRole("button", { name: "회사 정보 등록" });
    fireEvent.click(createButtons[0]);

    fireEvent.change(await screen.findByLabelText("주소"), { target: { value: created.address } });
    fireEvent.change(screen.getByLabelText("사업자등록번호"), { target: { value: created.corpNum } });
    fireEvent.change(screen.getByLabelText("대표자"), { target: { value: created.ceo } });
    fireEvent.change(screen.getByLabelText("이메일"), { target: { value: created.email } });
    fireEvent.change(screen.getByLabelText("대표 전화"), { target: { value: created.hp } });

    const submitButton = await screen.findByRole("button", { name: "등록" });
    fireEvent.click(submitButton);

    await waitFor(() => expect(createCorpMetaMock).toHaveBeenCalledWith({
      address: created.address,
      corpNum: created.corpNum,
      ceo: created.ceo,
      email: created.email,
      hp: created.hp,
    }));
    expect(await screen.findByText(created.address)).toBeInTheDocument();
  });

  it("updates corp meta entries", async () => {
    render(<AdminCorpMetaPage />);

    const editButton = await screen.findByRole("button", { name: "편집" });
    fireEvent.click(editButton);

    const phoneInput = await screen.findByLabelText("대표 전화");
    fireEvent.change(phoneInput, { target: { value: "02-8765-4321" } });

    const saveButton = await screen.findByRole("button", { name: "저장" });
    fireEvent.click(saveButton);

    await waitFor(() =>
      expect(updateCorpMetaMock).toHaveBeenCalledWith(
        corpMetaFixture.corpMetaId,
        expect.objectContaining({ hp: "02-8765-4321" }),
      ),
    );
  });

  it("deletes corp meta entries", async () => {
    render(<AdminCorpMetaPage />);

    const deleteButton = await screen.findByRole("button", { name: "삭제" });
    fireEvent.click(deleteButton);

    const confirmButton = await screen.findByLabelText("회사 정보 삭제 확인");
    fireEvent.click(confirmButton);

    await waitFor(() => expect(deleteCorpMetaMock).toHaveBeenCalledWith(corpMetaFixture.corpMetaId));
  });
});
