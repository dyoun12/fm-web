import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Location } from "./location";

describe("Location", () => {
  it("주소를 기반으로 Google Maps embed를 렌더링한다", () => {
    const address = "서울특별시 강남구 테헤란로 123";
    render(<Location address={address} />);

    const title = `지도: ${address}`;
    const iframe = screen.getByTitle(title) as HTMLIFrameElement;
    expect(iframe).toBeInTheDocument();
    expect(iframe.tagName).toBe("IFRAME");
    expect(iframe.src).toContain("https://www.google.com/maps");
    // q에 주소가 들어간다(인코딩 방식은 환경에 따라 다를 수 있으나, 여기서는 encodeURIComponent 기준으로 확인)
    expect(iframe.src).toContain(encodeURIComponent(address));
    expect(iframe.src).toContain("output=embed");
  });

  it("기본적으로 상호작용 비활성 오버레이 버튼을 노출한다", () => {
    render(<Location address="서울특별시 강남구 테헤란로 123" />);
    expect(screen.getByRole("button", { name: /지도 상호작용 활성화/i })).toBeInTheDocument();
  });

  it("lat/lng이 제공되면 좌표 기반으로 마커가 고정된다", () => {
    const lat = 37.49795;
    const lng = 127.02764;
    render(<Location address="임시 주소" lat={lat} lng={lng} />);
    const iframe = screen.getByRole("iframe", { hidden: true }) as HTMLIFrameElement | null;
    // Testing Library에서 iframe role 탐지는 제한적이므로 title로 재검색
    const found = screen.getByTitle(/지도: 임시 주소/);
    expect(found).toBeInTheDocument();
    const src = (found as HTMLIFrameElement).src;
    expect(src).toContain(`${lat},${lng}`);
    expect(src).toContain("output=embed");
  });

  it("queryText를 주면 패널에는 텍스트(주소) 표시, 지도 센터는 좌표로 고정", () => {
    const lat = 37.49795;
    const lng = 127.02764;
    const queryText = "서울특별시 강남구 테헤란로 123";
    render(<Location address="임시" lat={lat} lng={lng} queryText={queryText} />);
    const found = screen.getByTitle(/지도: 임시/);
    const src = (found as HTMLIFrameElement).src;
    expect(src).toContain(encodeURIComponent(queryText)); // q
    expect(src).toContain(`${lat},${lng}`); // ll
  });

  it("label을 전달하면 좌상단 라벨이 노출된다", () => {
    const label = "커스텀 라벨 예시";
    render(<Location address="임시 주소" lat={0} lng={0} label={label} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it("apiKey가 있으면 v1 Search 모드 URL을 사용한다", () => {
    const apiKey = "test-key";
    const query = "서울 강남구";
    render(<Location address="임시" apiKey={apiKey} embedMode="search" searchQuery={query} />);
    const frame = screen.getByTitle(/지도: 임시/);
    const src = (frame as HTMLIFrameElement).src;
    expect(src).toContain("/maps/embed/v1/search");
    expect(src).toContain(`key=${apiKey}`);
    expect(src).toContain(encodeURIComponent(query));
  });
});
