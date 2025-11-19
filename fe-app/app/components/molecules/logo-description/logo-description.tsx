"use client";

import { ComponentPropsWithoutRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/classnames";

export type LogoDescriptionProps = {
  title: string;
  description?: string;
  imageUrl: string;
  imageAlt: string;
  bullets?: string[];
  theme?: "light" | "dark";
  className?: string;
} & Omit<ComponentPropsWithoutRef<"section">, "className">;

export function LogoDescription({
  title,
  description,
  imageUrl,
  imageAlt,
  bullets,
  theme = "light",
  className,
  ...rest
}: LogoDescriptionProps) {
  const isDark = theme === "dark";
  return (
    <section
      className={cn(
        "grid items-center gap-6 md:grid-cols-2",
        isDark ? "text-zinc-100" : "text-zinc-900",
        className,
      )}
      {...rest}
    >
      <div className="flex flex-col gap-3 md:order-1">
        <h3 className="text-2xl font-semibold">{title}</h3>
        {description && <p className="text-sm text-zinc-600">{description}</p>}
        {bullets && bullets.length > 0 && (
          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-zinc-600">
            {bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        )}
      </div>
      <div className="md:order-2 relative">
        <div className="relative aspect-[16/9]">
          <Image src={imageUrl} alt={imageAlt} fill className="object-cover" />
        </div>
      </div>
    </section>
  );
}
