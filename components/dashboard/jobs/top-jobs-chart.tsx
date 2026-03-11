"use client";

import { useMemo } from "react";
import { useTheme } from "next-themes";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { QueryStatePanel } from "@/components/misc/query-state-panel";
import { useFetchViewJobRow } from "@/hooks/jobs/useFetchJobTable";
import { useFetchTechSummary } from "@/hooks/technicians/useFetchTechSummary";

// Light mode colors (default) & Dark mode colors
const PALETTE_LIGHT = ["#e8440a", "#1a7a4a", "#2563eb", "#7c3aed", "#0d9488"];
const PALETTE_DARK = ["#ff6b3d", "#34d399", "#60a5fa", "#a78bfa", "#2dd4bf"];

// Fallback additional colors for more than 5 entries
const PALETTE_EXTENDED = [
  "#f59e0b",
  "#ec4899",
  "#8b5cf6",
  "#06b6d4",
  "#10b981",
  "#f97316",
  "#6366f1",
  "#14b8a6",
];

export function TopJobsChart() {
  const { theme } = useTheme();
  const {
    data: jobs = [],
    isLoading: isJobsLoading,
    isError: isJobsError,
    error: jobsError,
  } = useFetchViewJobRow();
  const {
    data: techSummaries = [],
    isLoading: isTechLoading,
    isError: isTechError,
    error: techError,
  } = useFetchTechSummary();

  const isLoading = isJobsLoading || isTechLoading;
  const isError = isJobsError || isTechError;
  const errorMessage = jobsError?.message || techError?.message;

  const techNameMap = useMemo(() => {
    const m = new Map<string, string>();
    for (const t of techSummaries)
      if (t.technician_id && t.name) m.set(t.technician_id, t.name);
    return m;
  }, [techSummaries]);

  const data = useMemo(
    () =>
      [...jobs]
        .sort((a, b) => (b.subtotal ?? 0) - (a.subtotal ?? 0))
        .slice(0, 10)
        .map((j) => ({
          label: j.work_title ?? j.category ?? "Unknown",
          address: j.address ?? "Unknown",
          tech: j.technician_id
            ? (techNameMap.get(j.technician_id) ?? "?")
            : "?",
          gross: j.subtotal ?? 0,
          category: j.category ?? "Uncategorized",
        })),
    [jobs, techNameMap],
  );
  const categoryColorMap = useMemo(() => {
    const map = new Map<string, string>();
    const basePalette = theme === "dark" ? PALETTE_DARK : PALETTE_LIGHT;
    const allColors = [...basePalette, ...PALETTE_EXTENDED];
    data.forEach((_, index) => {
      map.set(`entry-${index}`, allColors[index % allColors.length]);
    });
    return map;
  }, [data, theme]);

  const chartConfig = useMemo(
    () =>
      Object.fromEntries(
        Array.from(categoryColorMap.entries()).map(([cat, color]) => [
          cat,
          { label: cat, color },
        ]),
      ) satisfies ChartConfig,
    [categoryColorMap],
  );

  return (
    <QueryStatePanel
      isLoading={isLoading}
      isError={isError}
      errorMessage={errorMessage}
      loadingMessage="Loading top jobs chart..."
    >
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-foreground">
            Top Jobs by Revenue
          </h3>
          <p className="text-xs text-muted-foreground">
            Highest grossing jobs - YTD
          </p>
        </div>
        <ChartContainer config={chartConfig} className="h-75 w-full">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ left: 0, right: 12 }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="label"
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={160}
              tick={{ fontSize: 11 }}
            />
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) =>
                    `$${Number(value).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`
                  }
                  labelFormatter={(_, payload) => {
                    const item = payload[0]?.payload;
                    return item
                      ? `${item.address} (${item.tech}) · ${item.category}`
                      : "";
                  }}
                />
              }
            />
            <Bar dataKey="gross" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    categoryColorMap.get(`entry-${index}`) ?? PALETTE_LIGHT[0]
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
    </QueryStatePanel>
  );
}
