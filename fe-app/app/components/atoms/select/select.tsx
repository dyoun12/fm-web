"use client";

import { cn } from "@/lib/classnames";
import {
  ComponentPropsWithoutRef,
  forwardRef,
  useId,
} from "react";

type SelectState = "default" | "error" | "success";

export type SelectOption = {
  label: string;
  value: string;
};

export type SelectProps = {
  label: string;
  options: SelectOption[];
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  state?: SelectState;
  description?: string;
} & ComponentPropsWithoutRef<"select">;

const STATE_CLASSES: Record<SelectState, string> = {
  default:
    "border-zinc-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100",
  success:
    "border-green-500 focus:border-green-500 focus:ring-4 focus:ring-green-100",
  error:
    "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100",
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    {
      id,
      label,
      options,
      placeholder,
      helperText,
      errorMessage,
      state = "default",
      description,
      className,
      required,
      disabled,
      ...rest
    },
    ref,
  ) {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    const helperId = helperText ? `${selectId}-helper` : undefined;
    const errorId =
      state === "error" && errorMessage ? `${selectId}-error` : undefined;
    const descriptionId = description ? `${selectId}-description` : undefined;

    return (
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <label
            className={cn(
              "text-sm font-medium text-zinc-700",
              disabled && "text-zinc-400",
            )}
            htmlFor={selectId}
          >
            {label}
            {required && (
              <span className="ml-1 text-red-500" aria-hidden="true">
                *
              </span>
            )}
          </label>
          {description && (
            <p id={descriptionId} className="text-xs text-zinc-500">
              {description}
            </p>
          )}
        </div>
        <select
          id={selectId}
          ref={ref}
          aria-describedby={cn(descriptionId, helperId, errorId)}
          aria-invalid={state === "error" ? true : undefined}
          className={cn(
            "h-11 w-full rounded-lg border bg-white px-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 disabled:cursor-not-allowed disabled:bg-zinc-100",
            STATE_CLASSES[state],
            className,
          )}
          required={required}
          disabled={disabled}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {helperText && (
          <p id={helperId} className="text-xs text-zinc-500">
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
