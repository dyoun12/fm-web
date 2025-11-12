"use client";

import { Children, isValidElement, type ReactElement, type ReactNode, useMemo, useState } from "react";
import { cn } from "@/lib/classnames";
import { Card } from "../../atoms/card/card";

export type VisionItem = {
  key: string;
  title: string;
  // 아래 필드는 하위 호환을 위한 옵션(권장: children 기반 콘텐츠 구성)
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
};

export type VisionValuesProps = {
  items: VisionItem[];
  theme?: "light" | "dark";
  children?: ReactNode; // 탭별 자유로운 콘텐츠 제공 (VisionValuesContent 사용 권장)
};

export type VisionValuesContentProps = {
  tabKey: string; // items[].key 와 매칭
  children: ReactNode;
};

export function VisionValuesContent({ children }: VisionValuesContentProps) {
  return <>{children}</>;
}

export function VisionValues({ items, theme = "light", children }: VisionValuesProps) {
  const [active, setActive] = useState(items[0]?.key);
  const isDark = theme === "dark";
  const current = items.find((i) => i.key === active) ?? items[0];

  const contentMap = useMemo(() => {
    const map = new Map<string, ReactNode>();
    if (!children) return map;
    const arr = Children.toArray(children);
    for (const child of arr) {
      if (isValidElement<VisionValuesContentProps>(child)) {
        const el = child as ReactElement<VisionValuesContentProps>;
        const keyProp = el.props?.tabKey ?? undefined;
        if (keyProp) {
          map.set(keyProp, el);
        }
      }
    }
    return map;
  }, [children]);
  return (
    <div>
      <nav className="mb-4 flex flex-wrap gap-2">
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
        <div>
          <div className={cn(
            "mt-3 gap-4",
            current.imageUrl ? "grid md:grid-cols-2 md:items-stretch" : "",
          )}>            
            {current.imageUrl && (
              <div className="overflow-hidden rounded-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={current.imageUrl}
                  alt={current.imageAlt || `${current.title} 이미지`}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <Card theme={theme} className="h-full flex flex-col justify-center">
              {contentMap.get(current.key) ?? (
                current.description ? (
                  <p
                    className={cn(
                      "whitespace-pre-line text-sm leading-relaxed",
                      isDark ? "text-zinc-400" : "text-zinc-600",
                    )}
                  >
                    {current.description}
                  </p>
                ) : null
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
