"use client";

import { FormEvent, useMemo, useState } from "react";
import { Input } from "../../atoms/input/input";
import { Button } from "../../atoms/button/button";
import { TextArea } from "../../atoms/text-area/text-area";
import { cn } from "@/lib/classnames";
import { Card } from "../../atoms/card/card";
import { Select as SelectAtom } from "../../atoms/select/select";

export type ContactFormField = {
  id: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea" | "select";
  placeholder?: string;
  required?: boolean;
  description?: string;
  helperText?: string;
  // select 전용 옵션
  options?: { label: string; value: string }[];
  /** 레이아웃: md 기준 그리드 span (기본 1) */
  colSpan?: 1 | 2;
};

export type ContactFormProps = {
  fields: ContactFormField[];
  submitLabel?: string;
  successMessage?: string;
  errorMessage?: string;
  onSubmit?: (data: Record<string, string>) => Promise<void> | void;
  theme?: "light" | "dark";
  /** 페이지에서 타이틀/설명을 별도 렌더링할 때 false로 설정 */
  showHeader?: boolean;
};

type FormStatus = "idle" | "submitting" | "success" | "error";

const EMAIL_FIELD_ID = "email";

function isValidEmail(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  // 단순 이메일 형식 검증
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

export function ContactForm({
  fields,
  submitLabel = "문의하기",
  successMessage = "문의가 성공적으로 접수되었습니다.",
  errorMessage = "제출 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
  onSubmit,
  theme = "light",
  showHeader = true,
}: ContactFormProps) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorText, setErrorText] = useState<string>(errorMessage);

  const initialValues = useMemo(
    () =>
      fields.reduce(
        (acc, field) => ({
          ...acc,
          [field.id]: "",
        }),
        {} as Record<string, string>,
      ),
    [fields],
  );

  const [values, setValues] = useState<Record<string, string>>(() => initialValues);

  const requiredFields = useMemo(
    () => fields.filter((field) => field.required),
    [fields],
  );

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const missingRequired = requiredFields.filter((field) => !values[field.id]?.trim());
    if (missingRequired.length > 0) {
      const nextErrors: Record<string, string> = {};
      for (const field of missingRequired) {
        nextErrors[field.id] = `${field.label}은 필수 입력값입니다.`;
      }
      setFieldErrors(nextErrors);
      setErrorText("모든 필수 입력 항목을 입력해주세요.");
      setStatus("error");
      return;
    }

    // 이메일 형식 검증
    const emailValue = values[EMAIL_FIELD_ID];
    if (emailValue && !isValidEmail(emailValue)) {
      setFieldErrors((prev) => ({
        ...prev,
        [EMAIL_FIELD_ID]: "이메일 형식이 올바르지 않습니다.",
      }));
      setErrorText("이메일 형식을 확인해주세요.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    try {
      if (onSubmit) {
        await onSubmit(values);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 600));
      }
      // 성공 시 입력 값을 초기화한다.
      setValues(initialValues);
      setFieldErrors({});
      setStatus("success");
    } catch (error) {
      console.error("문의 제출 실패:", error);
       let messageToShow = errorMessage;
       if (error instanceof Error) {
         if (error.message === "contact_input_required") {
           messageToShow = "모든 필수 입력 항목을 입력해주세요.";
         } else if (error.message) {
           messageToShow = error.message;
         }
       }
       setErrorText(messageToShow);
      setStatus("error");
    }
  };

  const handleChange = (fieldId: string, nextValue: string) => {
    setValues((prev) => ({
      ...prev,
      [fieldId]: nextValue,
    }));
    setFieldErrors((prev) => {
      const next = { ...prev };

      if (fieldId === EMAIL_FIELD_ID) {
        if (!nextValue.trim()) {
          // 필수 체크는 submit 시에 수행하므로 여기서는 형식만 관리
          delete next[fieldId];
        } else if (!isValidEmail(nextValue)) {
          next[fieldId] = "이메일 형식이 올바르지 않습니다.";
          return next;
        } else {
          delete next[fieldId];
        }
        return next;
      }

      if (!prev[fieldId]) return prev;
      const { [fieldId]: _, ...rest } = prev;
      return rest;
    });
  };

  const isDark = theme === "dark";
  return (
    <Card theme={theme} padding="lg" className="w-full mx-auto">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {showHeader && (
        <div className="flex flex-col gap-2">
          <h2 className={cn("text-2xl font-semibold", isDark ? "text-zinc-100" : "text-zinc-900")}>문의하기</h2>
          <p className={cn("text-sm", isDark ? "text-zinc-400" : "text-zinc-600")}>
            문의 내용을 작성해주시면 2영업일 내로 담당자가 회신드립니다.
          </p>
        </div>
      )}

      {status === "success" && (
        <div className="rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700">
          {successMessage}
        </div>
      )}

      {status === "error" && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {errorText}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        {fields.map((field) => {
          if (field.type === "textarea") {
            return (
              <div key={field.id} className="md:col-span-2">
                <TextArea
                  id={field.id}
                  label={field.label}
                  placeholder={field.placeholder}
                  required={field.required}
                  disabled={status === "submitting"}
                  value={values[field.id]}
                  onChange={(event) =>
                    handleChange(field.id, event.currentTarget.value)
                  }
                  helperText={field.helperText}
                  state={fieldErrors[field.id] ? "error" : "default"}
                  errorMessage={fieldErrors[field.id]}
                  theme={theme}
                />
              </div>
            );
          }

          if (field.type === "select") {
            return (
              <div key={field.id} className={cn(field.colSpan === 2 ? "md:col-span-2" : "md:col-span-1") }>
                <SelectAtom
                  id={field.id}
                  label={field.label}
                  placeholder={field.placeholder}
                  options={field.options || []}
                  required={field.required}
                  disabled={status === "submitting"}
                  value={values[field.id]}
                  onChange={(event) => handleChange(field.id, event.target.value)}
                  helperText={field.helperText}
                  state={fieldErrors[field.id] ? "error" : "default"}
                  errorMessage={fieldErrors[field.id]}
                />
              </div>
            );
          }

          return (
            <div key={field.id} className={cn(field.colSpan === 2 ? "md:col-span-2" : "md:col-span-1") }>
              <Input
                id={field.id}
                label={field.label}
                type={field.type}
                placeholder={field.placeholder}
                required={field.required}
                description={field.description}
                helperText={field.helperText}
                state={fieldErrors[field.id] ? "error" : "default"}
                errorMessage={fieldErrors[field.id]}
                value={values[field.id]}
                onChange={(event) => handleChange(field.id, event.target.value)}
                disabled={status === "submitting"}
                theme={theme}
              />
            </div>
          );
        })}
      </div>

      {requiredFields.length > 0 && (
        <p className="text-xs text-zinc-500">
          <span className="text-red-500">*</span> 표시는 필수 입력 항목입니다.
        </p>
      )}

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-xs text-zinc-400">
          제출 시 개인정보 처리방침에 동의한 것으로 간주됩니다.
        </p>
        <Button
          type="submit"
          loading={status === "submitting"}
          disabled={status === "submitting"}
          theme={theme}
        >
          {submitLabel}
        </Button>
      </div>
      </form>
    </Card>
  );
}
