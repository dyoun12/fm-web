import type { Meta, StoryObj } from "@storybook/react";
import { FilterBar } from "./filter-bar";
import { Select } from "../../atoms/select/select";
import { Tag } from "../../atoms/tag/tag";

const meta: Meta<typeof FilterBar> = {
  title: "Molecules/FilterBar",
  component: FilterBar,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof FilterBar>;

export const Default: Story = {
  render: () => (
    <FilterBar>
      <Select options={[{ label: "전체", value: "all" }, { label: "IR", value: "ir" }]} aria-label="카테고리" />
      <Tag>공지</Tag>
    </FilterBar>
  ),
};

