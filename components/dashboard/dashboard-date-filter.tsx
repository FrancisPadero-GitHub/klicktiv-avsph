"use client";

import { useMemo } from "react";
import {
  Calendar,
  CalendarDays,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  useDashboardFilterStore,
  type DateFilterMode,
} from "@/features/store/dashboard/useDashboardFilterStore";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const PRESET_BUTTONS: { mode: DateFilterMode; label: string }[] = [
  { mode: "all", label: "All Time" },
  { mode: "year", label: "Year" },
  { mode: "month", label: "Month" },
  { mode: "week", label: "Week" },
  { mode: "day", label: "Day" },
  { mode: "range", label: "Range" },
];

const toISODate = (d: Date) => {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
};

/** Build an array of years from 2020 to current+1 */
const yearOptions = () => {
  const current = new Date().getFullYear();
  const years: number[] = [];
  for (let y = current + 1; y >= 2020; y--) years.push(y);
  return years;
};

function getISOWeekRange(isoWeek: string) {
  const match = isoWeek.match(/^(\d{4})-W(\d{2})$/);
  if (!match) return null;
  const year = Number(match[1]);
  const week = Number(match[2]);
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const jan4Day = jan4.getUTCDay() || 7;
  const mondayWeek1 = new Date(jan4);
  mondayWeek1.setUTCDate(jan4.getUTCDate() - jan4Day + 1);
  const weekStart = new Date(mondayWeek1);
  weekStart.setUTCDate(mondayWeek1.getUTCDate() + (week - 1) * 7);
  const weekEnd = new Date(weekStart);
  weekEnd.setUTCDate(weekStart.getUTCDate() + 6);
  return {
    start: weekStart.toLocaleDateString("en-PH", {
      month: "short",
      day: "numeric",
    }),
    end: weekEnd.toLocaleDateString("en-PH", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  };
}

export function DashboardDateFilter() {
  const store = useDashboardFilterStore();

  const filterSummary = useMemo(() => {
    switch (store.mode) {
      case "all":
        return "Showing all data";
      case "year":
        return `Year ${store.year}`;
      case "month":
        return `${MONTHS[store.month - 1]} ${store.year}`;
      case "week": {
        const range = getISOWeekRange(store.isoWeek);
        return range
          ? `Week: ${range.start}, ${range.end}`
          : `Week: ${store.isoWeek}`;
      }
      case "day":
        return new Date(store.date + "T00:00:00").toLocaleDateString("en-PH", {
          weekday: "short",
          month: "long",
          day: "numeric",
          year: "numeric",
        });
      case "range":
        return `${store.startDate || "start"} → ${store.endDate || "end"}`;
      default:
        return "";
    }
  }, [
    store.mode,
    store.year,
    store.month,
    store.isoWeek,
    store.date,
    store.startDate,
    store.endDate,
  ]);

  // Navigation helpers
  const navigatePrev = () => {
    if (store.mode === "year") {
      store.setYear(store.year - 1);
    } else if (store.mode === "month") {
      if (store.month === 1) {
        store.setYear(store.year - 1);
        store.setMonth(12);
      } else {
        store.setMonth(store.month - 1);
      }
    } else if (store.mode === "week") {
      const match = store.isoWeek.match(/^(\d{4})-W(\d{2})$/);
      if (match) {
        let y = Number(match[1]);
        let w = Number(match[2]) - 1;
        if (w < 1) {
          y -= 1;
          w = 52;
        }
        store.setIsoWeek(`${y}-W${String(w).padStart(2, "0")}`);
      }
    } else if (store.mode === "day") {
      const d = new Date(store.date + "T00:00:00");
      d.setDate(d.getDate() - 1);
      store.setDate(toISODate(d));
    }
  };

  const navigateNext = () => {
    if (store.mode === "year") {
      store.setYear(store.year + 1);
    } else if (store.mode === "month") {
      if (store.month === 12) {
        store.setYear(store.year + 1);
        store.setMonth(1);
      } else {
        store.setMonth(store.month + 1);
      }
    } else if (store.mode === "week") {
      const match = store.isoWeek.match(/^(\d{4})-W(\d{2})$/);
      if (match) {
        let y = Number(match[1]);
        let w = Number(match[2]) + 1;
        if (w > 52) {
          y += 1;
          w = 1;
        }
        store.setIsoWeek(`${y}-W${String(w).padStart(2, "0")}`);
      }
    } else if (store.mode === "day") {
      const d = new Date(store.date + "T00:00:00");
      d.setDate(d.getDate() + 1);
      store.setDate(toISODate(d));
    }
  };

  const showNav = store.mode !== "all" && store.mode !== "range";

  return (
    <div className="space-y-3">
      {/* Mode Selector Row */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 rounded-lg border border-border bg-muted p-1">
          {PRESET_BUTTONS.map(({ mode, label }) => (
            <button
              key={mode}
              onClick={() => store.setMode(mode)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                store.mode === mode
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Navigation Arrows */}
        {showNav && (
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon-xs" onClick={navigatePrev}>
              <ChevronLeft />
            </Button>
            <Button variant="outline" size="icon-xs" onClick={navigateNext}>
              <ChevronRight />
            </Button>
          </div>
        )}

        {/* Reset */}
        <Button
          variant="ghost"
          size="xs"
          onClick={store.reset}
          className="text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="size-3" />
          Reset
        </Button>
      </div>

      {/* Mode-specific controls */}
      <div className="flex flex-wrap items-end gap-3">
        {/* Year Selector, shown for year & month modes */}
        {(store.mode === "year" || store.mode === "month") && (
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Year
            </label>
            <Select
              value={String(store.year)}
              onValueChange={(v) => store.setYear(Number(v))}
            >
              <SelectTrigger size="sm" className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {yearOptions().map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Month Selector */}
        {store.mode === "month" && (
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Month
            </label>
            <Select
              value={String(store.month)}
              onValueChange={(v) => store.setMonth(Number(v))}
            >
              <SelectTrigger size="sm" className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((m, i) => (
                  <SelectItem key={i} value={String(i + 1)}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Week Input */}
        {store.mode === "week" && (
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              ISO Week
            </label>
            <Input
              type="week"
              value={store.isoWeek}
              onChange={(e) => store.setIsoWeek(e.target.value)}
              className="h-8 w-44 text-sm"
            />
          </div>
        )}

        {/* Day Input */}
        {store.mode === "day" && (
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Date
            </label>
            <Input
              type="date"
              value={store.date}
              onChange={(e) => store.setDate(e.target.value)}
              className="h-8 w-44 text-sm"
            />
          </div>
        )}

        {/* Range Inputs */}
        {store.mode === "range" && (
          <>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                From
              </label>
              <Input
                type="date"
                value={store.startDate}
                onChange={(e) => store.setStartDate(e.target.value)}
                className="h-8 w-44 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                To
              </label>
              <Input
                type="date"
                value={store.endDate}
                onChange={(e) => store.setEndDate(e.target.value)}
                className="h-8 w-44 text-sm"
              />
            </div>
          </>
        )}

        {/* Active filter summary badge */}
        <div className="flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1.5 text-xs font-medium text-muted-foreground">
          {store.mode === "range" ? (
            <CalendarRange className="size-3.5" />
          ) : store.mode === "day" ? (
            <Calendar className="size-3.5" />
          ) : (
            <CalendarDays className="size-3.5" />
          )}
          {filterSummary}
        </div>
      </div>
    </div>
  );
}
