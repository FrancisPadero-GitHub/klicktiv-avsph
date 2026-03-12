"use client";

import {
  BadgeDollarSign,
  FileBadge,
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
import { fmtUSD } from "@/lib/decimal";
import type { DashboardMetrics } from "@/hooks/dashboard/useDashboardData";

interface DashboardKPIsProps {
  metrics: DashboardMetrics;
  techCount: number;
}

export function DashboardKPIs({ metrics }: DashboardKPIsProps) {
  const kpis = [
    {
      label: "Total Jobs",
      value: metrics.totalJobs.toString(),
      icon: Trophy,
      sub: `${metrics.doneJobs} done · ${metrics.pendingJobs} pending`,
      color: "text-secondary-foreground",
      bg: "bg-accent",
    },
    {
      label: "Gross Revenue",
      value: fmtUSD(metrics.grossRevenue),
      icon: BadgeDollarSign,
      sub: `From ${metrics.doneJobs} completed jobs`,
      color: "text-foreground",
      bg: "bg-accent",
    },
    {
      label: "Deposits Received",
      value: fmtUSD(metrics.totalDeposits),
      icon: PiggyBank,
      sub: "Uncounted in revenue upon fully paid jobs",
      color: "text-[#64748B]",
      bg: "bg-accent",
    },
    {
      label: "Parts Cost",
      value: fmtUSD(metrics.partsCost),
      icon: Factory,
      sub: "Total parts expense",
      color: "text-primary",
      bg: "bg-accent",
    },
    {
      label: "Net Revenue",
      value: fmtUSD(metrics.netRevenue),
      icon: Banknote,
      sub: "Gross minus parts cost",
      color: "text-chart-3",
      bg: "bg-accent",
    },
    {
      label: "Avg Revenue / Job",
      value: fmtUSD(metrics.avgRevenuePerJob),
      icon: AirVent,
      sub: `Based on ${metrics.doneJobs} done jobs`,
      color: "text-amber-600",
      bg: "bg-accent",
    },

    {
      label: "Total Commission",
      value: fmtUSD(metrics.technicianCommission),
      icon: BarChart,
      color: "text-amber-600",
      sub: "After tech payouts, excluded tips",
      bg: "bg-accent",
    },
    {
      label: "Company Net",
      value: fmtUSD(metrics.companyNet),
      icon: Building2,
      sub: "After tech payouts & parts",
      color: "text-success",
      bg: "bg-accent",
    },
    {
      label: "Net Margin",
      value: `${metrics.companyNetMarginPct}%`,
      icon: Percent,
      sub: "Company net % of gross revenue",
      color: "text-success",
      bg: "bg-accent",
    },

    {
      label: "Technician Tips",
      value: fmtUSD(metrics.totalTips),
      icon: Award,
      color: "text-yellow-500 dark:text-yellow-400",
      sub: "Excluded from all calculations",
      bg: "bg-accent",
    },

    {
      label: "Reviews",
      value: fmtUSD(metrics.totalReviewAmount),
      icon: FileBadge,
      sub: "Total reviews amount received",
      color: "text-foreground",
      bg: "bg-accent",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {" "}
      {kpis.map(({ label, value, icon: Icon, sub, color, bg }) => (
        <div
          key={label}
          className="rounded-xl border border-border bg-card p-4"
        >
          <div className="flex items-start justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {label}
            </p>
            <div className={cn("rounded-md p-1.5", bg)}>
              <Icon className={cn("h-3.5 w-3.5", color)} />
            </div>
          </div>
          <p className={cn("mt-2 text-2xl font-bold tabular-nums", color)}>
            {value}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
        </div>
      ))}
    </div>
  );
}
