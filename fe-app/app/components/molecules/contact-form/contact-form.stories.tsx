import { ContactForm } from "./contact-form";

export default {
  title: "Molecules/ContactForm",
  component: ContactForm,
  tags: ["autodocs"],
};

export const Default = {
  args: {
    fields: [
      { id: "company", label: "회사명", type: "text", colSpan: 2 },
      { id: "title", label: "직책", type: "text", placeholder: "예: 팀장" },
      { id: "name", label: "이름", type: "text", required: true },
      { id: "email", label: "이메일", type: "email", required: true, colSpan: 2 },
      {
        id: "referral",
        label: "유입경로",
        type: "select",
        placeholder: "유입경로 선택",
        options: [
          { label: "인터넷검색", value: "search" },
          { label: "지인추천", value: "friend" },
          { label: "기타", value: "other" },
        ],
        colSpan: 2,
      },
      { id: "subject", label: "제목", type: "text", colSpan: 2 },
      { id: "message", label: "내용", type: "textarea", required: true },
    ],
  },
};

export const ContactTheme = {
  args: {
    fields: [
      { id: "company", label: "회사명", type: "text", colSpan: 2 },
      { id: "title", label: "직책", type: "text" },
      { id: "name", label: "이름", type: "text", required: true },
      { id: "email", label: "이메일", type: "email", required: true, colSpan: 2 },
      {
        id: "referral",
        label: "유입경로",
        type: "select",
        placeholder: "유입경로 선택",
        options: [
          { label: "인터넷검색", value: "search" },
          { label: "지인추천", value: "friend" },
          { label: "기타", value: "other" },
        ],
        colSpan: 2,
      },
      { id: "subject", label: "제목", type: "text", colSpan: 2 },
      { id: "message", label: "내용", type: "textarea", required: true },
    ],
    theme: "dark",
  },
};
