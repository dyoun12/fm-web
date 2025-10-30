"use client";

import { cn } from "@/lib/classnames";

export type AboutCard = { title: string; description: string };

export type AboutOverviewProps = {
  cards: AboutCard[];
  theme?: "light" | "dark";
};

export function AboutOverview({ cards, theme = "light" }: AboutOverviewProps) {
  const isDark = theme === "dark";
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <article
          key={card.title}
          className={cn(
            "rounded-2xl border p-6 shadow-sm",
            isDark ? "border-zinc-700 bg-zinc-900 text-zinc-200" : "border-zinc-200 bg-white",
          )}
        >
          <h3 className={cn("text-lg font-semibold", isDark ? "text-zinc-100" : "text-zinc-900")}>{card.title}</h3>
          <p className={cn("mt-2 text-sm", isDark ? "text-zinc-400" : "text-zinc-600")}>{card.description}</p>
        </article>
      ))}
    </section>
  );
}

