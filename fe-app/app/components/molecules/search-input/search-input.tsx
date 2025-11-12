"use client";

import { ComponentPropsWithoutRef, useCallback, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/classnames";
import { Input } from "../../atoms/input/input";
import { useAppTheme } from "@/lib/theme-context";

export type SearchInputProps = {
  theme?: "light" | "dark";
} & ComponentPropsWithoutRef<"input">;

// Emoji-only detection: allow sequences with ZWJ and variation selectors
const isEmojiOnly = (value: string) => {
  const trimmed = value.replace(/\s|\u200D|\uFE0F/g, "");
  if (!trimmed) return false;
  try {
    return /^(?:\p{Extended_Pictographic})+$/u.test(trimmed);
  } catch {
    // Fallback for environments without Unicode property escapes
    return /^(?:[\u231A-\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD-\u25FE\u2600-\u27BF\u2B50\u1F000-\u1FAFF])+$/u.test(trimmed);
  }
};

export function SearchInput({ theme: themeProp, className, onChange, value: valueProp, defaultValue, ...rest }: SearchInputProps) {
  const appTheme = useAppTheme();
  const theme = themeProp ?? appTheme;
  const isDark = theme === "dark";
  const controlled = valueProp != null;
  const [uncontrolledValue, setUncontrolledValue] = useState<string>(() => (defaultValue != null ? String(defaultValue) : ""));
  const currentValue = controlled ? String(valueProp ?? "") : uncontrolledValue;
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback<NonNullable<typeof onChange>>(
    (e) => {
      if (!controlled) setUncontrolledValue((e.target as HTMLInputElement).value);
      onChange?.(e);
    },
    [controlled, onChange],
  );

  const clear = useCallback(() => {
    if (!controlled) setUncontrolledValue("");
    // Notify parent for controlled usage
    if (onChange) {
      const target = inputRef.current ?? (document.createElement("input") as HTMLInputElement);
      target.value = "";
      onChange({ target } as React.ChangeEvent<HTMLInputElement>);
    }
    // Keep focus on input after clearing
    inputRef.current?.focus();
  }, [controlled, onChange]);

  const showClear = currentValue.length > 0;
  const useIconForClear = useMemo(() => isEmojiOnly(currentValue), [currentValue]);

  // Remove potentially conflicting intrinsic props before passing to custom Input
  const { type: _t, prefix: _p, ...inputRest } = rest as { type?: unknown; prefix?: unknown } & typeof rest;
  void _t; void _p;

  return (
    <Input
      ref={inputRef}
      type="search"
      label={String(rest["aria-label"] ?? "검색")}
      hideLabel
      placeholder={rest.placeholder ?? "검색"}
      value={currentValue}
      defaultValue={undefined}
      onChange={handleChange}
      theme={theme}
      prefix={<i className={cn("ri-search-line", isDark ? "text-zinc-500" : "text-zinc-400")} aria-hidden="true" />}
      suffix={
        showClear ? (
          <button
            type="button"
            aria-label="지우기"
            onClick={clear}
            className={cn(
              "select-none rounded-full p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              isDark
                ? "text-zinc-500 hover:text-zinc-400 focus-visible:ring-zinc-600 ring-offset-zinc-900"
                : "text-zinc-400 hover:text-zinc-500 focus-visible:ring-zinc-300 ring-offset-white",
            )}
          >
            {useIconForClear ? (
              <i className="ri-close-line text-base" aria-hidden="true" />
            ) : (
              <span className="text-base leading-none" aria-hidden>
                ×
              </span>
            )}
          </button>
        ) : undefined
      }
      className={className}
      aria-label={rest["aria-label"] ?? "검색"}
      {...inputRest}
    />
  );
}
