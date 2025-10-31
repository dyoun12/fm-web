import { ContactSection } from "./contact-section";

export default {
  title: "Organisms/ContactSection",
  component: ContactSection,
  tags: ["autodocs"],
};

const formFields = [
  { id: "name", label: "이름", type: "text", required: true },
  { id: "email", label: "이메일", type: "email", required: true },
  { id: "message", label: "문의 내용", type: "textarea", required: true },
];

export const Default = {
  args: {
    address: "서울특별시 강남구 테헤란로 123, 9층",
    email: "contact@fm-corp.com",
    phone: "02-1234-5678",
    formFields,
  },
};

