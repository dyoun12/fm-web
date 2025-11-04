import { fireEvent, render, screen } from "@testing-library/react";
import { Pagination } from "./pagination";

describe("Pagination", () => {
  it("displays current and total pages", () => {
    render(<Pagination page={2} pageSize={10} total={50} />);
    expect(screen.getByText("2 / 5")).toBeInTheDocument();
  });
  it("emits onChange on next", () => {
    const onChange = vi.fn();
    render(<Pagination page={1} pageSize={10} total={50} onChange={onChange} />);
    fireEvent.click(screen.getByLabelText("다음 페이지"));
    expect(onChange).toHaveBeenCalledWith(2);
  });
});

