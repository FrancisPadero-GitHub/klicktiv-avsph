"use client";

import { memo } from "react";
import { Pie, PieChart, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { ProfitSplit } from "@/hooks/dashboard/useDashboardData";

const chartConfig = {
  "Company Net": { label: "Company Net", color: "var(--chart-1)" },
  "Tech Pay": { label: "Tech Pay", color: "var(--chart-2)" },
} satisfies ChartConfig;

const COLORS = ["var(--chart-1)", "var(--chart-2)"];

interface ProfitSplitChartProps {
  data: ProfitSplit[];
}

export const ProfitSplitChart = memo(function ProfitSplitChart({ data }: ProfitSplitChartProps) {
  const hasData = data.some((d) => d.value > 0);

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-foreground">
          Revenue Split
        </h3>
        <p className="text-xs text-muted-foreground">
          Company vs Technician for selected period
        </p>
      </div>
      {!hasData ? (
        <div className="flex h-70 items-center justify-center text-sm text-muted-foreground">
          No data for this period
        </div>
      ) : (
        <ChartContainer config={chartConfig} className="mx-auto h-70 w-full">
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) =>
                    `$${Number(value).toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                  }
                  nameKey="name"
                />
              }
            />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={4}
              dataKey="value"
              nameKey="name"
              strokeWidth={2}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="name" />} />
          </PieChart>
        </ChartContainer>
      )}
    </div>
  );
});
