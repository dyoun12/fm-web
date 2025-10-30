import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./button";

describe("Button", () => {
  it("children 텍스트를 렌더링한다", () => {
    render(<Button>확인</Button>);
    expect(screen.getByRole("button", { name: "확인" })).toBeInTheDocument();
  });

  it("loading 상태일 때 스피너를 표시하고 비활성화된다", () => {
    render(
      <Button loading>
        저장 중
      </Button>,
    );

    const button = screen.getByRole("button", { name: /저장 중/ });
    expect(button).toBeDisabled();
    expect(screen.getByTestId("button-spinner")).toBeInTheDocument();
  });
});
