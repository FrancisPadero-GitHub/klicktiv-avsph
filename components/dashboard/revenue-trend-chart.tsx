"use client";

import { Area, AreaChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { memo } from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { DailyRevenue } from "@/hooks/dashboard/useDashboardData";

const chartConfig = {
  gross: {
    label: "Gross Revenue",
    color: "var(--chart-1)",
  },
  net: {
    label: "Company Net",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

interface RevenueTrendChartProps {
  data: DailyRevenue[];
}

export const RevenueTrendChart = memo(function RevenueTrendChart({
  data,
}: RevenueTrendChartProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-foreground">
          Daily Revenue Trend
        </h3>
        <p className="text-xs text-muted-foreground">
          Gross vs Company Net per day
        </p>
      </div>
      {data.length === 0 ? (
        <div className="flex h-70 items-center justify-center text-sm text-muted-foreground">
          No data for this period
        </div>
      ) : (
        <ChartContainer config={chartConfig} className="h-70 w-full">
          <AreaChart data={data} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(v) => v.split(" ")[1] ?? v}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) =>
                    `$${Number(value).toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                  }
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Area
              type="monotone"
              dataKey="gross"
              stroke="var(--color-gross)"
              fill="var(--color-gross)"
              fillOpacity={0.4}
            />
            <Area
              type="monotone"
              dataKey="net"
              stroke="var(--color-net)"
              fill="var(--color-net)"
              fillOpacity={0.4}
            />
          </AreaChart>
        </ChartContainer>
      )}
    </div>
  );
});
