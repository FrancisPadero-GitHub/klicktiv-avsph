"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { NotificationsRow } from "@/hooks/notifications/useFetchNotifications";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { relativeTime } from "./sidebar-notifcation";
import { formatEntityType, fmt, shortId } from "@/lib/helper";
import {
  Bell,
  Clock,
  Inbox,
  CheckCircle2,
  Tag,
  Hash,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationDetailDialogProps {
  notification: NotificationsRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function absoluteTime(dateStr: string | null) {
  if (!dateStr) return null;
  try {
    return format(new Date(dateStr), "MMM d, yyyy 'at' h:mm a");
  } catch {
    return dateStr;
  }
}

const currencyKey = /amount|subtotal|deposits|tip|parts|price|balance/i;
const dateKey = /(date|created_at|promoted_at)/i;
const idKey = /_id$/i;

const formatKey = (key: string) =>
  key
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : word))
    .join(" ");

const formatValue = (key: string, value: unknown): string => {
  if (value === null || typeof value === "undefined" || value === "") {
    return "–";
  }
  if (typeof value === "number") {
    return currencyKey.test(key) ? fmt(value) : String(value);
  }
  if (typeof value === "string") {
    if (dateKey.test(key)) return absoluteTime(value) ?? value;
    if (idKey.test(key)) return shortId(value);
    return value.replace(/_/g, " ");
  }
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }
  return JSON.stringify(value);
};

const getOrderedEntries = (data: Record<string, unknown>) => {
  const priorityKeys = [
    "work_order_id",
    "job_id",
    "review_id",
    "estimated_amount",
    "amount",
    "subtotal",
    "deposits",
    "payment_status",
    "status",
    "review_date",
    "promoted_at",
    "created_at",
  ];
  const entries: Array<[string, unknown]> = [];
  const seen = new Set<string>();
  priorityKeys.forEach((key) => {
    if (key in data) {
      entries.push([key, data[key]]);
      seen.add(key);
    }
  });
  Object.entries(data).forEach(([key, value]) => {
    if (!seen.has(key)) entries.push([key, value]);
  });
  return entries;
};

/* ─── Tiny helpers ─── */
function NotificationTypeIcon() {
  return (
    <div
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
        "bg-primary/10 text-primary ring-4 ring-primary/5",
      )}
    >
      <Bell className="h-4.5 w-4.5" />
    </div>
  );
}

function MetaRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | null | undefined;
}) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-5 w-5 shrink-0 items-center justify-center text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="flex min-w-0 flex-1 items-start justify-between gap-4">
        <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
          {label}
        </span>
        <span className="text-right text-xs text-foreground">{value}</span>
      </div>
    </div>
  );
}

export default function NotificationDetailDialog({
  notification,
  open,
  onOpenChange,
}: NotificationDetailDialogProps) {
  if (!notification) return null;

  const parsedData =
    notification.data && typeof notification.data === "object"
      ? (notification.data as Record<string, unknown>)
      : null;

  const orderedEntries = parsedData ? getOrderedEntries(parsedData) : [];
  const isRead = Boolean(notification.read_at);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-110">
        {/* ── Unread accent strip ── */}
        {!isRead && (
          <div className="h-1 w-full bg-linear-to-r from-primary via-primary/70 to-transparent" />
        )}

        {/* ── Header ── */}
        <DialogHeader className="px-5 pt-5 pb-4">
          <div className="flex items-start gap-3">
            <NotificationTypeIcon />

            <div className="flex min-w-0 flex-1 flex-col gap-1">
              {/* badges row */}
              <div className="flex flex-wrap items-center gap-1.5">
                {!isRead && (
                  <Badge
                    variant="destructive"
                    className="h-4 px-1.5 text-[10px]"
                  >
                    Unread
                  </Badge>
                )}
              </div>

              <DialogTitle className="text-sm font-semibold leading-snug">
                {notification.title}
              </DialogTitle>

              <DialogDescription className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Clock className="h-3 w-3 shrink-0" />
                {relativeTime(notification.created_at)}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[58vh]">
          <div className="flex flex-col gap-0 divide-y divide-border">
            {/* ── Body message ── */}
            {notification.body && (
              <div className="px-5 py-4">
                <p className="text-sm leading-relaxed text-foreground">
                  {notification.body}
                </p>
              </div>
            )}

            {/* ── Data details ── */}
            {orderedEntries.length > 0 && (
              <div className="px-5 py-4">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Details
                </p>
                <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2.5">
                  {orderedEntries.map(([key, value]) => (
                    <span key={key} className="contents text-xs">
                      <span className="font-medium text-muted-foreground whitespace-nowrap">
                        {formatKey(key)}
                      </span>
                      <span
                        className={cn(
                          "break-all text-foreground",
                          currencyKey.test(key) && "font-semibold text-primary",
                        )}
                      >
                        {formatValue(key, value)}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* ── Timeline meta ── */}
            <div className="px-5 py-4">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Timeline
              </p>
              <div className="flex flex-col gap-2.5">
                <MetaRow
                  icon={Inbox}
                  label="Received"
                  value={absoluteTime(notification.created_at)}
                />
                {notification.delivered_at && (
                  <MetaRow
                    icon={CheckCircle2}
                    label="Delivered"
                    value={absoluteTime(notification.delivered_at)}
                  />
                )}
                {notification.read_at && (
                  <MetaRow
                    icon={CheckCircle2}
                    label="Read"
                    value={absoluteTime(notification.read_at)}
                  />
                )}
              </div>
            </div>

            {/* ── Reference meta ── */}
            {(notification.entity_type || notification.entity_id) && (
              <div className="px-5 py-4">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Reference
                </p>
                <div className="flex flex-col gap-2.5">
                  {notification.entity_type && (
                    <MetaRow
                      icon={Tag}
                      label="Type"
                      value={formatEntityType(notification.entity_type)}
                    />
                  )}
                  {notification.entity_id && (
                    <MetaRow
                      icon={Hash}
                      label="ID"
                      value={shortId(notification.entity_id)}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between border-t bg-muted/30 px-5 py-3">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {absoluteTime(notification.created_at)}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => onOpenChange(false)}
          >
            Dismiss
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
