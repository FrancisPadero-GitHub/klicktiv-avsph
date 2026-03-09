"use client";

import { useMemo, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  SlidersHorizontal,
  X,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import type { EstimateStatus } from "@/types/estimate";
import type { EstimatesRow } from "@/hooks/estimates/useFetchEstimates";
import { useDelEstimate } from "@/hooks/estimates/useDelEstimate";
import { useBulkDelEstimates } from "@/hooks/estimates/useBulkDelEstimates";
import { EstimateViewDialog } from "@/components/dashboard/estimates/estimate-view-dialog";
import { EstimateDeleteAlert } from "@/components/dashboard/estimates/estimate-delete-alert";
import { useEstimateTableStore } from "@/features/store/estimates/useEstimateTableStore";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export type EstimatesRowWithNotes = EstimatesRow & { notes?: string | null };

// helpers

const shortId = (value: string | null) => {
  if (!value) return "";
  return value.slice(0, 8);
};

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

type SortKey =
  | "created_at"
  | "work_order_date"
  | "work_title"
  | "address"
  | "technician"
  | "description"
  | "estimated_amount"
  | "estimate_status"
  | "handled_by";

type SortDir = "asc" | "desc";
type StatusFilter = "all" | EstimateStatus;
type DynamicFilter = "all" | (string & {});

const PAGE_SIZE = 10;

function getPageNumbers(
  current: number,
  total: number,
): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "ellipsis", total];
  if (current >= total - 3)
    return [1, "ellipsis", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "ellipsis", current - 1, current, current + 1, "ellipsis", total];
}

interface EstimatesTableProps {
  estimates: EstimatesRowWithNotes[];
  technicianNameById: Record<string, string>;
  onPromoteToJob?: (estimate: EstimatesRowWithNotes) => void;
  onEdit: (estimate: EstimatesRowWithNotes) => void;
}

export function EstimatesTable({
  estimates,
  technicianNameById,
  onEdit,
}: EstimatesTableProps) {
  const { mutate: deleteEstimate } = useDelEstimate();
  const { mutate: bulkDeleteEstimates } = useBulkDelEstimates();

  const [viewEstimate, setViewEstimate] =
    useState<EstimatesRowWithNotes | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [technicianFilter, setTechnicianFilter] =
    useState<DynamicFilter>("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const { currentPage, setCurrentPage } = useEstimateTableStore();

  const activeFilterCount = [
    search !== "",
    startDate !== "",
    endDate !== "",
    statusFilter !== "all",
    technicianFilter !== "all",
  ].filter(Boolean).length;

  const technicians = useMemo(
    () =>
      Array.from(
        new Set(
          estimates
            .map((estimate) =>
              estimate.technician_id
                ? (technicianNameById[estimate.technician_id] ??
                  estimate.technician_id)
                : null,
            )
            .filter(Boolean),
        ),
      ).sort() as string[],
    [estimates, technicianNameById],
  );

  function clearFilters() {
    setSearch("");
    setStartDate("");
    setEndDate("");
    setStatusFilter("all");
    setTechnicianFilter("all");
    setSelectedIds(new Set());
    setCurrentPage(1);
  }

  const updateSearch = useCallback((v: string) => {
    setSearch(v);
    setSelectedIds(new Set());
    setCurrentPage(1);
  }, [setCurrentPage]);
  const updateStartDate = useCallback((v: string) => {
    setStartDate(v);
    setSelectedIds(new Set());
    setCurrentPage(1);
  }, [setCurrentPage]);
  const updateEndDate = useCallback((v: string) => {
    setEndDate(v);
    setSelectedIds(new Set());
    setCurrentPage(1);
  }, [setCurrentPage]);
  const updateStatusFilter = useCallback((v: StatusFilter) => {
    setStatusFilter(v);
    setSelectedIds(new Set());
    setCurrentPage(1);
  }, [setCurrentPage]);
  const updateTechnicianFilter = useCallback((v: DynamicFilter) => {
    setTechnicianFilter(v);
    setSelectedIds(new Set());
    setCurrentPage(1);
  }, [setCurrentPage]);

  const toggleRow = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    const startDateObj = startDate ? new Date(startDate) : null;
    const endDateObj = endDate ? new Date(endDate) : null;

    return [...estimates]
      .filter((estimate) => {
        const techName = estimate.technician_id
          ? (technicianNameById[estimate.technician_id] ??
            estimate.technician_id)
          : "";
        const matchSearch =
          !q ||
          (estimate.work_order_id ?? "").toLowerCase().includes(q) ||
          (estimate.work_title ?? "").toLowerCase().includes(q) ||
          (estimate.address ?? "").toLowerCase().includes(q) ||
          (estimate.description ?? "").toLowerCase().includes(q) ||
          (estimate.region ?? "").toLowerCase().includes(q) ||
          (estimate.category ?? "").toLowerCase().includes(q) ||
          techName.toLowerCase().includes(q) ||
          (estimate.handled_by ?? "").toLowerCase().includes(q);

        const matchStatus =
          statusFilter === "all" || estimate.estimate_status === statusFilter;
        const matchTechnician =
          technicianFilter === "all" || techName === technicianFilter;

        let matchDate = true;
        if (startDateObj || endDateObj) {
          const estimateDate = estimate.work_order_date
            ? new Date(estimate.work_order_date)
            : null;

          if (estimateDate) {
            if (startDateObj && estimateDate < startDateObj) matchDate = false;
            if (endDateObj) {
              const endOfDay = new Date(endDateObj);
              endOfDay.setHours(23, 59, 59, 999);
              if (estimateDate > endOfDay) matchDate = false;
            }
          }
        }

        return matchSearch && matchStatus && matchTechnician && matchDate;
      })
      .sort((a, b) => {
        const techA = a.technician_id
          ? (technicianNameById[a.technician_id] ?? a.technician_id)
          : "";
        const techB = b.technician_id
          ? (technicianNameById[b.technician_id] ?? b.technician_id)
          : "";

        const av: string | number =
          sortKey === "technician"
            ? techA
            : sortKey === "estimated_amount"
              ? Number(a.estimated_amount ?? 0)
              : String(a[sortKey] ?? "");
        const bv: string | number =
          sortKey === "technician"
            ? techB
            : sortKey === "estimated_amount"
              ? Number(b.estimated_amount ?? 0)
              : String(b[sortKey] ?? "");

        let cmp = 0;
        if (typeof av === "number" && typeof bv === "number") {
          cmp = av - bv;
        } else {
          cmp = String(av).localeCompare(String(bv));
        }

        return sortDir === "asc" ? cmp : -cmp;
      });
  }, [
    estimates,
    technicianNameById,
    search,
    statusFilter,
    technicianFilter,
    startDate,
    endDate,
    sortKey,
    sortDir,
  ]);

  const toggleAll = useCallback(() => {
    setSelectedIds((prev) => {
      const filteredIds = filtered
        .map((e) => e.work_order_id)
        .filter((id): id is string => !!id);
      const allSelected =
        filteredIds.length > 0 && filteredIds.every((id) => prev.has(id));
      return allSelected ? new Set<string>() : new Set(filteredIds);
    });
  }, [filtered]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = useMemo(
    () =>
      filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filtered, currentPage],
  );

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setCurrentPage(1);
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) {
      return (
        <ChevronsUpDown className="ml-1 inline h-3 w-3 text-muted-foreground" />
      );
    }

    return sortDir === "asc" ? (
      <ChevronUp className="ml-1 inline h-3 w-3 text-foreground" />
    ) : (
      <ChevronDown className="ml-1 inline h-3 w-3 text-foreground" />
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">Estimates</h3>
          <p className="text-xs text-muted-foreground">
            {filtered.length} of {estimates.length} estimates
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters((value) => !value)}
            className="h-8 gap-1.5 text-xs"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            {showFilters ? "Hide Filters" : "Show Filters"}
            {!showFilters && activeFilterCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[10px] font-semibold text-background">
                {activeFilterCount}
              </span>
            )}
          </Button>

          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-2 border-b border-border p-4">
          <Input
            placeholder="Search title, technician, status, address..."
            value={search}
            onChange={(event) => updateSearch(event.target.value)}
            className="h-8 w-full text-sm sm:w-64"
          />

          <Input
            type="date"
            value={startDate}
            onChange={(event) => updateStartDate(event.target.value)}
            className="h-8 w-full text-sm sm:w-40"
            title="Start date"
          />

          <Input
            type="date"
            value={endDate}
            onChange={(event) => updateEndDate(event.target.value)}
            className="h-8 w-full text-sm sm:w-40"
            title="End date"
          />

          <Select
            value={statusFilter}
            onValueChange={(value) => updateStatusFilter(value as StatusFilter)}
          >
            <SelectTrigger size="sm" className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="follow_up">Follow Up</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="denied">Denied</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={technicianFilter}
            onValueChange={(value) => updateTechnicianFilter(value)}
          >
            <SelectTrigger size="sm" className="w-full sm:w-44">
              <SelectValue placeholder="Technician" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Technicians</SelectItem>
              {technicians.map((technician) => (
                <SelectItem key={technician} value={technician}>
                  {technician}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 border-b border-border bg-muted/50 px-4 py-2.5">
          <span className="text-sm font-medium text-foreground">
            {selectedIds.size} selected
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedIds(new Set())}
            className="h-7 gap-1.5 text-xs"
          >
            <X className="h-3 w-3" />
            Clear
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setConfirmBulkDelete(true)}
            className="h-7 gap-1.5 text-xs"
          >
            <Trash2 className="h-3 w-3" />
            Delete ({selectedIds.size})
          </Button>
        </div>
      )}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="sticky top-0 border-b border-border bg-card hover:bg-card">
              <TableHead
                className="w-10 px-3"
                onClick={(e) => e.stopPropagation()}
              >
                <Checkbox
                  checked={
                    filtered.length > 0 &&
                    filtered.every(
                      (e) =>
                        e.work_order_id && selectedIds.has(e.work_order_id),
                    )
                  }
                  onCheckedChange={toggleAll}
                  aria-label="Select all"
                />
              </TableHead>
              {(
                [
                  { key: "work_id", label: "ID" },
                  { key: "work_order_date" as SortKey, label: "Date" },
                  { key: "work_title" as SortKey, label: "Work Title" },
                  { key: "address" as SortKey, label: "Address" },
                  { key: "technician" as SortKey, label: "Technician" },
                  // { key: "description" as SortKey, label: "Description" },
                  { key: "estimated_amount" as SortKey, label: "Amount" },
                  { key: "estimate_status" as SortKey, label: "Status" },
                  { key: "handled_by" as SortKey, label: "Handled By" },
                ] as { key: SortKey; label: string }[]
              ).map(({ key, label }) => (
                <TableHead
                  key={key}
                  onClick={() => handleSort(key)}
                  className="cursor-pointer select-none text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground"
                >
                  {label}
                  <SortIcon col={key} />
                </TableHead>
              ))}
              <TableHead className="text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-border">
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={11}
                  className="px-4 py-8 text-center text-sm text-muted-foreground"
                >
                  No estimates match your filters.
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((estimate, index) => {
                const techName = estimate.technician_id
                  ? (technicianNameById[estimate.technician_id] ??
                    estimate.technician_id)
                  : "-";

                return (
                  <TableRow
                    key={
                      estimate.work_order_id ??
                      `${estimate.created_at}-${index}`
                    }
                    onClick={() => {
                      setViewEstimate(estimate);
                      setViewOpen(true);
                    }}
                    className={cn(
                      "cursor-pointer transition-colors hover:bg-muted/50",
                      estimate.work_order_id &&
                        selectedIds.has(estimate.work_order_id) &&
                        "bg-accent",
                    )}
                  >
                    <TableCell
                      className="w-10 px-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Checkbox
                        checked={
                          !!estimate.work_order_id &&
                          selectedIds.has(estimate.work_order_id)
                        }
                        onCheckedChange={() =>
                          estimate.work_order_id &&
                          toggleRow(estimate.work_order_id)
                        }
                        aria-label={`Select ${estimate.work_title ?? "estimate"}`}
                      />
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {shortId(estimate.work_order_id ?? "-")}
                    </TableCell>
                    {/* Date */}
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {estimate.work_order_date
                        ? new Date(
                            estimate.work_order_date,
                          ).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    {/* Work Title */}
                    <TableCell className="truncate max-w-xs font-medium text-foreground">
                      {estimate.work_title ?? "-"}
                    </TableCell>
                    {/* Address */}
                    <TableCell className="truncate max-w-xs font-medium text-foreground">
                      {estimate.address ?? "-"}
                      {estimate.region && (
                        <span className="ml-1.5 text-xs text-muted-foreground">
                          {estimate.region}
                        </span>
                      )}
                    </TableCell>
                    {/* Technician */}
                    <TableCell className="whitespace-nowrap text-foreground">
                      {techName}
                    </TableCell>
                    {/* Description */}
                    {/* <TableCell className="truncate max-w-sm text-zinc-600 dark:text-zinc-300">
                      {estimate.description ?? "-"}
                    </TableCell> */}
                    {/* Amount - blue */}
                    <TableCell className="whitespace-nowrap tabular-nums font-medium text-chart-3">
                      {fmt(Number(estimate.estimated_amount ?? 0))}
                    </TableCell>
                    {/* Status */}
                    <TableCell>
                      {estimate.estimate_status ? (
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                            statusStyles[estimate.estimate_status],
                          )}
                        >
                          {statusLabels[estimate.estimate_status]}
                        </span>
                      ) : (
                        <span className="text-xs text-zinc-400 dark:text-zinc-500">
                          -
                        </span>
                      )}
                    </TableCell>
                    {/* Handled By */}
                    <TableCell className="text-xs text-muted-foreground">
                      {estimate.handled_by ?? "-"}
                    </TableCell>
                    {/* Actions */}
                    <TableCell
                      className="text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => onEdit(estimate)}
                            className="gap-2"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() =>
                              estimate.work_order_id &&
                              setConfirmDeleteId(estimate.work_order_id)
                            }
                            className="gap-2 text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination footer */}
      <div className="flex flex-col items-center gap-3 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="order-2 text-xs text-muted-foreground sm:order-1">
          Showing{" "}
          <span className="font-medium text-foreground">
            {filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}
          </span>
          {" – "}
          <span className="font-medium text-foreground">
            {Math.min(currentPage * PAGE_SIZE, filtered.length)}
          </span>
          {" of "}
          <span className="font-medium text-foreground">{filtered.length}</span>
          {" estimates"}
        </p>

        {totalPages > 1 && (
          <Pagination className="order-1 mx-0 w-auto sm:order-2">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((p) => Math.max(1, p - 1));
                  }}
                  className={cn(
                    currentPage === 1 && "pointer-events-none opacity-50",
                  )}
                />
              </PaginationItem>

              {getPageNumbers(currentPage, totalPages).map((page, i) =>
                page === "ellipsis" ? (
                  <PaginationItem key={`ellipsis-${i}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      isActive={page === currentPage}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(page as number);
                      }}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((p) => Math.min(totalPages, p + 1));
                  }}
                  className={cn(
                    currentPage === totalPages &&
                      "pointer-events-none opacity-50",
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      <EstimateViewDialog
        estimate={viewEstimate}
        techName={
          viewEstimate?.technician_id
            ? technicianNameById[viewEstimate.technician_id]
            : undefined
        }
        open={viewOpen}
        onOpenChange={setViewOpen}
        onEdit={() => {
          if (!viewEstimate) return;
          onEdit(viewEstimate);
        }}
        onDelete={() => {
          if (viewEstimate?.work_order_id)
            setConfirmDeleteId(viewEstimate.work_order_id);
        }}
      />

      <EstimateDeleteAlert
        open={!!confirmDeleteId}
        onOpenChange={(open) => !open && setConfirmDeleteId(null)}
        onConfirm={() => {
          if (confirmDeleteId) deleteEstimate(confirmDeleteId);
          setConfirmDeleteId(null);
          setViewOpen(false);
        }}
      />

      <EstimateDeleteAlert
        open={confirmBulkDelete}
        onOpenChange={(open) => !open && setConfirmBulkDelete(false)}
        onConfirm={() => {
          bulkDeleteEstimates(Array.from(selectedIds));
          setSelectedIds(new Set());
          setConfirmBulkDelete(false);
        }}
      />
    </div>
  );
}
