"use client";

import { useState } from "react";
import { cn } from "@/lib/classnames";
import { Input } from "../../atoms/input/input";
import { Checkbox } from "../../atoms/checkbox/checkbox";
import { Card } from "../../atoms/card/card";

export type CategoryFilter = {
  id: string;
  label: string;
  count?: number;
};

export type CategoryFilterPanelProps = {
  categories: CategoryFilter[];
  onFilterChange?: (selected: string[]) => void;
  onSearchChange?: (value: string) => void;
  theme?: "light" | "dark";
};

export function CategoryFilterPanel({
  categories,
  onFilterChange,
  onSearchChange,
  theme = "light",
}: CategoryFilterPanelProps) {
  const isDark = theme === "dark";
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const toggleCategory = (id: string) => {
    const next = selected.includes(id)
      ? selected.filter((item) => item !== id)
      : [...selected, id];
    setSelected(next);
    onFilterChange?.(next);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    onSearchChange?.(value);
  };

  return (
    <Card className="flex w-full max-w-xs flex-col gap-4" theme={theme}>
      <h2 className={cn("text-lg font-semibold", isDark ? "text-zinc-100" : "text-zinc-900")}>카테고리 필터</h2>
      <Input
        label="검색"
        hideLabel
        placeholder="검색어를 입력하세요"
        value={search}
        onChange={(event) => handleSearch(event.target.value)}
        theme={theme}
      />
      <div className="flex flex-col gap-3">
        {categories.map((category) => (
          <Checkbox
            key={category.id}
            label={category.label}
            description={
              typeof category.count === "number"
                ? `게시물 ${category.count}개`
                : undefined
            }
            checked={selected.includes(category.id)}
            onChange={() => toggleCategory(category.id)}
            className={cn(
              "border border-transparent rounded-lg px-2 py-1 hover:border-blue-200",
              selected.includes(category.id) && (isDark ? "border-blue-400 bg-blue-950/20" : "border-blue-200 bg-blue-50"),
            )}
            theme={theme}
          />
        ))}
      </div>
      <button
        type="button"
        className={cn("self-start rounded-full border px-4 py-2 text-sm font-medium transition hover:border-blue-200 hover:text-blue-600", isDark ? "border-zinc-700 text-zinc-300" : "border-zinc-200 text-zinc-600")}
        onClick={() => {
          setSelected([]);
          onFilterChange?.([]);
        }}
      >
        필터 초기화
      </button>
    </Card>
  );
}
