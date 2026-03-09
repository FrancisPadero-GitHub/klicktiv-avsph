"use client";

import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { MonthlyBreakdown } from "@/hooks/dashboard/useDashboardData";

const chartConfig = {
  gross: {
    label: "Gross Revenue",
    color: "var(--chart-1)",
  },
  companyNet: {
    label: "Company Net",
    color: "var(--chart-2)",
  },
  parts: {
    label: "Parts Cost",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

interface MonthlyComparisonChartProps {
  data: MonthlyBreakdown[];
}

export function MonthlyComparisonChart({ data }: MonthlyComparisonChartProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-foreground">
          Monthly Comparison
        </h3>
        <p className="text-xs text-muted-foreground">
          Revenue breakdown by month
        </p>
      </div>
      {data.length === 0 ? (
        <div className="flex h-70 items-center justify-center text-sm text-muted-foreground">
          No data for this period
        </div>
      ) : (
        <ChartContainer config={chartConfig} className="h-70 w-full">
          <BarChart data={data} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(v) => v.slice(0, 3)}
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
            <Bar
              dataKey="gross"
              fill="var(--color-gross)"
              radius={[8, 8, 0, 0]}
            />
            <Bar
              dataKey="companyNet"
              fill="var(--color-companyNet)"
              radius={[8, 8, 0, 0]}
            />
            <Bar
              dataKey="parts"
              fill="var(--color-parts)"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      )}
    </div>
  );
}
