"use client";

import {
  DollarSign,
  TrendingUp,
  Briefcase,
  Wrench,
  Coins,
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
  const techTips = summary?.technician_total_tips ?? 0;
  const companyNet = summary?.total_company_net_earned ?? 0;

  const summaryCards = [
    {
      label: "Total Jobs Done",
      value: totalJobs.toLocaleString(),
      Icon: ClipboardList,
      color: "text-zinc-900 dark:text-zinc-50",
      bg: "bg-zinc-100 dark:bg-zinc-800",
    },
    {
      label: "Gross Revenue",
      value: fmt(grossRevenue),
      Icon: DollarSign,
      color: "text-zinc-900 dark:text-zinc-50",
      bg: "bg-zinc-100 dark:bg-zinc-800",
    },
    {
      label: "Parts Cost",
      value: fmt(partsCost),
      Icon: Wrench,
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-50 dark:bg-orange-900/20",
    },
    {
      label: "Net Revenue",
      value: fmt(netRevenue),
      Icon: TrendingUp,
      color: "text-sky-600 dark:text-sky-400",
      bg: "bg-sky-50 dark:bg-sky-900/20",
    },
    {
      label: "Technician Tips",
      value: fmt(techTips),
      Icon: Coins,
      color: "text-lime-600 dark:text-lime-400",
      bg: "bg-lime-50 dark:bg-lime-900/20",
    },
    {
      label: "Company Net",
      value: fmt(companyNet),
      Icon: Briefcase,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
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
      <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-2 mb-3">
          <CalendarDays className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500" />
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
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
                  ? "bg-zinc-900 text-white shadow-sm dark:bg-zinc-50 dark:text-zinc-900"
                  : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-200",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Contextual pickers */}
        {hasContextualPicker && (
          <div className="mt-3 flex flex-wrap items-end gap-3 border-t border-zinc-100 pt-3 dark:border-zinc-800">
            {(mode === "year" || mode === "month") && (
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
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
                <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
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
                <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
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
                <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
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
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
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
                <span className="pb-1.5 text-sm text-zinc-400 dark:text-zinc-500">
                  →
                </span>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {summaryCards.map(({ label, value, Icon, color, bg }) => (
            <div
              key={label}
              className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex items-start justify-between">
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                  {label}
                </p>
                <div className={cn("rounded-md p-1.5", bg)}>
                  <Icon className={cn("h-3.5 w-3.5", color)} />
                </div>
              </div>
              <p className={cn("mt-2 text-2xl font-bold tabular-nums", color)}>
                {value}
              </p>
            </div>
          ))}
        </div>
      </QueryStatePanel>
    </div>
  );
}
