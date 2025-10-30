"use client";

import { FormEvent, useMemo, useState } from "react";
import { Input } from "../../atoms/input/input";
import { Button } from "../../atoms/button/button";
import { cn } from "@/lib/classnames";

export type ContactFormField = {
  id: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea";
  placeholder?: string;
  required?: boolean;
  description?: string;
  helperText?: string;
};

export type ContactFormProps = {
  fields: ContactFormField[];
  submitLabel?: string;
  successMessage?: string;
  errorMessage?: string;
  onSubmit?: (data: Record<string, string>) => Promise<void> | void;
};

type FormStatus = "idle" | "submitting" | "success" | "error";

export function ContactForm({
  fields,
  submitLabel = "문의하기",
  successMessage = "문의가 성공적으로 접수되었습니다.",
  errorMessage = "제출 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
  onSubmit,
}: ContactFormProps) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [values, setValues] = useState<Record<string, string>>(() =>
    fields.reduce(
      (acc, field) => ({
        ...acc,
        [field.id]: "",
      }),
      {},
    ),
  );

  const requiredFields = useMemo(
    () => fields.filter((field) => field.required),
    [fields],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    try {
      if (onSubmit) {
        await onSubmit(values);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 600));
      }
      setStatus("success");
    } catch (error) {
      console.error("문의 제출 실패:", error);
      setStatus("error");
    }
  };

  const handleChange = (fieldId: string, nextValue: string) => {
    setValues((prev) => ({
      ...prev,
      [fieldId]: nextValue,
    }));
  };

  return (
    <form
      className="flex w-full flex-col gap-6 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm"
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold text-zinc-900">문의하기</h2>
        <p className="text-sm text-zinc-600">
          문의 내용을 작성해주시면 2영업일 내로 담당자가 회신드립니다.
        </p>
      </div>

      {status === "success" && (
        <div className="rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700">
          {successMessage}
        </div>
      )}

      {status === "error" && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {errorMessage}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        {fields.map((field) => {
          if (field.type === "textarea") {
            return (
              <label
                key={field.id}
                htmlFor={field.id}
                className="md:col-span-2"
              >
                <span className="text-sm font-medium text-zinc-700">
                  {field.label}
                  {field.required && (
                    <span className="ml-1 text-red-500">*</span>
                  )}
                </span>
                <textarea
                  id={field.id}
                  name={field.id}
                  placeholder={field.placeholder}
                  required={field.required}
                  disabled={status === "submitting"}
                  value={values[field.id]}
                  onChange={(event) =>
                    handleChange(field.id, event.currentTarget.value)
                  }
                  className="mt-2 h-32 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-zinc-100"
                />
                {field.helperText && (
                  <p className="mt-1 text-xs text-zinc-500">
                    {field.helperText}
                  </p>
                )}
              </label>
            );
          }

          return (
            <Input
              key={field.id}
              id={field.id}
              label={field.label}
              type={field.type}
              placeholder={field.placeholder}
              required={field.required}
              description={field.description}
              helperText={field.helperText}
              value={values[field.id]}
              onChange={(event) => handleChange(field.id, event.target.value)}
              disabled={status === "submitting"}
            />
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
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
