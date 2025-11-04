"use client";

import { ComponentPropsWithoutRef, useCallback, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/classnames";

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

export function SearchInput({ theme = "light", className, onChange, value: valueProp, defaultValue, ...rest }: SearchInputProps) {
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
      // @ts-expect-error minimal synthetic-like event for consumer
      onChange({ target } as React.ChangeEvent<HTMLInputElement>);
    }
    // Keep focus on input after clearing
    inputRef.current?.focus();
  }, [controlled, onChange]);

  const showClear = currentValue.length > 0;
  const useIconForClear = useMemo(() => isEmojiOnly(currentValue), [currentValue]);

  return (
    <div className={cn("relative", className)}>
      <i
        className={cn(
          "ri-search-line pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400",
          isDark && "text-zinc-500",
        )}
        aria-hidden="true"
      />
      <input
        ref={inputRef}
        type="search"
        className={cn(
          "h-10 w-full rounded-full border px-10 text-sm outline-none transition search-input",
          isDark
            ? "border-zinc-700 bg-zinc-900 text-zinc-100 focus:border-zinc-500"
            : "border-zinc-300 bg-white text-zinc-900 focus:border-zinc-400",
        )}
        aria-label={rest["aria-label"] ?? "검색"}
        placeholder={rest.placeholder ?? "검색"}
        value={currentValue}
        defaultValue={undefined}
        onChange={handleChange}
        {...rest}
      />
      {showClear && (
        <button
          type="button"
          aria-label="지우기"
          onClick={clear}
          className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2 select-none rounded-full p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
            // Match theme icon color (same as left search icon)
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
      )}
    </div>
  );
}
