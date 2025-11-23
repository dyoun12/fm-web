"use client";

import { ContactForm } from "../components/molecules/contact-form/contact-form";

export function ContactFormContainer() {
  return (
    <ContactForm
      fields={[
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
      ]}
      submitLabel="문의하기"
      onSubmit={async (data) => {
        await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            company: data.company || undefined,
            title: data.title || undefined,
            name: data.name,
            email: data.email,
            referral: data.referral || undefined,
            subject: data.subject || undefined,
            message: data.message,
          }),
        });
      }}
      showHeader={false}
    />
  );
}

