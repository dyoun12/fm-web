import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Radio } from "./radio";

describe("Radio", () => {
  it("라디오 버튼을 체크한다", () => {
    render(<Radio label="옵션 A" name="group" />);
    const radio = screen.getByLabelText("옵션 A") as HTMLInputElement;
    fireEvent.click(radio);
    expect(radio.checked).toBe(true);
  });
});
