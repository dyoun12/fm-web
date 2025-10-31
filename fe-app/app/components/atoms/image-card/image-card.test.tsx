import { render, screen } from "@testing-library/react";
import { ImageCard } from "./image-card";

it("배경 이미지 카드를 렌더링한다", () => {
  render(<ImageCard backgroundImageUrl="https://example.com/img.jpg">텍스트</ImageCard>);
  expect(screen.getByText("텍스트")).toBeInTheDocument();
});

