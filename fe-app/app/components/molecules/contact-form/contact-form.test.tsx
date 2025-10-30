import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ContactForm } from "./contact-form";

const fields = [
  { id: "name", label: "이름", type: "text", required: true },
  { id: "email", label: "이메일", type: "email", required: true },
  { id: "message", label: "문의 내용", type: "textarea", required: true },
] as const;

describe("ContactForm", () => {
  it("필드를 렌더링하고 제출 핸들러를 호출한다", async () => {
    const handleSubmit = vi.fn();

    render(
      <ContactForm
        fields={fields.map((field) => ({ ...field }))}
        onSubmit={handleSubmit}
      />,
    );

    fireEvent.change(screen.getByLabelText(/이름/), {
      target: { value: "홍길동" },
    });
    fireEvent.change(screen.getByLabelText(/이메일/), {
      target: { value: "hong@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/문의 내용/), {
      target: { value: "문의드립니다." },
    });

    fireEvent.click(screen.getByRole("button", { name: "문의하기" }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        name: "홍길동",
        email: "hong@example.com",
        message: "문의드립니다.",
      });
    });
  });
});
