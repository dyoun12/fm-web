import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GlobalFooter } from "./global-footer";

describe("GlobalFooter", () => {
  it("회사 정보를 표시한다", () => {
    render(
      <GlobalFooter
        companyInfo={{
          name: "FM Corporation",
          address: "서울특별시 강남구",
        }}
        navigationSections={[]}
      />,
    );
    expect(screen.getByText("FM Corporation")).toBeInTheDocument();
    expect(screen.getByText("서울특별시 강남구")).toBeInTheDocument();
  });
});
