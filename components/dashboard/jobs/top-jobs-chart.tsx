"use client";

import { useMemo } from "react";
import { useTheme } from "next-themes";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { QueryStatePanel } from "@/components/misc/query-state-panel";
import { useAuth } from "@/components/auth-provider";
import { useDashboardFilterStore } from "@/features/store/dashboard/useDashboardFilterStore";
import {
  useDashboardExport,
  type ExportParams,
} from "@/hooks/dashboard/rpc/useDashboardExport";
import {
  useDashboardMetrics,
  type MetricsParams,
} from "@/hooks/dashboard/rpc/useDashboardMetrics";
import { resolveDateRange } from "@/lib/helper";

const PALETTE_LIGHT = ["#e8440a", "#1a7a4a", "#2563eb", "#7c3aed", "#0d9488"];
const PALETTE_DARK = ["#ff6b3d", "#34d399", "#60a5fa", "#a78bfa", "#2dd4bf"];
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

function formatCurrencyAxis(value: number) {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `$${(value / 1_000).toFixed(0)}k`;
  return `$${value.toFixed(0)}`;
}

export function TopJobsChart() {
  const { theme } = useTheme();
  const { company_id } = useAuth();
  const { mode, year, month, isoWeek, date, startDate, endDate, technicianId } =
    useDashboardFilterStore();

  const { p_start_date, p_end_date } = useMemo(
    () => resolveDateRange(mode, year, month, isoWeek, date, startDate, endDate),
    [mode, year, month, isoWeek, date, startDate, endDate],
  );

  const rpcParams = useMemo<ExportParams & MetricsParams>(
    () => ({
      p_company_id: company_id ?? "",
      p_technician_id:
        technicianId === "all" || technicianId == null
          ? undefined
          : technicianId,
      p_start_date,
      p_end_date,
      p_all_time: mode === "all",
    }),
    [company_id, technicianId, p_start_date, p_end_date, mode],
  );

  const {
    data: exportData,
    isLoading: isExportLoading,
    isError: isExportError,
    error: exportError,
  } = useDashboardExport(rpcParams);

  const {
    data: metricsData,
    isLoading: isMetricsLoading,
    isError: isMetricsError,
    error: metricsError,
  } = useDashboardMetrics(rpcParams);

  const missingCompanyId = !company_id;
  const isLoading = isExportLoading || isMetricsLoading;
  const isError = missingCompanyId || isExportError || isMetricsError;
  const errorMessage = missingCompanyId
    ? "Company ID is missing from user session"
    : (exportError?.message ?? metricsError?.message);

  const data = useMemo(() => {
    const groups = exportData?.techJobDetailGroups ?? [];

    const rows = groups.flatMap((group) =>
      group.jobs.map((job) => ({
        label: job.address || "Unknown",
        address: job.address || "Unknown",
        tech: group.technician || "Unknown",
        gross: job.gross || 0,
        date: job.date || "",
      })),
    );

    return rows
      .filter((r) => Number.isFinite(r.gross) && r.gross > 0)
      .sort((a, b) => b.gross - a.gross)
      .slice(0, 10);
  }, [exportData]);

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
            Highest grossing jobs (current filter) - total gross:{" "}
            {formatCurrencyAxis(metricsData?.gross_revenue ?? 0)}
          </p>
        </div>

        {data.length === 0 ? (
          <div className="flex h-75 items-center justify-center text-sm text-muted-foreground">
            No jobs for this period
          </div>
        ) : (
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
                tickFormatter={(v) => formatCurrencyAxis(Number(v))}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) =>
                      `$${Number(value).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    }
                    labelFormatter={(_, payload) => {
                      const item = payload[0]?.payload as
                        | { address?: string; tech?: string; date?: string }
                        | undefined;
                      if (!item) return "";
                      const address = item.address ?? "Unknown";
                      const tech = item.tech ?? "Unknown";
                      const dateLabel = item.date ? ` - ${item.date}` : "";
                      return `${address} (${tech})${dateLabel}`;
                    }}
                  />
                }
              />
              <Bar dataKey="gross" radius={[0, 4, 4, 0]}>
                {data.map((_, index) => (
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
        )}
      </div>
    </QueryStatePanel>
  );
}
