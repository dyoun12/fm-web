"use client";

import { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/classnames";
import { Card } from "../../atoms/card/card";
import { useAppTheme } from "@/lib/theme-context";

export type FilterBarProps = {
  children?: ReactNode; // Select/Tag/Search 조합을 외부에서 전달
  theme?: "light" | "dark";
} & ComponentPropsWithoutRef<"div">;

export function FilterBar({ children, theme: themeProp, className, ...rest }: FilterBarProps) {
  const appTheme = useAppTheme();
  const theme = themeProp ?? appTheme;
  return (
    <Card padding="sm" theme={theme} className={cn("flex flex-wrap items-center gap-2", className)} {...rest}>
      {children}
    </Card>
  );
}
