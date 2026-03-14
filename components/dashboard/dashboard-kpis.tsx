"use client";

import {
  BadgeDollarSign,
  FileBadge,
  FileChartLine,
  PiggyBank,
  Building2,
  Banknote,
  Percent,
  Trophy,
  BarChart,
  Factory,
  Award,
  AirVent,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fmt, resolveDateRange } from "@/lib/helper";
import { useMemo } from "react";
import { useDashboardMetrics } from "@/hooks/dashboard/rpc/useDashboardMetrics";
import { QueryStatePanel } from "@/components/misc/query-state-panel";
import { useDashboardFilterStore } from "@/features/store/dashboard/useDashboardFilterStore";

export function DashboardKPIs({ companyId }: { companyId: string }) {
  const { mode, year, month, isoWeek, date, startDate, endDate, technicianId } =
    useDashboardFilterStore();

  const { p_start_date, p_end_date } = useMemo(
    () =>
      resolveDateRange(mode, year, month, isoWeek, date, startDate, endDate),
    [mode, year, month, isoWeek, date, startDate, endDate],
  );

  const {
    data: metrics,
    isLoading: isMetricsLoading,
    isError: isMetricsError,
    error: metricsError,
  } = useDashboardMetrics({
    p_company_id: companyId,
    p_technician_id:
      technicianId === "all" || technicianId == null ? undefined : technicianId,
    p_start_date,
    p_end_date,
    p_all_time: mode === "all",
  });

  const kpis = [
    {
      label: "Estimate Pipeline",
      value: fmt(metrics?.total_estimate_pipeline ?? 0),
      icon: FileChartLine,
      sub: "Total of potential revenue in estimates",
      color: "text-chart-4",
      valueColor: "text-chart-4",
      bg: "bg-accent",
    },
    {
      label: "Gross Revenue",
      value: fmt(metrics?.gross_revenue ?? 0),
      icon: BadgeDollarSign,
      sub: `From ${metrics?.total_jobs_done} completed jobs`,
      color: "text-foreground",
      valueColor: "text-foreground",
      bg: "bg-accent",
    },
    {
      label: "Deposits Received",
      title: "Partially paid by customers at time of booking",
      value: fmt(metrics?.total_deposits ?? 0),
      icon: PiggyBank,
      sub: "Uncounted in revenue upon fully paid jobs",
      color: "text-[#64748B]",
      valueColor: "text-[#64748B]",
      bg: "bg-accent",
    },
    {
      label: "Parts Cost",
      value: fmt(metrics?.parts_costs ?? 0),
      icon: Factory,
      sub: "Total parts expense",
      color: "text-primary",
      valueColor: "text-primary",
      bg: "bg-accent",
    },
    {
      label: "Net Revenue",
      value: fmt(metrics?.net_revenue ?? 0),
      icon: Banknote,
      sub: "Gross minus parts cost",
      color: "text-chart-3",
      valueColor: "text-chart-3",
      bg: "bg-accent",
    },
    {
      label: "Avg Revenue / Job",
      value: fmt(metrics?.avg_revenue ?? 0),
      icon: AirVent,
      sub: `Based on ${metrics?.total_jobs_done} done jobs`,
      color: "text-chart-3",
      valueColor: "text-chart-3",
      bg: "bg-accent",
    },
    {
      label: "Total Commission",
      value: fmt(metrics?.total_technician_commission ?? 0),
      icon: BarChart,
      color: "text-amber-600",
      valueColor: "text-amber-600",
      sub: "After tech payouts, excluded tips",
      bg: "bg-accent",
    },
    {
      label: "Tech Commission margin",
      value: ((metrics?.tech_commission_margin || 0) * 100).toFixed(2) + "%",
      icon: Percent,
      sub: "Tech commission % of net revenue",
      color: "text-amber-600",
      valueColor: "text-amber-600",
      bg: "bg-accent",
    },
    {
      label: "Company Net",
      value: fmt(metrics?.total_company_net ?? 0),
      icon: Building2,
      sub: "After tech payouts & parts",
      color: "text-success",
      valueColor: "text-success",
      bg: "bg-accent",
    },
    {
      label: "Company Net Margin",
      value: ((metrics?.company_net_margin || 0) * 100).toFixed(2) + "%",
      icon: Percent,
      sub: "Company net % of net revenue",
      color: "text-success",
      valueColor: "text-success",
      bg: "bg-accent",
    },
    {
      label: "Technician Tips",
      value: fmt(metrics?.technician_total_tips ?? 0),
      icon: Award,
      color: "text-yellow-500 dark:text-yellow-400",
      valueColor: "text-yellow-500 dark:text-yellow-400",
      sub: "Excluded from all calculations",
      bg: "bg-accent",
    },
    {
      label: "Reviews",
      value: fmt(metrics?.review_records_total ?? 0),
      icon: FileBadge,
      sub: "Total reviews amount received",
      color: "text-foreground",
      valueColor: "text-foreground",
      bg: "bg-accent",
    },
    {
      label: "Total Jobs",
      value: metrics?.total_jobs_done.toString(),
      icon: Trophy,
      sub: `${metrics?.total_jobs_done ?? 0} done · ${metrics?.total_jobs_pending ?? 0} pending`,
      color: "text-secondary-foreground",
      valueColor: "text-secondary-foreground",
      bg: "bg-accent",
    },
  ];

  return (
    <QueryStatePanel
      isLoading={isMetricsLoading}
      isError={isMetricsError}
      errorMessage={metricsError?.message}
    >
      <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {kpis.map(
          ({ label, title, value, icon: Icon, sub, color, valueColor, bg }) => (
            <div
              key={label}
              title={title}
              className="flex min-w-0 flex-col rounded-xl border border-border bg-card p-3 sm:p-4"
            >
              {/* Header row: label + icon */}
              <div className="flex min-w-0 items-start justify-between gap-1">
                <p className="min-w-0 truncate text-[10px] font-medium uppercase tracking-wide text-muted-foreground sm:text-xs">
                  {label}
                </p>
                <div className={cn("shrink-0 rounded-md p-1 sm:p-1.5", bg)}>
                  <Icon className={cn("h-3 w-3 sm:h-3.5 sm:w-3.5", color)} />
                </div>
              </div>

              {/* Value */}
              <p
                title={value}
                className={cn(
                  "mt-1.5 min-w-0 truncate font-bold tabular-nums",
                  "text-lg leading-tight sm:text-xl lg:text-2xl",
                  valueColor,
                )}
              >
                {value}
              </p>

              {/* Sub-label — hidden on very small screens to save space */}
              <p className="mt-1 hidden truncate text-xs text-muted-foreground sm:block">
                {sub}
              </p>
            </div>
          ),
        )}
      </div>
    </QueryStatePanel>
  );
}
