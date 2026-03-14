"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QueryStatePanel } from "@/components/misc/query-state-panel";
import { useDashboardFilterStore } from "@/features/store/dashboard/useDashboardFilterStore";
import {
  useDashboardExport,
  type ExportParams,
} from "@/hooks/dashboard/rpc/useDashboardExport";
import { resolveDateRange } from "@/lib/helper";

const revenueByTechChartConfig = {
  parts: { label: "Parts", color: "var(--chart-3)" },
  companyNet: { label: "Company Net", color: "var(--chart-4)" },
  techPay: { label: "Tech Pay", color: "var(--chart-5)" },
} satisfies ChartConfig;

const tipsChartConfig = {
  tips: { label: "Tips", color: "var(--chart-2)" },
} satisfies ChartConfig;

function formatCurrencyAxis(value: number) {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `$${(value / 1_000).toFixed(0)}k`;
  return `$${value.toFixed(0)}`;
}

function formatCurrency(value: unknown) {
  return `$${Number(value ?? 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function TechnicianPerformanceSection({
  companyId,
}: {
  companyId: string;
}) {
  const { mode, year, month, isoWeek, date, startDate, endDate, technicianId } =
    useDashboardFilterStore();

  const { p_start_date, p_end_date } = useMemo(
    () =>
      resolveDateRange(mode, year, month, isoWeek, date, startDate, endDate),
    [mode, year, month, isoWeek, date, startDate, endDate],
  );

  const params: ExportParams = useMemo(
    () => ({
      p_company_id: companyId,
      p_technician_id:
        technicianId === "all" || technicianId == null
          ? undefined
          : technicianId,
      p_start_date,
      p_end_date,
      p_all_time: mode === "all",
    }),
    [companyId, technicianId, p_start_date, p_end_date, mode],
  );

  const {
    data,
    isLoading: isExportLoading,
    isError: isExportError,
    error: exportError,
  } = useDashboardExport(params);

  const technicianRows = useMemo(() => data?.technicianRows ?? [], [data]);

  const revenueByTechData = useMemo(
    () =>
      technicianRows
        .map((row) => ({
          technician: row.technician || "Unknown",
          grossRevenue: row.grossRevenue,
          parts: row.parts,
          techPay: row.techPay,
          companyNet: row.companyNet,
        }))
        .sort((a, b) => b.grossRevenue - a.grossRevenue),
    [technicianRows],
  );

  const tipsLeaderboardData = useMemo(
    () =>
      technicianRows
        .map((row) => ({
          technician: row.technician || "Unknown",
          tips: row.tips,
        }))
        .sort((a, b) => b.tips - a.tips)
        .slice(0, 10),
    [technicianRows],
  );

  const hasRevenueByTech = revenueByTechData.length > 0;
  const hasTips = tipsLeaderboardData.length > 0;

  return (
    <QueryStatePanel
      isLoading={isExportLoading}
      isError={isExportError}
      errorMessage={exportError?.message}
      loadingMessage="Loading technician performance..."
      className="min-h-80"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              Revenue Generated per Technician
            </CardTitle>
            <CardDescription>
              Stacked breakdown: parts, company net, and tech pay
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!hasRevenueByTech ? (
              <div className="flex h-70 items-center justify-center text-sm text-muted-foreground">
                No technician data for this period
              </div>
            ) : (
              <ChartContainer
                config={revenueByTechChartConfig}
                className="h-70 w-full"
              >
                <BarChart
                  data={revenueByTechData}
                  margin={{ left: 12, right: 12 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="technician"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    interval={0}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(v) => formatCurrencyAxis(Number(v))}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        labelFormatter={(label, payload) => {
                          const first = payload[0]?.payload as
                            | { grossRevenue?: number; technician?: string }
                            | undefined;
                          const technician =
                            (typeof label === "string" ? label : undefined) ??
                            first?.technician ??
                            "Unknown";
                          const gross = first?.grossRevenue ?? 0;
                          return `${technician} · Gross ${formatCurrency(gross)}`;
                        }}
                        formatter={(value) => formatCurrency(value)}
                      />
                    }
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar
                    dataKey="parts"
                    stackId="gross"
                    fill="var(--color-parts)"
                    radius={[0, 0, 0, 0]}
                    className="transition-all duration-300 hover:opacity-80"
                  />
                  <Bar
                    dataKey="companyNet"
                    stackId="gross"
                    fill="var(--color-companyNet)"
                    radius={[0, 0, 0, 0]}
                    className="transition-all duration-300 hover:opacity-80"
                  />
                  <Bar
                    dataKey="techPay"
                    stackId="gross"
                    fill="var(--color-techPay)"
                    radius={[4, 4, 0, 0]}
                    className="transition-all duration-300 hover:opacity-80"
                  />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              Technician Tip Leaderboard
            </CardTitle>
            <CardDescription>Top 10 technicians by tips</CardDescription>
          </CardHeader>
          <CardContent>
            {!hasTips ? (
              <div className="flex h-70 items-center justify-center text-sm text-muted-foreground">
                No tip data for this period
              </div>
            ) : (
              <ChartContainer config={tipsChartConfig} className="h-70 w-full">
                <BarChart
                  data={tipsLeaderboardData}
                  layout="vertical"
                  margin={{ left: 12, right: 12 }}
                >
                  <CartesianGrid horizontal={false} />
                  <YAxis
                    dataKey="technician"
                    type="category"
                    tickLine={false}
                    axisLine={false}
                    width={100}
                  />
                  <XAxis
                    type="number"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(v) => formatCurrencyAxis(Number(v))}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        labelKey="technician"
                        formatter={(value) => formatCurrency(value)}
                      />
                    }
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar
                    dataKey="tips"
                    fill="var(--color-tips)"
                    radius={[4, 4, 4, 4]}
                    className="transition-all duration-300 hover:opacity-80"
                  />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </QueryStatePanel>
  );
}
