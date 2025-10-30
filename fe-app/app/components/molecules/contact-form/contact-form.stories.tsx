import { ContactForm } from "./contact-form";

export default {
  title: "Molecules/ContactForm",
  component: ContactForm,
  tags: ["autodocs"],
};

export const Default = {
  args: {
    fields: [
      { id: "name", label: "이름", type: "text", required: true },
      { id: "email", label: "이메일", type: "email", required: true },
      { id: "phone", label: "연락처", type: "tel" },
      {
        id: "message",
        label: "문의 내용",
        type: "textarea",
        required: true,
        helperText: "프로젝트 개요 및 요청 사항을 입력해주세요.",
      },
    ],
  },
};
