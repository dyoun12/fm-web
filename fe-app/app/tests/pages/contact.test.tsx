import { render, screen } from "@testing-library/react";
import ContactPage from "../../contact/page";

describe("Contact page", () => {
  it("renders heading and contact form fields", () => {
    render(<ContactPage />);
    expect(screen.getByRole("heading", { level: 1, name: /연락처/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/이름/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/이메일/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/메시지/i)).toBeInTheDocument();
  });
});

