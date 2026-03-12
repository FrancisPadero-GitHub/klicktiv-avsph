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
import { useFetchJobSummary } from "@/hooks/jobs/useFetchJobSummary";
import { QueryStatePanel } from "@/components/misc/query-state-panel";
const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n,
  );

export function JobSummaryCards() {
  const { data: summary, isLoading, isError, error } = useFetchJobSummary();

  // v_jobs_summary returns an array, but for summary, we expect a single row per company
  // the hook already filters by company, so we can safely take the first row if it exists
  const summaryRow = summary && summary.length > 0 ? summary[0] : undefined;

  const totalJobs = summaryRow?.total_jobs ?? 0;
  const totalDeposits = summaryRow?.total_deposits ?? 0;
  const grossRevenue = summaryRow?.gross_revenue ?? 0;
  const partsCost = summaryRow?.parts_total_cost ?? 0;
  const netRevenue = summaryRow?.net_revenue ?? 0;
  const techTips = summaryRow?.technician_total_tips ?? 0;
  const totalTechCommission = summaryRow?.total_commission ?? 0;
  const companyNet = summaryRow?.total_company_net_earned ?? 0;

  const summaryCards = [
    {
      label: "Completed Jobs",
      value: totalJobs,
      Icon: Trophy,
      color: "text-secondary-foreground",
      valueColor: "text-foreground",
      bg: "bg-accent",
    },
    {
      label: "Deposits",
      value: fmt(totalDeposits),
      Icon: PiggyBank,
      color: "text-[#64748B]",
      valueColor: "text-foreground",
      bg: "bg-accent",
    },
    {
      label: "Gross Revenue",
      value: fmt(grossRevenue),
      Icon: BadgeDollarSign,
      color: "text-secondary-foreground",
      valueColor: "text-foreground",
      bg: "bg-accent",
    },
    {
      label: "Parts Cost",
      value: fmt(partsCost),
      Icon: Factory,
      color: "text-secondary-foreground",
      valueColor: "text-primary",
      bg: "bg-accent",
    },
    {
      label: "Net Revenue",
      value: fmt(netRevenue),
      Icon: Banknote,
      color: "text-secondary-foreground",
      valueColor: "text-chart-3",
      bg: "bg-accent",
    },
    {
      label: "Technician Tips",
      value: fmt(techTips),
      Icon: Award,
      color: "text-secondary-foreground",
      valueColor: "text-yellow-500 dark:text-yellow-400",
      bg: "bg-accent",
    },
    {
      label: "Total Commission",
      value: fmt(totalTechCommission),
      Icon: BarChart,
      color: "text-secondary-foreground",
      valueColor: "text-amber-600",
      bg: "bg-accent",
    },
    {
      label: "Company Net",
      value: fmt(companyNet),
      Icon: Building2,
      color: "text-secondary-foreground",
      valueColor: "text-success",
      bg: "bg-accent",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <QueryStatePanel
        isLoading={isLoading}
        isError={isError}
        errorMessage={error?.message}
        loadingMessage="Loading summary cards..."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {summaryCards.map(({ label, value, Icon, color, bg, valueColor }) => (
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
              <p
                className={cn(
                  "mt-2 text-2xl font-bold tabular-nums",
                  valueColor,
                )}
              >
                {value}
              </p>
            </div>
          ))}
        </div>
      </QueryStatePanel>
    </div>
  );
}
