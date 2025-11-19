"use client";

import { ReactNode } from "react";
import { Button } from "../../atoms/button/button";
import { cn } from "@/lib/classnames";
import { Card } from "@/app/components/atoms/card/card";

type ReadOnlyField = {
  label: string;
  value: ReactNode;
};

export type EntityFormProps = {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
  onClose?: () => void;  // 추가됨 (취소 버튼에서 필요)
  submitLabel?: string;
  saving?: boolean;
  readOnlyFields?: ReadOnlyField[];
  onDelete?: () => void;
  deleteLabel?: string;
  deleting?: boolean;
};

export type EntityFormCardProps = {
  variant?: "modal" | "sidebar";
  open?: boolean;
  mode: "create" | "edit";
  title: string;
  description?: string;
  onClose?: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
  submitLabel?: string;
  saving?: boolean;
  readOnlyFields?: ReadOnlyField[];
  onDelete?: () => void;
  deleteLabel?: string;
  deleting?: boolean;
};

function EntityForm({
  onSubmit,
  children,
  onClose,
  submitLabel,
  saving,
  readOnlyFields,
  onDelete,
  deleteLabel,
  deleting,
}: EntityFormProps) {
  return (
    <div>
      {readOnlyFields && readOnlyFields.length > 0 && (
        <dl className="mt-6 grid gap-4 rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4 sm:grid-cols-2">
          {readOnlyFields.map((field) => (
            <div key={field.label}>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                {field.label}
              </dt>
              <dd className="mt-1 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700">
                {field.value ?? "-"}
              </dd>
            </div>
          ))}
        </dl>
      )}

      <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
        {children}
        <div
          className={cn(
            "mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end",
            onDelete && "sm:justify-between"
          )}
        >
          {onDelete && (
            <Button
              type="button"
              variant="ghost"
              color="neutral"
              className="text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={onDelete}
              loading={deleting}
            >
              {deleteLabel}
            </Button>
          )}
          <div className="flex gap-2 sm:justify-end">
            <Button type="button" variant="ghost" color="neutral" onClick={onClose}>
              취소
            </Button>
            <Button type="submit" loading={saving}>
              {saving ? "처리 중..." : submitLabel}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export function EntityFormCard({
  variant = "modal",
  open,
  mode,
  title,
  description,
  onClose,
  onSubmit,
  children,
  submitLabel = mode === "edit" ? "저장" : "생성",
  saving,
  readOnlyFields,
  onDelete,
  deleteLabel = "삭제",
  deleting,
}: EntityFormCardProps) {
  if (!open) return null;

  // 내부 폼에 전달할 props 묶음
  const formProps: EntityFormProps = {
    onSubmit,
    children,
    onClose,
    submitLabel,
    saving,
    readOnlyFields,
    onDelete,
    deleteLabel,
    deleting,
  };

  // ---------------------------
  // Modal Variant
  // ---------------------------
  if (variant === "modal") {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6"
        role="dialog"
        aria-modal="true"
        onClick={(e) => {
          if (onClose === undefined) return;
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">{title}</h2>
              {description && <p className="mt-1 text-sm text-zinc-500">{description}</p>}
            </div>
            <button
              className="text-sm text-zinc-500 hover:text-zinc-900"
              onClick={onClose}
              aria-label="닫기"
            >
              닫기
            </button>
          </div>

          <EntityForm {...formProps} />
        </div>
      </div>
    );
  }

  // ---------------------------
  // Sidebar Variant
  // ---------------------------
  if (variant === "sidebar") {
    return (
      <Card className="overflow-y-scroll">
          <div className="flex gap-4 justify-between">
        {onClose ? 
          <button
            className="text-sm text-zinc-500 hover:text-zinc-900"
            onClick={onClose}
            aria-label="닫기"
            >
            닫기
          </button>
          : <div></div>
          }
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        {description && <p className="mt-1 text-sm text-zinc-500 text-right">{description}</p>}
        
        <EntityForm {...formProps} />
      </Card>
    );
  }

  return null;
}
