import { Card } from "./card";

export default {
  title: "Atoms/Card",
  component: Card,
  tags: ["autodocs"],
};

export const Default = {
  args: {
    children: (
      <div>
        <h3 className="text-lg font-semibold text-zinc-900">기본 카드</h3>
        <p className="mt-1 text-sm text-zinc-600">
          outline 변형으로 보더와 배경이 적용됩니다.
        </p>
      </div>
    ),
    variant: "outline",
    padding: "md",
  },
};

export const Elevated = {
  args: {
    children: (
      <div>
        <h3 className="text-lg font-semibold text-zinc-900">Elevated</h3>
        <p className="mt-1 text-sm text-zinc-600">그림자 강조 카드</p>
      </div>
    ),
    variant: "elevated",
    padding: "md",
  },
};

export const Ghost = {
  args: {
    children: (
      <div>
        <h3 className="text-lg font-semibold text-zinc-900">Ghost</h3>
        <p className="mt-1 text-sm text-zinc-600">투명 배경, hover tint</p>
      </div>
    ),
    variant: "ghost",
    padding: "md",
  },
};

export const Soft = {
  args: {
    children: (
      <div>
        <h3 className="text-lg font-semibold text-zinc-900">Soft</h3>
        <p className="mt-1 text-sm text-zinc-600">은은한 배경 카드</p>
      </div>
    ),
    variant: "soft",
    padding: "md",
  },
};

