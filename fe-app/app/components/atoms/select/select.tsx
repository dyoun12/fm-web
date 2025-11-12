"use client";

import { cn } from "@/lib/classnames";
import { useAppTheme } from "@/lib/theme-context";
import {
  ComponentPropsWithoutRef,
  forwardRef,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type AriaAttributes,
} from "react";

type SelectState = "default" | "error" | "success";

export type SelectOption = {
  label: string;
  value: string;
};

export type SelectProps = {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  state?: SelectState;
  description?: string;
  size?: "sm" | "md" | "lg";
  theme?: "light" | "dark";
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
      size = "md",
      theme: themeProp,
      ...rest
    },
    ref,
  ) {
    const appTheme = useAppTheme();
    const theme = themeProp ?? appTheme;
    const isDark = theme === "dark";
    const generatedId = useId();
    const selectId = id ?? generatedId;
    const helperId = helperText ? `${selectId}-helper` : undefined;
    const errorId =
      state === "error" && errorMessage ? `${selectId}-error` : undefined;
    const descriptionId = description ? `${selectId}-description` : undefined;

    // 내부 상태: 선택 값 및 오픈 상태
    const isControlled = typeof rest.value !== "undefined";
    const [internalValue, setInternalValue] = useState<string | undefined>(
      (rest.defaultValue as string | undefined) ?? (rest.value as string | undefined),
    );
    const value = (isControlled ? (rest.value as string | undefined) : internalValue) ?? "";

    const [open, setOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const listRef = useRef<HTMLUListElement | null>(null);
    const hiddenSelectRef = useRef<HTMLSelectElement | null>(null);

    const currentLabel = useMemo(() => {
      const found = options.find((o) => o.value === value);
      return found?.label;
    }, [options, value]);

    // Note: When controlled, render uses `rest.value` directly via `value`
    // Uncontrolled mode manages `internalValue` and does not mirror props here

    useEffect(() => {
      const onClickOutside = (e: MouseEvent) => {
        if (!open) return;
        const t = e.target as Node;
        if (
          triggerRef.current && !triggerRef.current.contains(t) &&
          listRef.current && !listRef.current.contains(t)
        ) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", onClickOutside);
      return () => document.removeEventListener("mousedown", onClickOutside);
    }, [open]);

    const commitValue = (next: string) => {
      // native select 동기화 및 change 이벤트 디스패치
      if (hiddenSelectRef.current) {
        hiddenSelectRef.current.value = next;
        const evt = new Event("change", { bubbles: true });
        hiddenSelectRef.current.dispatchEvent(evt);
      }
      if (!isControlled) setInternalValue(next);
      setOpen(false);
    };

    const sizeTriggerClass = useMemo(() => {
      if (size === "sm") return "h-8 px-2 pr-8 text-sm";
      if (size === "lg") return "h-12 px-4 pr-12 text-base";
      return "h-11 px-3 pr-10 text-sm"; // md
    }, [size]);

    const sizeOptionPadding = useMemo(() => {
      if (size === "sm") return "py-1.5";
      if (size === "lg") return "py-2.5";
      return "py-2"; // md
    }, [size]);

    const iconSizeClass = useMemo(() => {
      if (size === "sm") return "right-2 text-sm";
      if (size === "lg") return "right-3 text-lg";
      return "right-3 text-base"; // md
    }, [size]);

    // Extract aria-label from rest to forward to both hidden select and trigger
    const ariaLabel: string | undefined = (rest as AriaAttributes)["aria-label"] as
      | string
      | undefined;
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <div className="flex flex-col gap-1">
            <label
              className={cn(
                isDark ? "text-sm font-medium text-zinc-200" : "text-sm font-medium text-zinc-700",
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
              <p id={descriptionId} className={cn("text-xs", isDark ? "text-zinc-400" : "text-zinc-500") }>
                {description}
              </p>
            )}
          </div>
        )}
        <div className="relative">
          {/* 숨김 native select: 폼 호환/테스트 호환, change로 내부 상태 동기화 */}
          <select
            id={selectId}
            ref={(node) => {
              hiddenSelectRef.current = node;
              if (typeof ref === "function") ref(node);
              else if (ref) (ref as MutableRefObject<HTMLSelectElement | null>).current = node;
            }}
            aria-describedby={cn(descriptionId, helperId, errorId)}
            aria-invalid={state === "error" ? true : undefined}
            aria-label={ariaLabel}
            className="sr-only"
            required={required}
            disabled={disabled}
            value={value}
            onChange={(e) => {
              if (!isControlled) setInternalValue(e.target.value);
              rest.onChange?.(e);
            }}
            name={rest.name}
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

          {/* 트리거 */}
          <button
            type="button"
            ref={triggerRef}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={`${selectId}-listbox`}
            disabled={disabled}
            onClick={() => !disabled && setOpen((v) => !v)}
            className={cn(
              "w-full rounded-lg border text-left outline-none transition placeholder:text-zinc-400 disabled:cursor-not-allowed",
              isDark
                ? "bg-zinc-900 text-zinc-100 disabled:bg-zinc-800 disabled:text-zinc-500 border-zinc-700"
                : "bg-white text-zinc-900 disabled:bg-zinc-100",
              sizeTriggerClass,
              STATE_CLASSES[state],
              className,
            )}
          >
            <span className={cn(!currentLabel && "text-zinc-400")}>
              {currentLabel ?? placeholder ?? "선택"}
            </span>
            <i
              aria-hidden="true"
              className={cn(
                "ri-arrow-down-s-line pointer-events-none absolute top-1/2 -translate-y-1/2",
                iconSizeClass,
                disabled ? "text-zinc-400" : isDark ? "text-zinc-400" : "text-zinc-500",
              )}
            />
          </button>

          {/* 드롭다운 */}
          {open && (
            <ul
              id={`${selectId}-listbox`}
              role="listbox"
              ref={listRef}
              className={cn(
                "absolute z-50 mt-1 max-h-64 w-full overflow-auto rounded-md border p-1 shadow-lg focus:outline-none",
                isDark ? "bg-zinc-900 border-zinc-700" : "bg-white border-zinc-200",
              )}
            >
              {options.map((option) => {
                const selected = option.value === value;
                return (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={selected}
                    tabIndex={-1}
                    onClick={() => commitValue(option.value)}
                    className={cn(
                      "flex cursor-pointer items-center justify-between rounded px-2 text-sm",
                      sizeOptionPadding,
                      selected
                        ? "bg-blue-50 text-blue-700"
                        : isDark ? "text-zinc-200 hover:bg-white/5" : "text-zinc-800 hover:bg-zinc-50",
                    )}
                  >
                    <span>{option.label}</span>
                    {selected && (
                      <i
                        aria-hidden="true"
                        className={cn("ri-check-line", isDark ? "text-blue-400" : "text-blue-600")}
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          )}
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
