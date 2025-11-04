"use client";

import { cn } from "@/lib/classnames";
import {
  ComponentPropsWithoutRef,
  forwardRef,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
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

    // 외부에서 select 값 변경 시 내부 표시 동기화
    useEffect(() => {
      if (isControlled) {
        setInternalValue(rest.value as string | undefined);
      }
    }, [isControlled, rest.value]);

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

    return (
      <div className="flex flex-col gap-2">
        {label && (
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
        )}
        <div className="relative">
          {/* 숨김 native select: 폼 호환/테스트 호환, change로 내부 상태 동기화 */}
          <select
            id={selectId}
            ref={(node) => {
              hiddenSelectRef.current = node;
              if (typeof ref === "function") ref(node);
              else if (ref) (ref as any).current = node;
            }}
            aria-describedby={cn(descriptionId, helperId, errorId)}
            aria-invalid={state === "error" ? true : undefined}
            className="sr-only"
            required={required}
            disabled={disabled}
            value={value}
            onChange={(e) => {
              if (!isControlled) setInternalValue(e.target.value);
              rest.onChange?.(e);
            }}
            name={(rest as any).name}
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
              "w-full rounded-lg border bg-white text-left text-zinc-900 outline-none transition placeholder:text-zinc-400 disabled:cursor-not-allowed disabled:bg-zinc-100",
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
                disabled ? "text-zinc-400" : "text-zinc-500",
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
                "absolute z-50 mt-1 max-h-64 w-full overflow-auto rounded-md border bg-white p-1 shadow-lg focus:outline-none",
                "border-zinc-200",
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
                        : "text-zinc-800 hover:bg-zinc-50",
                    )}
                  >
                    <span>{option.label}</span>
                    {selected && (
                      <i
                        aria-hidden="true"
                        className="ri-check-line text-blue-600"
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
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
