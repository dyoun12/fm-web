import { ImageCard } from "./image-card";

export default {
  title: "Atoms/ImageCard",
  component: ImageCard,
  tags: ["autodocs"],
};

export const Default = {
  args: {
    backgroundImageUrl: "https://picsum.photos/1200/600",
    children: (
      <div className="text-white">
        <h3 className="text-lg font-semibold">배경 이미지 카드</h3>
        <p className="text-sm text-white/85">그라디언트 오버레이 포함</p>
      </div>
    ),
  },
};

