"use client";

import { useEffect } from "react";
import { Button } from "../../atoms/button/button";

export type ContactResultModalProps = {
  open: boolean;
  type: "success" | "error";
  message: string;
  onClose: () => void;
  onGoHome?: () => void;
};

export function ContactResultModal({ open, type, message, onClose, onGoHome }: ContactResultModalProps) {
  useEffect(() => {
    if (!open) return;
  }, [open]);

  if (!open) return null;

  const isSuccess = type === "success";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex flex-col items-center text-center">
          <div
            className={
              isSuccess
                ? "mb-4 flex h-16 w-16 items-center justify-center rounded-full text-green-600"
                : "mb-4 flex h-16 w-16 items-center justify-center rounded-full text-red-600"
            }
            aria-hidden="true"
          >
            <i className={isSuccess ? "ri-check-line text-5xl" : "ri-error-warning-line text-5xl"} />
          </div>
          <h2 className="text-xl font-semibold text-zinc-800">
            {isSuccess ? "문의가 접수되었습니다." : "제출에 실패했습니다."}
          </h2>
          <p className="mt-2 text-sm text-zinc-600">{message}</p>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          {isSuccess && onGoHome && (
            <Button type="button" onClick={onGoHome}>
              홈으로
            </Button>
          )}
          <Button type="button" variant="ghost" color="neutral" onClick={onClose}>
            닫기
          </Button>
        </div>
      </div>
    </div>
  );
}
