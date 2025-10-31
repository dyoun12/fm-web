"use client";

import { cn } from "@/lib/classnames";
import {
  ComponentPropsWithoutRef,
  forwardRef,
  useId,
} from "react";

export type RadioProps = {
  label: string;
  description?: string;
} & ComponentPropsWithoutRef<"input">;

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  function Radio(
    { id, label, description, className, ...rest },
    ref,
  ) {
    const generatedId = useId();
    const radioId = id ?? generatedId;

    return (
      <label
        htmlFor={radioId}
        className={cn(
          "flex items-center gap-3 rounded-lg border border-transparent px-2 py-1 transition hover:border-blue-200",
          className,
        )}
      >
        <input
          ref={ref}
          id={radioId}
          type="radio"
          className="h-5 w-5 border border-zinc-300 text-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          {...rest}
        />
        <span className="flex flex-col gap-1">
          <span className="text-sm font-medium text-zinc-800">{label}</span>
          {description && (
            <span className="text-xs text-zinc-500">{description}</span>
          )}
        </span>
      </label>
    );
  },
);
