"use client";

import { cn } from "@/lib/classnames";
import {
  ComponentPropsWithoutRef,
  forwardRef,
  ReactNode,
  useId,
} from "react";

type InputState = "default" | "error" | "success";
type InputType = ComponentPropsWithoutRef<"input">["type"];

export type InputProps = {
  label: string;
  description?: string;
  helperText?: string;
  errorMessage?: string;
  state?: InputState;
  prefix?: ReactNode;
  suffix?: ReactNode;
  hideLabel?: boolean;
  theme?: "light" | "dark";
} & Omit<ComponentPropsWithoutRef<"input">, "type"> & {
  type?: Extract<
    InputType,
    | "text"
    | "email"
    | "password"
    | "number"
    | "tel"
    | "url"
    | "search"
    | "date"
  >;
};

const STATE_CLASSES: Record<InputState, string> = {
  default:
    "border-zinc-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100",
  success:
    "border-green-500 focus:border-green-500 focus:ring-4 focus:ring-green-100",
  error:
    "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input(
    {
      id,
      label,
      description,
      helperText,
      errorMessage,
      state = "default",
      prefix,
      suffix,
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
    const inputId = id ?? generatedId;
    const descriptionId = description ? `${inputId}-description` : undefined;
    const helperId = helperText ? `${inputId}-helper` : undefined;
    const errorId =
      state === "error" && errorMessage ? `${inputId}-error` : undefined;

    const isDark = theme === "dark";
    return (
      <div className="flex flex-col gap-2">
        <div className={cn("flex flex-col gap-1") }>
          <label
            className={cn(
              hideLabel
                ? "sr-only"
                : isDark
                  ? "text-sm font-medium text-zinc-200"
                  : "text-sm font-medium text-zinc-700",
              disabled && "text-zinc-400",
            )}
            htmlFor={inputId}
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
        <div
          className={cn(
            "flex items-center gap-2 rounded-lg border px-3 py-2",
            isDark ? "bg-zinc-900 border-zinc-700" : "bg-white",
            STATE_CLASSES[state],
            disabled && (isDark ? "bg-zinc-800 text-zinc-500" : "bg-zinc-100 text-zinc-400"),
            className,
          )}
        >
          {prefix && <span className={cn(isDark ? "text-zinc-400" : "text-zinc-500")}>{prefix}</span>}
          <input
            id={inputId}
            ref={ref}
            aria-describedby={cn(descriptionId, helperId, errorId)}
            aria-invalid={state === "error" ? true : undefined}
            className={cn(
              "flex-1 border-none bg-transparent text-sm outline-none",
              isDark ? "text-zinc-100 placeholder:text-zinc-500" : "text-zinc-900 placeholder:text-zinc-400",
              disabled && "cursor-not-allowed",
            )}
            disabled={disabled}
            required={required}
            {...rest}
          />
          {suffix && <span className={cn(isDark ? "text-zinc-400" : "text-zinc-500")}>{suffix}</span>}
        </div>
        {helperText && (
          <p id={helperId} className={cn("text-xs", isDark ? "text-zinc-400" : "text-zinc-500") }>
            {helperText}
          </p>
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
