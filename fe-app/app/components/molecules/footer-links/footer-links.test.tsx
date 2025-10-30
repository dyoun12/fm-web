import { render, screen } from "@testing-library/react";
import { FooterLinks } from "./footer-links";

it("renders links", () => {
  render(<FooterLinks title="회사" links={[{ label: "소개", href: "#" }]} />);
  expect(screen.getByText("회사")).toBeInTheDocument();
  expect(screen.getByText("소개")).toBeInTheDocument();
});

