import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { EntityFormCard, type EntityFormCardProps } from "./entity-form-card";
import { Input } from "../../atoms/input/input";
import { TextArea } from "../../atoms/text-area/text-area";

const meta: Meta<typeof EntityFormCard> = {
  title: "Molecules/EntityFormCard",
  component: EntityFormCard,
  args: {
    open: true,
    mode: "create",
    title: "새 엔티티",
    description: "속성을 입력한 뒤 생성합니다.",
  },
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof EntityFormCard>;

export const Create: Story = {
  render: (props) => {
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    return (
      <EntityFormCard
        {...props}
        onClose={() => undefined}
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <Input label="이름" value={name} onChange={(e) => setName((e.target as HTMLInputElement).value)} />
        <Input label="슬러그" value={slug} onChange={(e) => setSlug((e.target as HTMLInputElement).value)} />
        <TextArea label="설명" value="" onChange={() => undefined} />
      </EntityFormCard>
    );
  },
};

export const EditWithReadOnly: Story = {
  render: (props) => {
    const [name, setName] = useState("IR");
    const [slug, setSlug] = useState("ir");
    const [desc, setDesc] = useState("투자자 관계");
    return (
      <EntityFormCard
        {...props}
        mode="edit"
        title="카테고리 편집"
        readOnlyFields={[
          { label: "ID", value: "cat-001" },
          { label: "생성일", value: "2025-01-01" },
          { label: "수정일", value: "2025-01-10" },
        ]}
        open
        onClose={() => undefined}
        onSubmit={(e) => {
          e.preventDefault();
        }}
        onDelete={() => undefined}
      >
        <Input label="이름" value={name} onChange={(e) => setName((e.target as HTMLInputElement).value)} required />
        <Input label="슬러그" value={slug} onChange={(e) => setSlug((e.target as HTMLInputElement).value)} required />
        <TextArea label="설명" value={desc} onChange={(e) => setDesc((e.target as HTMLTextAreaElement).value)} />
      </EntityFormCard>
    );
  },
};
