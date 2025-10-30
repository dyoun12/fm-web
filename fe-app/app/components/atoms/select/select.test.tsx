import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Select } from "./select";

const options = [
  { label: "전체", value: "all" },
  { label: "공지", value: "notice" },
];

describe("Select", () => {
  it("옵션을 렌더링하고 값을 변경한다", () => {
    render(
      <Select
        label="카테고리"
        options={options}
        placeholder="선택하세요"
      />,
    );
    const select = screen.getByLabelText("카테고리") as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "notice" } });
    expect(select.value).toBe("notice");
  });
});
