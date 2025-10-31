import { Badge } from "./badge";

export default {
  title: "Atoms/Badge",
  component: Badge,
  tags: ["autodocs"],
};

export const Info = {
  args: {
    children: "공지",
    color: "info",
  },
};

export const Success = {
  args: {
    children: "성공",
    color: "success",
  },
};
