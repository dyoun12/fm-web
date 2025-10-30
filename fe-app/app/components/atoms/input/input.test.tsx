import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Input } from "./input";

describe("Input", () => {
  it("label과 placeholder를 렌더링한다", () => {
    render(
      <Input
        label="이메일"
        placeholder="example@company.com"
        value=""
        onChange={() => {}}
      />,
    );
    expect(screen.getByLabelText("이메일")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("example@company.com")).toBeInTheDocument();
  });

  it("오류 상태일 때 에러 메시지를 표시한다", () => {
    render(
      <Input
        label="연락처"
        value=""
        onChange={() => {}}
        state="error"
        errorMessage="연락처를 입력해주세요."
      />,
    );
    expect(screen.getByText("연락처를 입력해주세요.")).toBeVisible();
  });
});
