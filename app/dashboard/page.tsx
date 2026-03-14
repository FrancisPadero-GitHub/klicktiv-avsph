"use client";

import { DashboardDateFilter } from "@/components/dashboard/dashboard-date-filter";
import { DashboardKPIs } from "@/components/dashboard/dashboard-kpis";
import { RecentJobsList } from "@/components/dashboard/jobs/recent-jobs-list";
import { FinancialTrendsSection } from "@/components/dashboard/financial/financial-trends-section";
import { TopJobsChart } from "@/components/dashboard/jobs/top-jobs-chart";
import { TechnicianPerformanceSection } from "@/components/dashboard/financial/technician-performance-section";
import { useAuth } from "@/components/auth-provider";

export default function DashboardPage() {
  const { company_id } = useAuth();

  return (
    <div className="space-y-4">
      {/* Header + Date Filters */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Overview / Reports
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Financial dashboard with date filtering
          </p>
        </div>

        <div className="flex flex-col gap-3 justify-between xl:flex-row xl:items-start">
          <DashboardDateFilter />
        </div>
      </div>

      {/* Content, loading / error / data */}
      <div className="space-y-4">
        <DashboardKPIs companyId={company_id ?? ""} />
        <FinancialTrendsSection companyId={company_id ?? ""} />
        <TechnicianPerformanceSection companyId={company_id ?? ""} />
        <TopJobsChart />
        <RecentJobsList />
      </div>
    </div>
  );
}
