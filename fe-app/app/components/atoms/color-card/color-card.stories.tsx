import { ColorCard } from "./color-card";

export default {
  title: "Atoms/ColorCard",
  component: ColorCard,
  tags: ["autodocs"],
};

export const Solid = {
  args: {
    tone: "solid",
    color: "blue",
    children: (
      <div>
        <h3 className="text-lg font-semibold">Solid 카드</h3>
        <p className="text-sm text-white/85">파란 배경, 흰 글자</p>
      </div>
    ),
  },
};

export const Gradient = {
  args: {
    tone: "gradient",
    gradientFrom: "from-blue-600",
    gradientTo: "to-emerald-500",
    children: (
      <div>
        <h3 className="text-lg font-semibold">Gradient 카드</h3>
        <p className="text-sm text-white/85">블루 → 에메랄드</p>
      </div>
    ),
  },
};

export const Tint = {
  args: {
    tone: "tint",
    color: "blue",
    children: (
      <div>
        <h3 className="text-lg font-semibold text-blue-700">Tint 카드</h3>
        <p className="text-sm text-blue-700/80">연한 배경 + 테두리</p>
      </div>
    ),
  },
};

