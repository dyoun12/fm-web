import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ContactPage from "@/app/contact/page";

describe("/contact 페이지", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("문의 폼 제출 시 /api/contact로 POST 요청을 보낸다", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: async () => ({ success: true, data: { inquiryId: "id", createdAt: "now" } }),
    });
    // @ts-expect-error test override
    global.fetch = fetchMock;

    render(<ContactPage />);

    fireEvent.change(screen.getByLabelText("이름"), { target: { value: "홍길동" } });
    fireEvent.change(screen.getByLabelText("이메일"), { target: { value: "user@example.com" } });
    fireEvent.change(screen.getByLabelText("내용"), { target: { value: "문의드립니다." } });

    fireEvent.click(screen.getByRole("button", { name: "문의하기" }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/contact",
        expect.objectContaining({
          method: "POST",
        }),
      );
    });
  });
});

