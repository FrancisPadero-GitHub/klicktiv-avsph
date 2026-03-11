"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { QueryStatePanel } from "@/components/misc/query-state-panel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  MoreHorizontal,
  Pencil,
  SlidersHorizontal,
  Trash2,
  X,
} from "lucide-react";
import {
  useFetchReviewRecords,
  type ReviewRecordRow,
} from "@/hooks/reviews/useFetchReviewRecords";
import { useDelReviewRecord } from "@/hooks/reviews/useDelReviewRecords";
import { useBulkDelReviewRecords } from "@/hooks/reviews/useBulkDelReviewRecords";
import { Checkbox } from "@/components/ui/checkbox";
import { ReviewViewDialog } from "./review-view-dialog";
import { ReviewDeleteAlert } from "./review-delete-alert";
import { useReviewTableStore } from "@/features/store/reviews/useReviewTableStore";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n,
  );

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

type SortKey =
  | "created_at"
  | "review_date"
  | "review_amount"
  | "technician_id"
  | "work_order_id";
type SortDir = "asc" | "desc";
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

interface ReviewsTableProps {
  onEdit: (record: ReviewRecordRow) => void;
  highlightReviewId?: string | null;
}

export function ReviewsTable({ onEdit, highlightReviewId }: ReviewsTableProps) {
  const {
    data: records = [],
    isLoading,
    isError,
    error,
  } = useFetchReviewRecords();
  const { mutate: deleteReview } = useDelReviewRecord();
  const { mutate: bulkDeleteReviews } = useBulkDelReviewRecords();

  const [viewRecord, setViewRecord] = useState<ReviewRecordRow | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);

  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reviewTypeFilter, setReviewTypeFilter] =
    useState<DynamicFilter>("all");
  const [paymentFilter, setPaymentFilter] = useState<DynamicFilter>("all");
  const [showFilters, setShowFilters] = useState(true);
  const { currentPage, setCurrentPage } = useReviewTableStore();
  const [activeHighlightId, setActiveHighlightId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!highlightReviewId) return;
    const initialTimeout = window.setTimeout(() => {
      setActiveHighlightId(highlightReviewId);
    }, 0);

    const clearHighlightTimeout = window.setTimeout(() => {
      setActiveHighlightId((current) =>
        current === highlightReviewId ? null : current,
      );
    }, 5000);

    return () => {
      window.clearTimeout(initialTimeout);
      window.clearTimeout(clearHighlightTimeout);
    };
  }, [highlightReviewId]);

  const reviewTypes = useMemo(
    () =>
      Array.from(
        new Set(records.map((r) => r.review_type).filter(Boolean)),
      ).sort() as string[],
    [records],
  );

  const paymentMethods = useMemo(
    () =>
      Array.from(
        new Set(records.map((r) => r.payment_method).filter(Boolean)),
      ).sort() as string[],
    [records],
  );

  const activeFilterCount = [
    search !== "",
    startDate !== "",
    endDate !== "",
    reviewTypeFilter !== "all",
    paymentFilter !== "all",
  ].filter(Boolean).length;

  function clearFilters() {
    setSearch("");
    setStartDate("");
    setEndDate("");
    setReviewTypeFilter("all");
    setPaymentFilter("all");
    setSelectedIds(new Set());
    setCurrentPage(1);
  }

  // Filtered and sorted data
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    const startDateObj = startDate ? new Date(startDate) : null;
    const endDateObj = endDate ? new Date(endDate) : null;

    return [...records]
      .filter((r) => {
        const matchesSearch =
          !q ||
          (r.work_title ?? "").toLowerCase().includes(q) ||
          (r.review_type ?? "").toLowerCase().includes(q) ||
          (r.technician_id ?? "").toLowerCase().includes(q) ||
          (r.payment_method ?? "").toLowerCase().includes(q) ||
          (r.work_order_id ?? "").toLowerCase().includes(q);

        const matchesReviewType =
          reviewTypeFilter === "all" ||
          (r.review_type ?? "") === reviewTypeFilter;

        const matchesPayment =
          paymentFilter === "all" || (r.payment_method ?? "") === paymentFilter;

        let matchesDate = true;
        if (startDateObj || endDateObj) {
          const rowDate = r.review_date ? new Date(r.review_date) : null;
          if (rowDate) {
            if (startDateObj && rowDate < startDateObj) matchesDate = false;
            if (endDateObj) {
              const endOfDay = new Date(endDateObj);
              endOfDay.setHours(23, 59, 59, 999);
              if (rowDate > endOfDay) matchesDate = false;
            }
          }
        }

        return (
          matchesSearch && matchesReviewType && matchesPayment && matchesDate
        );
      })
      .sort((a, b) => {
        const rawAv = a[sortKey as keyof ReviewRecordRow];
        const rawBv = b[sortKey as keyof ReviewRecordRow];

        const av: string | number =
          sortKey === "review_amount"
            ? Number(rawAv ?? 0)
            : String(rawAv ?? "").toLowerCase();

        const bv: string | number =
          sortKey === "review_amount"
            ? Number(rawBv ?? 0)
            : String(rawBv ?? "").toLowerCase();

        let cmp = 0;
        if (typeof av === "number" && typeof bv === "number") {
          cmp = av - bv;
        } else {
          cmp = String(av).localeCompare(String(bv));
        }

        return sortDir === "asc" ? cmp : -cmp;
      });
  }, [
    records,
    search,
    sortKey,
    sortDir,
    startDate,
    endDate,
    reviewTypeFilter,
    paymentFilter,
  ]);

  useEffect(() => {
    if (!activeHighlightId) return;

    const targetRow = document.getElementById(
      `review-row-${activeHighlightId}`,
    );
    if (targetRow) {
      targetRow.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [filtered, activeHighlightId]);

  const toggleAll = () => {
    setSelectedIds((prev) => {
      const filteredIds = filtered
        .map((r) => r.review_id)
        .filter((id): id is string => !!id);
      const allSelected =
        filteredIds.length > 0 && filteredIds.every((id) => prev.has(id));
      return allSelected ? new Set<string>() : new Set(filteredIds);
    });
  };

  const toggleRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = useMemo(
    () =>
      filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filtered, currentPage],
  );

  function handleSort(k: SortKey) {
    if (sortKey === k) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(k);
      setSortDir("asc");
    }
    setCurrentPage(1);
  }

  function renderSortIcon(col: SortKey) {
    if (sortKey !== col)
      return (
        <ChevronsUpDown className="ml-1 inline h-3 w-3 text-muted-foreground" />
      );
    return sortDir === "asc" ? (
      <ChevronUp className="ml-1 inline h-3 w-3 text-foreground" />
    ) : (
      <ChevronDown className="ml-1 inline h-3 w-3 text-foreground" />
    );
  }

  return (
    <QueryStatePanel
      isLoading={isLoading}
      isError={isError}
      errorMessage={error?.message || "Failed to load reviews"}
      loadingMessage="Loading reviews table..."
      className="min-h-80"
    >
      <div className="rounded-xl border border-border bg-card">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
          <div>
            <h3 className="text-base font-semibold text-foreground">Reviews</h3>
            <p className="text-xs text-muted-foreground">
              {filtered.length} of {records.length} records
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters((v) => !v)}
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

        {/* Filters */}
        {showFilters && (
          <div className="flex flex-wrap gap-2 border-b border-border p-4">
            <Input
              placeholder="Search work title, review type, technician, payment..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedIds(new Set());
                setCurrentPage(1);
              }}
              className="h-8 w-full text-sm sm:w-64"
            />

            <Input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setSelectedIds(new Set());
                setCurrentPage(1);
              }}
              className="h-8 w-full text-sm sm:w-40"
              title="Start date"
            />

            <Input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setSelectedIds(new Set());
                setCurrentPage(1);
              }}
              className="h-8 w-full text-sm sm:w-40"
              title="End date"
            />

            <Select
              value={reviewTypeFilter}
              onValueChange={(v) => {
                setReviewTypeFilter(v);
                setSelectedIds(new Set());
                setCurrentPage(1);
              }}
            >
              <SelectTrigger size="sm" className="w-full sm:w-44">
                <SelectValue placeholder="Review Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {reviewTypes.map((reviewType) => (
                  <SelectItem key={reviewType} value={reviewType}>
                    {reviewType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={paymentFilter}
              onValueChange={(v) => {
                setPaymentFilter(v);
                setSelectedIds(new Set());
                setCurrentPage(1);
              }}
            >
              <SelectTrigger size="sm" className="w-full sm:w-44">
                <SelectValue placeholder="Payment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                {paymentMethods.map((paymentMethod) => (
                  <SelectItem key={paymentMethod} value={paymentMethod}>
                    {paymentMethod}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Table */}
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
                        (r) => r.review_id && selectedIds.has(r.review_id),
                      )
                    }
                    onCheckedChange={toggleAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead
                  onClick={() => handleSort("review_date")}
                  className="cursor-pointer select-none text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground"
                >
                  Date
                  {renderSortIcon("review_date")}
                </TableHead>
                <TableHead className="select-none text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Finished Job
                </TableHead>
                <TableHead className="select-none text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Job Name
                </TableHead>
                <TableHead className="select-none text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Review Type
                </TableHead>
                <TableHead className="select-none text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Payment
                </TableHead>
                <TableHead
                  onClick={() => handleSort("review_amount")}
                  className="cursor-pointer select-none text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground"
                >
                  Amount
                  {renderSortIcon("review_amount")}
                </TableHead>
                <TableHead className="select-none text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="px-4 py-8 text-center text-sm text-muted-foreground"
                  >
                    No reviews match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((record) => (
                  <TableRow
                    key={record.review_id}
                    id={
                      record.review_id
                        ? `review-row-${record.review_id}`
                        : undefined
                    }
                    onClick={() => {
                      setViewRecord(record);
                      setViewOpen(true);
                    }}
                    className={cn(
                      "cursor-pointer transition-colors hover:bg-muted/50",
                      activeHighlightId &&
                        record.review_id === activeHighlightId &&
                        "bg-primary/10 ring-1 ring-inset ring-primary/20",
                      record.review_id &&
                        selectedIds.has(record.review_id) &&
                        "bg-accent",
                    )}
                  >
                    <TableCell
                      className="w-10 px-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Checkbox
                        checked={
                          !!record.review_id &&
                          selectedIds.has(record.review_id)
                        }
                        onCheckedChange={() =>
                          record.review_id && toggleRow(record.review_id)
                        }
                        aria-label={`Select ${record.work_title ?? "review"}`}
                      />
                    </TableCell>

                    {/* Date */}
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {formatDate(record.review_date)}
                    </TableCell>

                    {/* Finished Job */}
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {record.work_order_id ? (
                        <Link
                          href={`/dashboard/jobs?highlight=${record.work_order_id}`}
                          className="text-primary underline-offset-2 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {record.work_order_id}
                        </Link>
                      ) : (
                        "-"
                      )}
                    </TableCell>

                    {/* Job Name */}
                    <TableCell className="whitespace-nowrap font-medium text-foreground">
                      {record.work_title || "-"}
                    </TableCell>

                    {/* Review Type */}
                    <TableCell>
                      <span className="inline-flex rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground">
                        {record.review_type || "-"}
                      </span>
                    </TableCell>

                    {/* Payment */}
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {record.payment_method || "-"}
                    </TableCell>

                    {/* Amount */}
                    <TableCell className="text-right font-semibold text-foreground">
                      {fmt(record.review_amount ?? 0)}
                    </TableCell>

                    {/* Actions */}
                    <TableCell
                      onClick={(e) => e.stopPropagation()}
                      className="text-center"
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-36">
                          <DropdownMenuItem
                            onClick={() => onEdit(record)}
                            className="cursor-pointer gap-2"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              if (record.review_id)
                                setConfirmDeleteId(record.review_id);
                            }}
                            className="cursor-pointer gap-2 text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
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
            <span className="font-medium text-foreground">
              {filtered.length}
            </span>
            {" records"}
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

        <ReviewViewDialog
          record={viewRecord}
          open={viewOpen}
          onOpenChange={setViewOpen}
          onEdit={() => {
            if (!viewRecord) return;
            onEdit(viewRecord);
          }}
          onDelete={() => {
            if (viewRecord?.review_id) setConfirmDeleteId(viewRecord.review_id);
          }}
        />

        <ReviewDeleteAlert
          open={!!confirmDeleteId}
          onOpenChange={(open) => !open && setConfirmDeleteId(null)}
          onConfirm={() => {
            if (confirmDeleteId) deleteReview(confirmDeleteId);
            setConfirmDeleteId(null);
            setViewOpen(false);
          }}
        />

        <ReviewDeleteAlert
          open={confirmBulkDelete}
          onOpenChange={(open) => !open && setConfirmBulkDelete(false)}
          onConfirm={() => {
            bulkDeleteReviews(Array.from(selectedIds));
            setSelectedIds(new Set());
            setConfirmBulkDelete(false);
          }}
        />
      </div>
    </QueryStatePanel>
  );
}
