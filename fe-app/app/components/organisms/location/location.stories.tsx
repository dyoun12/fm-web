import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Location } from "./location";

const meta: Meta<typeof Location> = {
  title: "Organisms/Location",
  component: Location,
  tags: ["autodocs"],
  args: {
    address: "서울특별시 강남구 테헤란로 123",
    zoom: 16,
    height: 360,
  },
};

export default meta;

type Story = StoryObj<typeof Location>;

export const Default: Story = {
  args: {
    address: "서울특별시 강남구 테헤란로 123",
  },
};

export const WithCoords: Story = {
  args: {
    address: "서울특별시 강남구 테헤란로",
    // 샘플 좌표(강남역 인근, 데모용)
    lat: 37.49795,
    lng: 127.02764,
    zoom: 16,
  },
};

export const WithLabel: Story = {
  args: {
    address: "서울특별시 강남구 테헤란로",
    lat: 37.49795,
    lng: 127.02764,
    label: "FM Headquarters - Gangnam, Seoul",
  },
};

export const WithCoordsAndQueryText: Story = {
  args: {
    address: "서울특별시 강남구 테헤란로 123",
    lat: 37.49795,
    lng: 127.02764,
    queryText: "서울특별시 강남구 테헤란로 123",
    zoom: 16,
  },
};

// v1 Embed API - Search mode
export const V1_Search: Story = {
  args: {
    apiKey: "<YOUR_API_KEY>",
    embedMode: "search",
    searchQuery: "FM Corporation Seoul",
    zoom: 15,
    mapType: "roadmap",
    language: "ko",
    region: "KR",
  },
  parameters: {
    docs: {
      description: {
        story: "Google Maps Embed API v1 - Search 모드. 실제 확인 시 유효한 API 키를 넣으세요.",
      },
    },
  },
};

// v1 Embed API - Place mode
export const V1_Place: Story = {
  args: {
    apiKey: "<YOUR_API_KEY>",
    embedMode: "place",
    placeId: "ChIJm7N0nDeifDURVnQfGqz7Gr0", // 샘플 place_id (예시)
    mapType: "roadmap",
    language: "ko",
  },
};

// v1 Embed API - View mode
export const V1_View: Story = {
  args: {
    apiKey: "<YOUR_API_KEY>",
    embedMode: "view",
    centerLat: 37.49795,
    centerLng: 127.02764,
    zoom: 16,
    mapType: "satellite",
  },
};

// v1 Embed API - Directions mode
export const V1_Directions: Story = {
  args: {
    apiKey: "<YOUR_API_KEY>",
    embedMode: "directions",
    origin: "서울역",
    destination: "강남역",
    travelMode: "transit",
    avoid: ["tolls"],
    units: "metric",
    language: "ko",
    region: "KR",
  },
};

// v1 Embed API - StreetView mode
export const V1_StreetView: Story = {
  args: {
    apiKey: "<YOUR_API_KEY>",
    embedMode: "streetview",
    // location 대신 pano를 사용할 수도 있습니다.
    lat: 37.49795,
    lng: 127.02764,
    heading: 210,
    pitch: 10,
    fov: 80,
  },
};
