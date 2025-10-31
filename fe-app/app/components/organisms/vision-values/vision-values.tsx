"use client";

import { useState } from "react";
import { cn } from "@/lib/classnames";
import { Card } from "../../atoms/card/card";

export type VisionItem = { key: string; title: string; description: string };

export type VisionValuesProps = {
  items: VisionItem[];
  theme?: "light" | "dark";
};

export function VisionValues({ items, theme = "light" }: VisionValuesProps) {
  const [active, setActive] = useState(items[0]?.key);
  const isDark = theme === "dark";
  const current = items.find((i) => i.key === active) ?? items[0];
  return (
    <Card theme={theme}>
      <nav className="flex flex-wrap gap-2">
        {items.map((i) => (
          <button
            key={i.key}
            type="button"
            onClick={() => setActive(i.key)}
            className={cn(
              "rounded-full px-4 py-2 text-sm",
              i.key === active
                ? "bg-blue-600 text-white"
                : isDark
                  ? "border border-zinc-700 text-zinc-300"
                  : "border border-zinc-200 text-zinc-700",
            )}
          >
            {i.title}
          </button>
        ))}
      </nav>
      {current && (
        <div className="mt-4">
          <h3 className={cn("text-lg font-semibold", isDark ? "text-zinc-100" : "text-zinc-900")}>{current.title}</h3>
          <p className={cn("mt-2 text-sm", isDark ? "text-zinc-400" : "text-zinc-600")}>{current.description}</p>
        </div>
      )}
    </Card>
  );
}
