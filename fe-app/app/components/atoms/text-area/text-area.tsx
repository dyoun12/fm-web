"use client";

import { cn } from "@/lib/classnames";
import {
  ComponentPropsWithoutRef,
  forwardRef,
  useId,
} from "react";

type TextAreaState = "default" | "error" | "success";

export type TextAreaProps = {
  label: string;
  description?: string;
  helperText?: string;
  errorMessage?: string;
  state?: TextAreaState;
  hideLabel?: boolean;
  theme?: "light" | "dark";
} & ComponentPropsWithoutRef<"textarea">;

const STATE_CLASSES: Record<TextAreaState, string> = {
  default:
    "border-zinc-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100",
  success:
    "border-green-500 focus:border-green-500 focus:ring-4 focus:ring-green-100",
  error:
    "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100",
};

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextArea(
    {
      id,
      label,
      description,
      helperText,
      errorMessage,
      state = "default",
      hideLabel = false,
      className,
      required,
      disabled,
      theme = "light",
      ...rest
    },
    ref,
  ) {
    const generatedId = useId();
    const textAreaId = id ?? generatedId;
    const descriptionId = description ? `${textAreaId}-description` : undefined;
    const helperId = helperText ? `${textAreaId}-helper` : undefined;
    const errorId =
      state === "error" && errorMessage ? `${textAreaId}-error` : undefined;

    const isDark = theme === "dark";
    return (
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <label
            className={cn(
              hideLabel
                ? "sr-only"
                : isDark
                  ? "text-sm font-medium text-zinc-200"
                  : "text-sm font-medium text-zinc-700",
              disabled && "text-zinc-400",
            )}
            htmlFor={textAreaId}
          >
            {label}
            {required && !hideLabel && (
              <span className="ml-1 text-red-500" aria-hidden="true">
                *
              </span>
            )}
          </label>
          {description && (
            <p id={descriptionId} className={cn("text-xs", isDark ? "text-zinc-400" : "text-zinc-500") }>{description}</p>
          )}
        </div>
        <textarea
          id={textAreaId}
          ref={ref}
          aria-describedby={cn(descriptionId, helperId, errorId)}
          aria-invalid={state === "error" ? true : undefined}
          className={cn(
            "min-h-[6rem] w-full rounded-lg border px-3 py-2 text-sm outline-none transition disabled:cursor-not-allowed",
            isDark
              ? "bg-zinc-900 text-zinc-100 placeholder:text-zinc-500 disabled:bg-zinc-800 border-zinc-700"
              : "bg-white text-zinc-900 placeholder:text-zinc-400 disabled:bg-zinc-100",
            STATE_CLASSES[state],
            className,
          )}
          required={required}
          disabled={disabled}
          {...rest}
        />
        {helperText && (
          <p id={helperId} className={cn("text-xs", isDark ? "text-zinc-400" : "text-zinc-500") }>{helperText}</p>
        )}
        {state === "error" && errorMessage && (
          <p id={errorId} className="text-xs text-red-500">
            {errorMessage}
          </p>
        )}
      </div>
    );
  },
);
