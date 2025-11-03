"use client";

import { useState, ReactNode } from "react";
import { Card } from "../../atoms/card/card";
import { cn } from "@/lib/classnames";

export type BusinessItem = {
  key: string;
  title: string;
  summary?: string;
  content: ReactNode;
};

export type BusinessExplorerProps = {
  items: BusinessItem[];
  theme?: "light" | "dark";
};

export function BusinessExplorer({ items, theme = "light" }: BusinessExplorerProps) {
  const [active, setActive] = useState(items[0]?.key);
  const isDark = theme === "dark";
  const current = items.find((i) => i.key === active) ?? items[0];

  return (
    <section className="w-full">
      {/* Cards selector */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setActive(item.key)}
            aria-pressed={active === item.key}
            className="text-left focus:outline-none"
          >
            <Card
              theme={theme}
              className={cn(
                "h-full transition-all",
                active === item.key
                  ? isDark
                    ? "ring-2 ring-blue-400"
                    : "ring-2 ring-blue-600"
                  : "hover:-translate-y-0.5",
              )}
            >
              <h3 className={cn("text-lg font-semibold", isDark ? "text-zinc-100" : "text-zinc-900") }>
                {item.title}
              </h3>
              {item.summary && (
                <p className={cn("mt-2 text-sm", isDark ? "text-zinc-400" : "text-zinc-600") }>
                  {item.summary}
                </p>
              )}
            </Card>
          </button>
        ))}
      </div>

      {/* Active content */}
      {current && (
        <Card className="mt-6" theme={theme}>
          <h4 className={cn("text-base font-semibold", isDark ? "text-zinc-100" : "text-zinc-900") }>
            {current.title}
          </h4>
          <div className={cn("max-w-none text-sm", isDark ? "text-zinc-300" : "text-zinc-600") }>
            {current.content}
          </div>
        </Card>
      )}
    </section>
  );
}
