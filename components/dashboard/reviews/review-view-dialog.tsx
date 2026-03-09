"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { ReviewRecordRow } from "@/hooks/reviews/useFetchReviewRecords";
import {
  Calendar,
  CreditCard,
  DollarSign,
  ExternalLink,
  Pencil,
  StickyNote,
  Tag,
  Trash2,
  User,
} from "lucide-react";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    n,
  );

const formatDateWithTime = (dateStr: string | null) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

interface ReviewViewDialogProps {
  record: ReviewRecordRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <div className="mt-0.5 text-sm text-foreground">
          {children}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-20 flex-col justify-between rounded-lg border border-border bg-muted/50 px-4 py-3",
        className,
      )}
    >
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="text-base font-semibold tabular-nums">{value}</p>
    </div>
  );
}

export function ReviewViewDialog({
  record,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: ReviewViewDialogProps) {
  if (!record) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] w-full sm:max-w-3xl flex-col overflow-hidden">
        <DialogHeader>
          <div className="flex items-start justify-between gap-3 pr-6">
            <div className="min-w-0">
              <DialogTitle className="truncate text-lg font-semibold text-foreground">
                {record.work_title ?? "Review Details"}
              </DialogTitle>
              {record.review_date && (
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {formatDateWithTime(record.review_date)}
                </p>
              )}
            </div>
            {record.review_type && (
              <span className="mt-0.5 inline-flex shrink-0 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground">
                {record.review_type}
              </span>
            )}
          </div>
        </DialogHeader>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-2">
          {/* Financial summary cards */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <StatCard
              label="Review Amount"
              value={fmt(record.review_amount ?? 0)}
              className="text-emerald-600 dark:text-emerald-400"
            />
            <StatCard
              label="Job Subtotal"
              value={fmt(record.subtotal ?? 0)}
              className="text-foreground"
            />
            <StatCard
              label="Parts Cost"
              value={fmt(record.parts_total_cost ?? 0)}
              className="text-orange-500 dark:text-orange-400"
            />
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            {/* Left Column - Info */}
            <div className="space-y-3">
              <InfoRow icon={Calendar} label="Review Date">
                {record.review_date
                  ? new Date(record.review_date).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })
                  : "-"}
              </InfoRow>

              {record.work_order_id && (
                <InfoRow icon={ExternalLink} label="Linked Job">
                  <Link
                    href={`/dashboard/jobs?highlight=${record.work_order_id}`}
                    className="font-mono text-xs text-primary underline-offset-2 hover:underline"
                    onClick={() => onOpenChange(false)}
                  >
                    {record.work_order_id}
                  </Link>
                </InfoRow>
              )}

              {record.technician_id && (
                <InfoRow icon={User} label="Technician">
                  {record.technician_id}
                </InfoRow>
              )}
            </div>

            {/* Right Column - Numbers & Additional Info */}
            <div className="space-y-3">
              {record.category && (
                <InfoRow icon={Tag} label="Category">
                  {record.category}
                </InfoRow>
              )}

              <InfoRow icon={CreditCard} label="Payment Method">
                {record.payment_method ?? "-"}
              </InfoRow>

              <InfoRow icon={DollarSign} label="Tip">
                {fmt(record.tip_amount ?? 0)}
              </InfoRow>
            </div>
          </div>

          {/* Notes */}
          {record.review_notes && (
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <div className="mb-1.5 flex items-center gap-2">
                <StickyNote className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Notes
                </span>
              </div>
              <p className="whitespace-pre-wrap text-sm text-foreground">
                {record.review_notes}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="border-t border-border pt-4 sm:justify-between">
          <DialogClose asChild>
            <Button variant="outline" size="sm">
              Close
            </Button>
          </DialogClose>
          <div className="flex gap-2">
            <Button
              variant="destructive"
              size="sm"
              className="gap-1.5"
              onClick={onDelete}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
            <Button
              size="sm"
              className="gap-1.5"
              onClick={() => {
                onEdit?.();
                onOpenChange(false);
              }}
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
