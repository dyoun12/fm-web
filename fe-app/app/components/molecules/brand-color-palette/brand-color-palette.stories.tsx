import { BrandColorPalette } from "./brand-color-palette";

export default {
  title: "Molecules/BrandColorPalette",
  component: BrandColorPalette,
  tags: ["autodocs"],
};

export const Default = {
  args: {
    title: "브랜드 컬러 팔레트",
    description: "일관된 색 사용을 위해 아래 팔레트를 기준으로 활용합니다.",
    palette: [
      { name: "Primary", hex: "#2563EB", token: "--color-primary" },
      { name: "Secondary", hex: "#10B981", token: "--color-secondary" },
      { name: "Accent", hex: "#F59E0B", token: "--color-accent" },
      { name: "Neutral", hex: "#1F2937", token: "--color-neutral" },
    ],
  },
};

