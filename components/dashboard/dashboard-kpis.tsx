"use client";

import {
  TrendingUp,
  Briefcase,
  Users,
  DollarSign,
  Percent,
  Wrench,
  Banknote,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fmtUSD } from "@/lib/decimal";
import type { DashboardMetrics } from "@/hooks/dashboard/useDashboardData";

interface DashboardKPIsProps {
  metrics: DashboardMetrics;
  techCount: number;
}

export function DashboardKPIs({ metrics, techCount }: DashboardKPIsProps) {
  const kpis = [
    {
      label: "Gross Revenue",
      value: fmtUSD(metrics.grossRevenue),
      icon: DollarSign,
      sub: `From ${metrics.doneJobs} completed jobs`,
      color: "text-foreground",
      bg: "bg-muted",
    },
    {
      label: "Company Net",
      value: fmtUSD(metrics.companyNet),
      icon: TrendingUp,
      sub: "After tech payouts & parts",
      color: "text-success",
      bg: "bg-success/20",
    },
    {
      label: "Net Revenue",
      value: fmtUSD(metrics.netRevenue),
      icon: Banknote,
      sub: "Gross minus parts cost",
      color: "text-chart-3",
      bg: "bg-chart-3/20",
    },
    {
      label: "Net Margin",
      value: `${metrics.companyNetMarginPct}%`,
      icon: Percent,
      sub: "Company net / gross",
      color: "text-chart-4",
      bg: "bg-chart-4/20",
    },
    {
      label: "Total Jobs",
      value: metrics.totalJobs.toString(),
      icon: Briefcase,
      sub: `${metrics.doneJobs} done · ${metrics.pendingJobs} pending`,
      color: "text-foreground",
      bg: "bg-muted",
    },
    {
      label: "Avg Revenue / Job",
      value: fmtUSD(metrics.avgRevenuePerJob),
      icon: DollarSign,
      sub: `Based on ${metrics.doneJobs} done jobs`,
      color: "text-chart-5",
      bg: "bg-chart-5/20",
    },
    {
      label: "Parts Cost",
      value: fmtUSD(metrics.partsCost),
      icon: Wrench,
      sub: "Total parts expense",
      color: "text-chart-1",
      bg: "bg-chart-1/20",
    },
    {
      label: "Active Technicians",
      value: techCount.toString(),
      icon: Users,
      sub: "Currently active",
      color: "text-primary",
      bg: "bg-primary/20",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
