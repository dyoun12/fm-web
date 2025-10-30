"use client";

import { cn } from "@/lib/classnames";

export type DashboardStat = {
  label: string;
  value: string;
  unit?: string;
  trend?: {
    direction: "up" | "down" | "flat";
    value: string;
  };
};

export type RecentActivity = {
  id: string;
  actor: string;
  action: string;
  timestamp: string;
};

export type AdminDashboardOverviewProps = {
  stats: DashboardStat[];
  recentActivities: RecentActivity[];
  alerts?: string[];
  theme?: "light" | "dark";
};

export function AdminDashboardOverview({
  stats,
  recentActivities,
  alerts = [],
  theme = "light",
}: AdminDashboardOverviewProps) {
  const isDark = theme === "dark";
  return (
    <section className="flex flex-col gap-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <article
            key={stat.label}
            className={cn("rounded-2xl p-6 shadow-sm border", isDark ? "border-zinc-700 bg-zinc-900 text-zinc-200" : "border-zinc-200 bg-white")}
          >
            <p className={cn("text-sm", isDark ? "text-zinc-400" : "text-zinc-500")}>{stat.label}</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className={cn("text-3xl font-semibold", isDark ? "text-zinc-100" : "text-zinc-900")}>
                {stat.value}
              </span>
              {stat.unit && (
                <span className={cn("text-sm", isDark ? "text-zinc-400" : "text-zinc-500")}>{stat.unit}</span>
              )}
            </div>
            {stat.trend && (
              <p
                className={cn(
                  "mt-3 flex items-center gap-2 text-sm",
                  stat.trend.direction === "up" && "text-emerald-600",
                  stat.trend.direction === "down" && "text-red-600",
                  stat.trend.direction === "flat" && "text-zinc-500",
                )}
              >
                <span aria-hidden="true">
                  {stat.trend.direction === "up" && "▲"}
                  {stat.trend.direction === "down" && "▼"}
                  {stat.trend.direction === "flat" && "■"}
                </span>
                {stat.trend.value}
              </p>
            )}
          </article>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className={cn("rounded-2xl p-6 shadow-sm border", isDark ? "border-zinc-700 bg-zinc-900 text-zinc-200" : "border-zinc-200 bg-white") }>
          <header className="flex items-center justify-between">
            <h3 className={cn("text-lg font-semibold", isDark ? "text-zinc-100" : "text-zinc-900")}>최근 활동</h3>
            <span className={cn("text-xs", isDark ? "text-zinc-500" : "text-zinc-400")}>최근 24시간</span>
          </header>
          <ul className={cn("mt-4 flex flex-col gap-3 text-sm", isDark ? "text-zinc-400" : "text-zinc-600") }>
            {recentActivities.map((activity) => (
              <li key={activity.id} className="flex flex-col gap-1">
                <span>
                  <strong>{activity.actor}</strong> {activity.action}
                </span>
                <time className={cn("text-xs", isDark ? "text-zinc-500" : "text-zinc-400")} dateTime={activity.timestamp}>
                  {new Date(activity.timestamp).toLocaleString("ko-KR")}
                </time>
              </li>
            ))}
          </ul>
        </section>

        <section className={cn("rounded-2xl p-6", isDark ? "border border-amber-900 bg-amber-950 text-amber-300" : "border border-amber-200 bg-amber-50 text-amber-800") }>
          <h3 className="text-lg font-semibold">알림 및 경고</h3>
          {alerts.length === 0 ? (
            <p className={cn("mt-4 text-sm", isDark ? "text-amber-300/80" : "text-amber-700") }>
              현재 조치가 필요한 알림이 없습니다.
            </p>
          ) : (
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm">
              {alerts.map((alert, index) => (
                <li key={`${alert}-${index}`}>{alert}</li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </section>
  );
}
