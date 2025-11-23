"use client";

import { ReactNode, useState } from "react";
import { cn } from "@/lib/classnames";

export type TooltipProps = {
  content: ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  children: ReactNode;
};

export function Tooltip({ content, placement = "top", children }: TooltipProps) {
  const [visible, setVisible] = useState(false);

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span
          role="tooltip"
          className={cn(
            "absolute z-40 w-[400px] whitespace-normal break-words rounded-lg bg-black px-3 py-2 text-xs text-white shadow",
            placement === "top" && "-top-2 right-0 -translate-y-full",
            placement === "bottom" && "-bottom-2 left-1/2 -translate-x-1/2 translate-y-full",
            placement === "left" && "left-0 top-1/2 -translate-x-full -translate-y-1/2",
            placement === "right" && "right-0 top-1/2 translate-x-full -translate-y-1/2",
          )}
        >
          {content}
        </span>
      )}
    </span>
  );
}
