import { render, screen } from "@testing-library/react";
import { Avatar } from "./avatar";

describe("Avatar", () => {
  it("renders initials when no image", () => {
    render(<Avatar name="홍 길동" />);
    expect(screen.getByLabelText("홍 길동")).toBeInTheDocument();
  });
  it("renders img when src provided", () => {
    render(<Avatar name="관리자" src="https://picsum.photos/40" />);
    expect(screen.getByRole("img")).toBeInTheDocument();
  });
});

