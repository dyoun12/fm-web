import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TextArea } from "./text-area";

describe("TextArea", () => {
  it("라벨과 placeholder를 렌더링한다", () => {
    render(
      <TextArea
        label="설명"
        placeholder="내용을 입력하세요"
      />,
    );
    expect(screen.getByLabelText("설명")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("내용을 입력하세요"),
    ).toBeInTheDocument();
  });
});
