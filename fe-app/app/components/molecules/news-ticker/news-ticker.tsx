"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/classnames";

export type NewsTickerItem = {
  id: string;
  title: string;
  href: string;
  category?: string;
};

export type NewsTickerProps = {
  items: NewsTickerItem[];
  intervalMs?: number;
  autoplay?: boolean;
};

export function NewsTicker({
  items,
  intervalMs = 4000,
  autoplay = true,
}: NewsTickerProps) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!autoplay || items.length <= 1) return undefined;

    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, intervalMs);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [autoplay, intervalMs, items.length]);

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-500">
        아직 등록된 소식이 없습니다.
      </div>
    );
  }

  return (
    <section className="flex w-full items-center gap-4 overflow-hidden rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
      <span className="flex items-center gap-2 font-semibold">
        <span aria-hidden="true">📣</span>
        최신 소식
      </span>
      <div className="relative flex-1 overflow-hidden">
        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="flex min-w-full items-center gap-3"
            >
              {item.category && (
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-blue-600">
                  {item.category}
                </span>
              )}
              <span className="truncate">{item.title}</span>
            </Link>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-1" aria-label="슬라이드 위치">
        {items.map((item, itemIndex) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setIndex(itemIndex)}
            className={cn(
              "h-2 w-2 rounded-full border border-blue-300 transition",
              index === itemIndex ? "bg-blue-600" : "bg-white",
            )}
            aria-label={`${itemIndex + 1}번째 소식 보기`}
          />
        ))}
      </div>
    </section>
  );
}
