"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFetchViewJobRow } from "@/hooks/jobs/useFetchJobTable";
import { useFetchTechSummary } from "@/hooks/technicians/useFetchTechSummary";
import { useFetchTechnicians } from "@/hooks/technicians/useFetchTechnicians";

// helpers

const shortId = (value: string | null) => {
  if (!value) return "";
  return value.slice(0, 8);
};

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n,
  );

export function RecentJobsTable() {
  const { data: jobs = [], isLoading, isError } = useFetchViewJobRow();
  const { data: techSummary = [] } = useFetchTechSummary();
  const { data: techDetails = [] } = useFetchTechnicians();

  // Build tech name & commission lookup maps
  const techNameMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const t of techSummary) {
      if (t.technician_id && t.name) map.set(t.technician_id, t.name);
    }
    return map;
  }, [techSummary]);

  const techCommissionMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of techDetails) {
      if (t.id) map.set(t.id, t.commission);
    }
    return map;
  }, [techDetails]);

  // Sort by created_at descending and take 15 most recent
  const recentJobs = useMemo(() => {
    return [...jobs]
      .sort((a, b) => {
        const av = a.created_at as string | number;
        const bv = b.created_at as string | number;
        let cmp = 0;
        if (typeof av === "number" && typeof bv === "number") {
          cmp = av - bv;
        } else {
          cmp = String(av).localeCompare(String(bv));
        }
        return -cmp; // desc
      })
      .slice(0, 15);
  }, [jobs]);

  return (
    <div className="rounded-xl border border-border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Recent Jobs
          </h3>
          <p className="text-xs text-muted-foreground">
            Showing {recentJobs.length} most recent
          </p>
        </div>
        <div>
          <Link
            href="/dashboard/jobs"
            className="group flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm transition-all hover:bg-accent hover:text-foreground"
          >
            View all
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Spinner />
        </div>
      ) : isError ? (
        <div className="rounded-b-xl bg-red-50 p-6 text-center text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          Failed to load jobs.
        </div>
      ) : (
        <div className="max-h-120 overflow-y-auto overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border">
                {[
                  "ID",
                  "Job Name",
                  "Date",
                  "Address",
                  "Technician",
                  "Gross",
                  "Parts Cost",
                ].map((label) => (
                  <TableHead
                    key={label}
                    className="sticky top-0 z-20 bg-card text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    {label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border/50">
              {recentJobs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="px-4 py-8 text-center text-sm text-muted-foreground"
                  >
                    No jobs found.
                  </TableCell>
                </TableRow>
              ) : (
                recentJobs.map((job) => {
                  const techName = job.technician_id
                    ? (techNameMap.get(job.technician_id) ?? "-")
                    : "-";
                  const commRate = job.technician_id
                    ? techCommissionMap.get(job.technician_id)
                    : null;

                  return (
                    <TableRow
                      key={job.work_order_id}
                      className="cursor-pointer transition-colors hover:bg-muted/50"
                    >
                      {/* ID */}
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {shortId(job.work_order_id ?? "-")}
                      </TableCell>
                      {/* Job Name */}
                      <TableCell className="font-medium text-foreground">
                        {job.work_title ?? "-"}
                      </TableCell>
                      {/* Date */}
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {job.work_order_date
                          ? new Date(job.work_order_date).toLocaleDateString()
                          : "-"}
                      </TableCell>
                      {/* Address */}
                      <TableCell className="font-medium text-foreground">
                        {job.address ?? "-"}
                        {job.region && (
                          <span className="ml-1.5 text-xs text-muted-foreground">
                            {job.region}
                          </span>
                        )}
                      </TableCell>
                      {/* Technician */}
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
                            {(techName === "-" ? "?" : techName)
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <span className="text-foreground">
                            {techName}
                          </span>
                          {commRate != null && (
                            <span className="text-xs text-muted-foreground">
                              ({commRate}%)
                            </span>
                          )}
                        </div>
                      </TableCell>
                      {/* Gross */}
                      <TableCell className="tabular-nums font-medium text-foreground">
                        {fmt(job.subtotal ?? 0)}
                      </TableCell>
                      {/* Parts Cost */}
                      <TableCell className="tabular-nums text-orange-600 dark:text-orange-400">
                        {fmt(job.parts_total_cost ?? 0)}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
