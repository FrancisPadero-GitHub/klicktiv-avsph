"use client";

import {
  DollarSign,
  TrendingUp,
  Briefcase,
  Wrench,
  // Coins,
  ClipboardList,
  CalendarDays,
} from "lucide-react";
import { cn } from "@/lib/utils";

import {
  useFetchJobsV2,
  type JobsSummaryFilter,
} from "@/hooks/jobs/useFetchJobsV2";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { QueryStatePanel } from "@/components/misc/query-state-panel";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n,
  );

const monthOptions = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const MODE_LABELS: Record<NonNullable<JobsSummaryFilter["mode"]>, string> = {
  all: "All Time",
  year: "Year",
  month: "Month",
  week: "Week",
  day: "Date",
  range: "Range",
};

interface JobSummaryCardsProps {
  filter: JobsSummaryFilter;
  onFilterChange?: (filter: JobsSummaryFilter) => void;
}

export function JobSummaryCards({
  filter,
  onFilterChange,
}: JobSummaryCardsProps) {
  const now = new Date();
  const mode = filter.mode ?? "all";
  const year = filter.year ?? now.getFullYear();
  const month = filter.month ?? now.getMonth() + 1;
  const isoWeek = filter.isoWeek ?? "";
  const date = filter.date ?? "";
  const startDate = filter.startDate ?? "";
  const endDate = filter.endDate ?? "";

  const { data: summary, isLoading, isError, error } = useFetchJobsV2(filter);

  const totalJobs = summary?.total_jobs ?? 0;
  const grossRevenue = summary?.gross_revenue ?? 0;
  const partsCost = summary?.parts_total_cost ?? 0;
  const netRevenue = summary?.net_revenue ?? 0;
  // const techTips = summary?.technician_total_tips ?? 0;
  const totalTechCommission = summary?.total_commission ?? 0;
  const companyNet = summary?.total_company_net_earned ?? 0;

  const summaryCards = [
    {
      label: "Total Jobs Done",
      value: totalJobs.toLocaleString(),
      Icon: ClipboardList,
      color: "text-secondary-foreground",
      valueColor: "text-foreground",
      bg: "bg-accent",
    },
    {
      label: "Gross Revenue",
      value: fmt(grossRevenue),
      Icon: DollarSign,
      color: "text-secondary-foreground",
      valueColor: "text-foreground",
      bg: "bg-accent",
    },
    {
      label: "Parts Cost",
      value: fmt(partsCost),
      Icon: Wrench,
      color: "text-secondary-foreground",
      valueColor: "text-primary",
      bg: "bg-accent",
    },
    {
      label: "Net Revenue",
      value: fmt(netRevenue),
      Icon: TrendingUp,
      color: "text-secondary-foreground",
      valueColor: "text-chart-3",
      bg: "bg-accent",
    },
    // {
    //   label: "Technician Tips",
    //   value: fmt(techTips),
    //   Icon: Coins,
    //   color: "text-secondary-foreground",
    //   valueColor: "text-yellow-500 dark:text-yellow-400",
    //   bg: "bg-accent",
    // },
    {
      label: "Total Commission",
      value: fmt(totalTechCommission),
      Icon: Briefcase,
      color: "text-secondary-foreground",
      valueColor: "text-amber-600",
      bg: "bg-accent",
    },
    {
      label: "Company Net",
      value: fmt(companyNet),
      Icon: Briefcase,
      color: "text-secondary-foreground",
      valueColor: "text-success",
      bg: "bg-accent",
    },
  ];

  const yearOptions = Array.from(
    { length: 8 },
    (_, idx) => now.getFullYear() - idx,
  );

  const handleFilterChange = (updates: Partial<JobsSummaryFilter>) => {
    const newFilter: JobsSummaryFilter = { ...filter, ...updates };
    onFilterChange?.(newFilter);
  };

  const hasContextualPicker =
    mode === "year" ||
    mode === "month" ||
    mode === "week" ||
    mode === "day" ||
    mode === "range";

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Time Period
          </p>
        </div>

        {/* Mode pill buttons */}
        <div className="flex flex-wrap gap-1.5">
          {(
            Object.entries(MODE_LABELS) as [
              NonNullable<JobsSummaryFilter["mode"]>,
              string,
            ][]
          ).map(([value, label]) => (
            <button
              key={value}
              onClick={() => handleFilterChange({ mode: value })}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-medium transition-all",
                mode === value
                  ? "bg-foreground text-background shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Contextual pickers */}
        {hasContextualPicker && (
          <div className="mt-3 flex flex-wrap items-end gap-3 border-t border-border pt-3">
            {(mode === "year" || mode === "month") && (
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Year
                </label>
                <Select
                  value={String(year)}
                  onValueChange={(value) =>
                    handleFilterChange({ year: Number(value) })
                  }
                >
                  <SelectTrigger size="sm" className="w-28">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map((y) => (
                      <SelectItem key={y} value={String(y)}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {mode === "month" && (
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Month
                </label>
                <Select
                  value={String(month)}
                  onValueChange={(value) =>
                    handleFilterChange({ month: Number(value) })
                  }
                >
                  <SelectTrigger size="sm" className="w-36">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {monthOptions.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {mode === "week" && (
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Week
                </label>
                <Input
                  type="week"
                  size={16}
                  value={isoWeek}
                  onChange={(e) =>
                    handleFilterChange({ isoWeek: e.target.value })
                  }
                  className="h-8 w-44 text-sm"
                />
              </div>
            )}

            {mode === "day" && (
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Date
                </label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => handleFilterChange({ date: e.target.value })}
                  className="h-8 w-40 text-sm"
                />
              </div>
            )}

            {mode === "range" && (
              <>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    From
                  </label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) =>
                      handleFilterChange({ startDate: e.target.value })
                    }
                    className="h-8 w-40 text-sm"
                  />
                </div>
                <span className="pb-1.5 text-sm text-muted-foreground">→</span>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    To
                  </label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) =>
                      handleFilterChange({ endDate: e.target.value })
                    }
                    className="h-8 w-40 text-sm"
                  />
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Summary cards */}
      <QueryStatePanel
        isLoading={isLoading}
        isError={isError}
        errorMessage={error?.message}
        loadingMessage="Loading summary cards..."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
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
