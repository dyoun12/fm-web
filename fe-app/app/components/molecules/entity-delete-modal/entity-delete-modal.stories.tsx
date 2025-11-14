import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EntityDeleteModal } from "./entity-delete-modal";

const meta: Meta<typeof EntityDeleteModal> = {
  title: "Molecules/EntityDeleteModal",
  component: EntityDeleteModal,
  args: {
    open: true,
    parentEntityDisplayName: "IR 카테고리",
    parentEntityName: "카테고리",
    parentEntityKeyLabel: "슬러그",
    parentEntityKeyValue: "ir",
    childEntityName: "게시물",
    childEntityKey: "title",
    relatedEntities: [],
  },
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof EntityDeleteModal>;

export const Confirmable: Story = {
  args: {
    relatedEntities: [],
  },
};

export const BlockedByRelations: Story = {
  args: {
    relatedEntities: [
      { id: "p-1", title: "2025년 1분기 보고서", description: "작성자: admin" },
      { id: "p-2", title: "정기 공지 - 2월", description: "작성자: editor" },
    ],
  },
};
