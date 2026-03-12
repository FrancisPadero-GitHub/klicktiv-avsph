"use client";
import { cn } from "@/lib/utils";
import { FileText } from "lucide-react";
import { useMemo, useState } from "react";

// types
import type { EstimateStatus } from "@/types/estimate";
import type { EstimatesRow } from "@/hooks/estimates/useFetchEstimates";

// components
import { EstimateStatusChart } from "@/components/dashboard/estimates/estimate-status-chart";
import { EstimatesByTechChart } from "@/components/dashboard/estimates/estimates-by-tech-chart";

import { EstimatesTable } from "@/components/dashboard/estimates/estimates-table";
import { NewEstimateDialog } from "@/components/dashboard/estimates/new-estimate-dialog";
import { QueryStatePanel } from "@/components/misc/query-state-panel";
import { Button } from "@/components/ui/button";

// hooks
import { useFetchEstimates } from "@/hooks/estimates/useFetchEstimates";
import { useFetchTechnicians } from "@/hooks/technicians/useFetchTechnicians";

import { useFetchWorkOrdersRow } from "@/hooks/estimates/useFetchWorkorder";

type EstimateWithNotes = EstimatesRow & {
  notes: string | null;
};

// format
const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n,
  );

const statusStyles: Record<EstimateStatus, string> = {
  follow_up: "bg-primary/10 text-primary",
  approved: "bg-success/10 text-success",
  denied: "bg-destructive/10 text-destructive",
};

const statusLabels: Record<EstimateStatus, string> = {
  follow_up: "Follow Up",
  approved: "Approved",
  denied: "Denied",
};

export default function EstimatesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [selectedEstimate, setSelectedEstimate] =
    useState<EstimateWithNotes | null>(null);

  const {
    data: estimates = [],
    isLoading: isEstimatesLoading,
    isError: isEstimatesError,
    error: estimatesError,
  } = useFetchEstimates();
  const {
    data: workOrders = [],
    isLoading: isWorkOrdersLoading,
    isError: isWorkOrdersError,
    error: workOrdersError,
  } = useFetchWorkOrdersRow();

  const {
    data: technicians = [],
    isLoading: isTechniciansLoading,
    isError: isTechniciansError,
    error: techniciansError,
  } = useFetchTechnicians();

  // merges estimate data with related work order notes for display in the table
  const mergedEstimates = useMemo<EstimateWithNotes[]>(() => {
    const notesByWorkOrderId = workOrders.reduce(
      (acc, workOrder) => {
        acc[workOrder.id] = workOrder.notes;
        return acc;
      },
      {} as Record<string, string | null>,
    );

    return estimates.map((estimate) => ({
      ...estimate,
      notes: estimate.work_order_id
        ? (notesByWorkOrderId[estimate.work_order_id] ?? null)
        : null,
    }));
  }, [estimates, workOrders]);

  const counts = useMemo(
    () =>
      mergedEstimates.reduce(
        (acc, estimate) => {
          const status = estimate.estimate_status;
          if (!status) return acc;
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        },
        {} as Record<EstimateStatus, number>,
      ),
    [mergedEstimates],
  );

  const totalValue = useMemo(
    () =>
      mergedEstimates.reduce(
        (sum, estimate) => sum + Number(estimate.estimated_amount ?? 0),
        0,
      ),
    [mergedEstimates],
  );

  const technicianNameById = useMemo(
    () =>
      technicians.reduce(
        (acc, technician) => {
          acc[technician.id] = technician.name;
          return acc;
        },
        {} as Record<string, string>,
      ),
    [technicians],
  );

  const summaryState = {
    isLoading: isEstimatesLoading,
    isError: isEstimatesError,
    errorMessage: estimatesError?.message,
  };

  const pipelineState = {
    isLoading: isEstimatesLoading,
    isError: isEstimatesError,
    errorMessage: estimatesError?.message,
  };

  const estimateStatusChartState = {
    isLoading: isEstimatesLoading,
    isError: isEstimatesError,
    errorMessage: estimatesError?.message,
  };

  const estimatesByTechChartState = {
    isLoading: isEstimatesLoading || isTechniciansLoading,
    isError: isEstimatesError || isTechniciansError,
    errorMessage: estimatesError?.message ?? techniciansError?.message,
  };

  const estimatesTableState = {
    isLoading:
      isEstimatesLoading || isWorkOrdersLoading || isTechniciansLoading,
    isError: isEstimatesError || isWorkOrdersError || isTechniciansError,
    errorMessage:
      estimatesError?.message ??
      workOrdersError?.message ??
      techniciansError?.message,
  };

  const handleOpenAddDialog = () => {
    setSelectedEstimate(null);
    setDialogMode("add");
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (estimate: EstimatesRow) => {
    setSelectedEstimate(estimate as EstimateWithNotes);
    setDialogMode("edit");
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Estimates / Quotation
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {isEstimatesLoading
              ? "Loading estimates..."
              : `${mergedEstimates.length} estimates logged`}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <Button onClick={handleOpenAddDialog}>
            <FileText className="mr-2 h-4 w-4" />
            New Estimate
          </Button>
        </div>
      </div>

      <NewEstimateDialog
        open={isDialogOpen}
        mode={dialogMode}
        selectedEstimate={selectedEstimate}
        onOpenChange={setIsDialogOpen}
      />

      {/* Status summary */}
      <QueryStatePanel
        isLoading={summaryState.isLoading}
        isError={summaryState.isError}
        errorMessage={summaryState.errorMessage}
        loadingMessage="Loading estimate summary..."
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {(["follow_up", "approved", "denied"] as EstimateStatus[]).map(
            (status) => {
              return (
                <div
                  key={status}
                  className="rounded-xl border border-border bg-card p-4"
                >
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                      statusStyles[status],
                    )}
                  >
                    {statusLabels[status]}
                  </span>
                  <p className="mt-3 text-2xl font-bold tabular-nums text-foreground">
                    {counts[status] || 0}
                  </p>
                </div>
              );
            },
          )}
        </div>
      </QueryStatePanel>

      {/* Pipeline value */}
      <QueryStatePanel
        isLoading={pipelineState.isLoading}
        isError={pipelineState.isError}
        errorMessage={pipelineState.errorMessage}
        loadingMessage="Loading pipeline value..."
      >
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Total Pipeline Value
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">
            {fmt(totalValue)}
          </p>
        </div>
      </QueryStatePanel>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <QueryStatePanel
          isLoading={estimateStatusChartState.isLoading}
          isError={estimateStatusChartState.isError}
          errorMessage={estimateStatusChartState.errorMessage}
          loadingMessage="Loading estimate status chart..."
          className="min-h-80"
        >
          <EstimateStatusChart estimates={mergedEstimates} />
        </QueryStatePanel>
        <QueryStatePanel
          isLoading={estimatesByTechChartState.isLoading}
          isError={estimatesByTechChartState.isError}
          errorMessage={estimatesByTechChartState.errorMessage}
          loadingMessage="Loading estimates by technician chart..."
          className="min-h-80"
        >
          <EstimatesByTechChart
            estimates={mergedEstimates}
            technicianNameById={technicianNameById}
          />
        </QueryStatePanel>
      </div>

      {/* Table */}
      <QueryStatePanel
        isLoading={estimatesTableState.isLoading}
        isError={estimatesTableState.isError}
        errorMessage={estimatesTableState.errorMessage}
        loadingMessage="Loading estimates table..."
        className="min-h-80"
      >
        <EstimatesTable
          estimates={mergedEstimates}
          technicianNameById={technicianNameById}
          onEdit={handleOpenEditDialog}
        />
      </QueryStatePanel>
    </div>
  );
}
