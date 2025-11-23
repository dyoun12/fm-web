"use client";

import { useRouter } from "next/navigation";
import { ContactForm } from "../components/molecules/contact-form/contact-form";
import { useState } from "react";
import { ContactResultModal } from "../components/molecules/contact-result-modal/contact-result-modal";

export function ContactFormContainer() {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"success" | "error">("success");
  const [modalMessage, setModalMessage] = useState<string>("");

  return (
    <>
      <ContactForm
        fields={[
          { id: "company", label: "회사명", type: "text", colSpan: 2, required: true },
          { id: "title", label: "직책", type: "text", placeholder: "예: 팀장", required: true },
          { id: "name", label: "이름", type: "text", required: true },
          { id: "email", label: "이메일", type: "email", required: true, colSpan: 2 },
          {
            id: "referral",
            label: "유입경로",
            type: "select",
            placeholder: "유입경로 선택",
            required: true,
            options: [
              { label: "인터넷검색", value: "search" },
              { label: "지인추천", value: "friend" },
              { label: "기타", value: "other" },
            ],
            colSpan: 2,
          },
          { id: "subject", label: "제목", type: "text", colSpan: 2, required: true },
          { id: "message", label: "내용", type: "textarea", required: true },
        ]}
        submitLabel="문의하기"
        onSubmit={async (data) => {
          const res = await fetch("/api/contact", {
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

          if (!res.ok) {
            let message = "잠시 후 다시 시도해주세요.";
            let errorCode: string | undefined;
            try {
              const json = (await res.json()) as { error?: { message?: string } };
              errorCode = json?.error?.message;
              if (errorCode === "contact_input_required") {
                message = "모든 필수 입력 항목을 입력해주세요.";
              } else if (errorCode) {
                message = errorCode;
              }
            } catch {
              // ignore parse error
            }
            setModalType("error");
            setModalMessage(message);
            setModalOpen(true);
            throw new Error(errorCode || "CONTACT_SUBMIT_FAILED");
          }

          // 성공 시 모달에 성공 메시지를 표시
          setModalType("success");
          setModalMessage("빠른 시일 내에 담당자가 연락드리겠습니다.");
          setModalOpen(true);
        }}
        showHeader={false}
      />
      <ContactResultModal
        open={modalOpen}
        type={modalType}
        message={modalMessage}
        onClose={() => setModalOpen(false)}
        onGoHome={modalType === "success" ? () => router.push("/") : undefined}
      />
    </>
  );
}
