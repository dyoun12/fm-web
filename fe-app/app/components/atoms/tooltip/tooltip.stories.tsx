import { Tooltip } from "./tooltip";

export default {
  title: "Atoms/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
};

export const Default = {
  args: {
    content: "추가 정보를 확인하세요",
    children: <span className="underline">도움말</span>,
  },
};
