"use client";

import { useMemo, useState, useCallback } from "react";
import {
  Eye,
  MessageSquare,
  SlidersHorizontal,
  X,
  MoreHorizontal,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  useFetchFeedbacks,
  type FeedbacksRow,
} from "@/hooks/super-admin/feedback/useFetchFeedbacks";
import { useUpdateFeedback } from "@/hooks/super-admin/feedback/useUpdateFeedbacks";
import { FeedbacksDialog } from "./feedbacks-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusColor(status: string | null): string {
  switch (status) {
    case "open":
      return "bg-primary/10 text-primary";
    case "in_progress":
      return "bg-secondary text-secondary-foreground";
    case "resolved":
      return "bg-success/10 text-success";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function getPriorityColor(priority: string | null): string {
  switch (priority) {
    case "critical":
      return "bg-destructive/10 text-destructive";
    case "high":
    case "medium":
      return "bg-primary/10 text-primary";
    case "low":
      return "bg-success/10 text-success";
    default:
      return "bg-muted text-muted-foreground";
  }
}

type StatusFilter = "all" | "open" | "in_progress" | "resolved" | "closed";
type TypeFilter = "all" | "bug" | "feature_request" | "feedback";
type PriorityFilter = "all" | "low" | "medium" | "high" | "critical";

export function FeedbacksTable() {
  const { data: feedbacks, isLoading, isError, error } = useFetchFeedbacks();
  const { mutate: updateFeedback } = useUpdateFeedback();
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbacksRow | null>(
    null,
  );

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [showFilters, setShowFilters] = useState(true);

  const activeFilterCount = [
    search !== "",
    statusFilter !== "all",
    typeFilter !== "all",
    priorityFilter !== "all",
  ].filter(Boolean).length;

  const resetFilters = useCallback(() => {
    setSearch("");
    setStatusFilter("all");
    setTypeFilter("all");
    setPriorityFilter("all");
  }, []);

  const updateSearch = useCallback((v: string) => {
    setSearch(v);
  }, []);

  const updateStatusFilter = useCallback((v: StatusFilter) => {
    setStatusFilter(v);
  }, []);

  const updateTypeFilter = useCallback((v: TypeFilter) => {
    setTypeFilter(v);
  }, []);

  const updatePriorityFilter = useCallback((v: PriorityFilter) => {
    setPriorityFilter(v);
  }, []);

  const filteredFeedbacks = useMemo(() => {
    if (!feedbacks) return [];
    const q = search.toLowerCase().trim();

    return feedbacks.filter((f) => {
      const matchSearch =
        !q ||
        f.title.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q);

      const matchStatus =
        statusFilter === "all" || (f.status ?? "open") === statusFilter;
      const matchType = typeFilter === "all" || f.type === typeFilter;
      const matchPriority =
        priorityFilter === "all" || (f.priority ?? "low") === priorityFilter;

      return matchSearch && matchStatus && matchType && matchPriority;
    });
  }, [feedbacks, search, statusFilter, typeFilter, priorityFilter]);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-6 py-4">
          <div className="h-5 w-24 animate-pulse rounded bg-muted" />
          <div className="mt-1.5 h-3 w-16 animate-pulse rounded bg-muted/60" />
        </div>
        <div className="divide-y divide-border">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4">
              <div className="h-8 w-8 animate-pulse rounded-md bg-muted" />
              <div className="flex-1 space-y-1.5">
                <div className="h-4 w-48 animate-pulse rounded bg-muted" />
              </div>
              <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
              <div className="h-5 w-12 animate-pulse rounded-full bg-muted/60" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-8 text-center text-sm text-destructive">
        Failed to load feedbacks: {error.message}
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl border border-border bg-card">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Feedbacks
            </h3>
            <p className="text-xs text-muted-foreground">
              {filteredFeedbacks.length} of {feedbacks?.length ?? 0} total
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
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                  {activeFilterCount}
                </span>
              )}
            </Button>

            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
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
          <div className="flex flex-wrap items-center gap-2 border-b border-border p-4">
            <Input
              placeholder="Search title, description..."
              value={search}
              onChange={(e) => updateSearch(e.target.value)}
              className="h-8 w-full text-sm sm:w-64"
            />

            <Select
              value={statusFilter}
              onValueChange={(v) => updateStatusFilter(v as StatusFilter)}
            >
              <SelectTrigger className="h-8 w-full sm:w-36 text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={typeFilter}
              onValueChange={(v) => updateTypeFilter(v as TypeFilter)}
            >
              <SelectTrigger className="h-8 w-full sm:w-36 text-xs">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="bug">Bug</SelectItem>
                <SelectItem value="feature_request">Feature Request</SelectItem>
                <SelectItem value="feedback">Feedback</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={priorityFilter}
              onValueChange={(v) => updatePriorityFilter(v as PriorityFilter)}
            >
              <SelectTrigger className="h-8 w-full sm:w-36 text-xs">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="overflow-x-auto min-h-96">
          <Table>
            <TableHeader>
              <TableRow className="sticky top-0 border-b border-border bg-card hover:bg-card">
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Title
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Type
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Status
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Priority
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Submitted
                </TableHead>
                <TableHead className="text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border">
              {filteredFeedbacks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <MessageSquare className="h-6 w-6 text-muted/60" />
                      <span className="text-sm text-muted-foreground">
                        {activeFilterCount > 0
                          ? "No feedbacks match the current filters."
                          : "No feedbacks found."}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredFeedbacks.map((feedback) => (
                  <TableRow
                    key={feedback.id}
                    onClick={() => setSelectedFeedback(feedback)}
                    className="cursor-pointer transition-colors hover:bg-muted/50"
                  >
                    {/* Title */}
                    <TableCell className="max-w-xs font-medium text-foreground truncate">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
                          <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <span
                          className="truncate font-medium text-foreground"
                          title={feedback.title}
                        >
                          {feedback.title}
                        </span>
                      </div>
                    </TableCell>

                    {/* Type */}
                    <TableCell className="whitespace-nowrap text-foreground">
                      <span className="capitalize">
                        {feedback.type.replace(/_/g, " ")}
                      </span>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="whitespace-nowrap">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
                          getStatusColor(feedback.status),
                        )}
                      >
                        {(feedback.status ?? "open").replace(/_/g, " ")}
                      </span>
                    </TableCell>

                    {/* Priority */}
                    <TableCell className="whitespace-nowrap">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
                          getPriorityColor(feedback.priority),
                        )}
                      >
                        {feedback.priority ?? "low"}
                      </span>
                    </TableCell>

                    {/* Submitted */}
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {formatDate(feedback.created_at)}
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
                            onClick={() => setSelectedFeedback(feedback)}
                            className="gap-2"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() =>
                              updateFeedback({
                                id: feedback.id,
                                status: "open",
                              })
                            }
                          >
                            Mark as Open
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              updateFeedback({
                                id: feedback.id,
                                status: "in_progress",
                              })
                            }
                          >
                            Mark as In Progress
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              updateFeedback({
                                id: feedback.id,
                                status: "resolved",
                              })
                            }
                          >
                            Mark as Resolved
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              updateFeedback({
                                id: feedback.id,
                                status: "closed",
                              })
                            }
                          >
                            Mark as Closed
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
      </div>

      {selectedFeedback && (
        <FeedbacksDialog
          feedback={selectedFeedback}
          open={!!selectedFeedback}
          onOpenChange={(open) => !open && setSelectedFeedback(null)}
        />
      )}
    </>
  );
}
