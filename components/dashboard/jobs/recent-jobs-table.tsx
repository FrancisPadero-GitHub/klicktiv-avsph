"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
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
import { shortId, fmt } from "@/lib/helper";
import { paymentStatusColors } from "@/components/dashboard/jobs/job-view-dialog";

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
        <div className="rounded-b-xl bg-destructive/10 p-6 text-center text-sm text-destructive">
          Failed to load jobs.
        </div>
      ) : (
        <div className="max-h-120 overflow-y-auto overflow-x-auto text-nowrap">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border bg-card hover:bg-card">
                {[
                  "ID",
                  "Job Name",
                  "Date",
                  "Address",
                  "Technician",
                  "Subtotal",
                  "Deposit",
                  "Payment",
                  "Tip",
                  "Parts Cost",
                  "Net Revenue",
                  "Commission",
                  "Company Net",
                  "Review",
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
                    colSpan={14}
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
                      className={cn(
                        "cursor-pointer transition-colors hover:bg-muted/50",
                        job.payment_status === "partial" && "bg-warning/10",
                        job.status === "pending" && "bg-info/10",
                      )}
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
                      <TableCell className="max-w-sm truncate font-medium text-foreground">
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
                          <span className="text-foreground">{techName}</span>
                          {commRate != null && (
                            <span className="text-xs text-muted-foreground">
                              ({commRate}%)
                            </span>
                          )}
                        </div>
                      </TableCell>
                      {/* Subtotal */}
                      <TableCell className="tabular-nums font-medium text-foreground">
                        {fmt(job.subtotal ?? 0)}
                      </TableCell>
                      {/* Deposits */}
                      <TableCell
                        className="tabular-nums text-[#64748B]"
                        title="Excluded on the totals if fully paid"
                      >
                        {fmt(job.deposits ?? 0)}
                      </TableCell>
                      {/* Payment Status */}
                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          <span
                            className={cn(
                              "inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
                              paymentStatusColors[
                                (
                                  job.payment_status as "full" | "partial"
                                ).toLowerCase()
                              ] ?? "bg-muted text-muted-foreground",
                            )}
                          >
                            {job.payment_status ?? "-"}
                          </span>
                        </div>
                      </TableCell>
                      {/* Tip */}
                      <TableCell className="tabular-nums font-medium text-foreground">
                        {fmt(job.tip_amount ?? 0)}
                      </TableCell>
                      {/* Parts Cost */}
                      <TableCell className="tabular-nums text-primary">
                        {fmt(job.parts_total_cost ?? 0)}
                      </TableCell>
                      {/* Net Revenue */}
                      <TableCell
                        className="tabular-nums font-medium text-chart-3"
                        title="Revenue = Subtotal - Parts Costs"
                      >
                        {fmt(job.net_revenue ?? 0)}
                      </TableCell>
                      {/* Commission */}
                      <TableCell
                        className="tabular-nums text-amber-600"
                        title="Commission = Net Revenue * Commission Rate"
                      >
                        {fmt(job.total_commission ?? 0)}
                      </TableCell>
                      {/* Company Net */}
                      <TableCell
                        className="tabular-nums font-medium text-success"
                        title="Company Net = Net Revenue - Commission"
                      >
                        {fmt(job.total_company_net ?? 0)}
                      </TableCell>
                      {/* Review */}
                      <TableCell className="tabular-nums font-medium text-foreground">
                        {fmt(job.review_amount ?? 0)}
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
