"use client";
import {
  PiggyBank,
  BarChart,
  Factory,
  Award,
  Banknote,
  Building2,
  Trophy,
  BadgeDollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { QueryStatePanel } from "@/components/misc/query-state-panel";
import { fmt } from "@/lib/helper";
import { useDashboardMetrics } from "@/hooks/dashboard/rpc/useDashboardMetrics";
import { useAuth } from "@/components/auth-provider";

export function JobSummaryCards() {
  const { company_id } = useAuth();

  const {
    data: metrics,
    isLoading: isMetricsLoading,
    isError: isMetricsError,
    error: metricsError,
  } = useDashboardMetrics({
    p_company_id: company_id ?? "",
    p_technician_id: undefined,
    p_start_date: undefined,
    p_end_date: undefined,
    p_all_time: true,
  });

  const kpis = [
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
      label: "Total Commission",
      value: fmt(metrics?.total_technician_commission ?? 0),
      icon: BarChart,
      color: "text-amber-600",
      valueColor: "text-amber-600",
      sub: "After tech payouts, excluded tips",
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
      label: "Technician Tips",
      value: fmt(metrics?.technician_total_tips ?? 0),
      icon: Award,
      color: "text-yellow-500 dark:text-yellow-400",
      valueColor: "text-yellow-500 dark:text-yellow-400",
      sub: "Excluded from all calculations",
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
      <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
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

              {/* Value — shrinks font on tiny cards via clamp */}
              <p
                title={value}
                className={cn(
                  "mt-1.5 min-w-0 truncate font-bold tabular-nums",
                  // fluid: ~18px on xs, up to 24px on md+
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
