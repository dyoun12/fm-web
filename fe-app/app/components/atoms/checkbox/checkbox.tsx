"use client";

import { cn } from "@/lib/classnames";
import {
  ComponentPropsWithoutRef,
  forwardRef,
  useEffect,
  useId,
  useRef,
} from "react";

export type CheckboxProps = {
  label: string;
  description?: string;
  indeterminate?: boolean;
} & ComponentPropsWithoutRef<"input">;

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    { id, label, description, indeterminate = false, className, ...rest },
    forwardedRef,
  ) {
    const generatedId = useId();
    const checkboxId = id ?? generatedId;

    const internalRef = useRef<HTMLInputElement | null>(null);
    useEffect(() => {
      if (internalRef.current) {
        internalRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    return (
      <div className={cn("flex items-start gap-3", className)}>
        <input
          ref={(node) => {
            internalRef.current = node;
            if (typeof forwardedRef === "function") {
              forwardedRef(node);
            } else if (forwardedRef) {
              forwardedRef.current = node;
            }
          }}
          id={checkboxId}
          type="checkbox"
          className="mt-1 h-5 w-5 rounded border border-zinc-300 text-blue-600 accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          {...rest}
        />
        <div className="flex flex-col gap-1">
          <label
            htmlFor={checkboxId}
            className="text-sm font-medium text-zinc-800"
          >
            {label}
          </label>
          {description && (
            <p className="text-xs text-zinc-500">{description}</p>
          )}
        </div>
      </div>
    );
  },
);
