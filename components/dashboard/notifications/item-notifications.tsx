"use client";

import { useMemo } from "react";
import { Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { NotificationsRow } from "@/hooks/notifications/useFetchNotifications";
import { cn } from "@/lib/utils";
import { formatEntityType, fmt, formatDate, shortId } from "@/lib/helper";
import { relativeTime } from "./sidebar-notifcation";

type Highlight = { label: string; value: string };

const currencyKey = /amount|subtotal|deposits|tip|parts|price|balance/i;
const dateKey = /(date|created_at|promoted_at)/i;
const idKey = /_id$/i;

const toTitle = (value: string) =>
  value
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : word))
    .join(" ");

const formatValue = (key: string, value: unknown): string => {
  if (value === null || typeof value === "undefined" || value === "") {
    return "-";
  }

  if (typeof value === "number") {
    return currencyKey.test(key) ? fmt(value) : String(value);
  }

  if (typeof value === "string") {
    if (dateKey.test(key)) return formatDate(value);
    if (idKey.test(key)) return shortId(value);
    return toTitle(value);
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return String(value);
};

const buildHighlights = (notification: NotificationsRow): Highlight[] => {
  const data =
    notification.data && typeof notification.data === "object"
      ? (notification.data as Record<string, unknown>)
      : null;

  if (!data) return [];

  const highlights: Highlight[] = [];
  const add = (label: string, key: string) => {
    const value = data[key];
    if (value === null || typeof value === "undefined" || value === "") return;
    highlights.push({ label, value: formatValue(key, value) });
  };

  switch (notification.type) {
    case "job_posted":
      add("Status", "status");
      add("Payment", "payment_status");
      add("Subtotal", "subtotal");
      add("Deposits", "deposits");
      break;
    case "estimate_posted":
      add("Estimate", "estimated_amount");
      add("Status", "status");
      add("Handled by", "handled_by");
      break;
    case "review_posted":
      add("Amount", "amount");
      add("Review date", "review_date");
      break;
    case "payment_due":
      add("Balance", "balance");
      add("Subtotal", "subtotal");
      add("Deposits", "deposits");
      break;
    default:
      Object.entries(data).forEach(([key]) => {
        if (highlights.length < 3) {
          add(toTitle(key), key);
        }
      });
      break;
  }

  return highlights.slice(0, 3);
};

interface NotificationItemProps {
  notification: NotificationsRow;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
  onViewDetail: (notification: NotificationsRow) => void;
  isPending: boolean;
}

export default function NotificationItem({
  notification,
  onMarkRead,
  onDelete,
  onViewDetail,
  isPending,
}: NotificationItemProps) {
  const isUnread = !notification.read_at;

  const timeAgo = useMemo(
    () => relativeTime(notification.created_at),
    [notification.created_at],
  );

  const highlights = useMemo(
    () => buildHighlights(notification),
    [notification],
  );

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => onViewDetail(notification)}
      onKeyDown={(e) => e.key === "Enter" && onViewDetail(notification)}
      className={cn(
        "group relative flex w-full cursor-pointer flex-col gap-1 rounded-lg border border-transparent px-3 py-2",
        "transition-all duration-150 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
        "hover:-translate-y-0.5 hover:border-border hover:bg-muted/40 hover:shadow-sm",
        "active:scale-[0.98] active:bg-muted/50",
        isUnread && "border-l-4 border-l-primary bg-primary/5 pl-3",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          {isUnread && <span className="h-2 w-2 rounded-full bg-primary" />}
          {notification.entity_type && (
            <Badge
              variant="secondary"
              className="mb-0.5 w-fit text-[10px] h-4 px-1.5"
            >
              {formatEntityType(notification.entity_type)}
            </Badge>
          )}
          {!isUnread && (
            <Badge variant="outline" className="text-[10px] h-4 px-1.5">
              Read
            </Badge>
          )}
        </div>
        <span className="text-[11px] text-muted-foreground">{timeAgo}</span>
      </div>

      <p
        className={cn(
          "mt-1 text-sm leading-snug",
          isUnread
            ? "font-semibold text-foreground"
            : "font-medium text-muted-foreground",
        )}
      >
        {notification.title}
      </p>

      {notification.body && (
        <p className="line-clamp-2 text-xs text-muted-foreground leading-relaxed">
          {notification.body}
        </p>
      )}

      {highlights.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {highlights.map((item) => (
            <span
              key={`${item.label}-${item.value}`}
              className="rounded-md bg-muted px-2 py-1 text-[11px] text-muted-foreground"
            >
              <span className="font-medium text-foreground">{item.label}:</span>{" "}
              {item.value}
            </span>
          ))}
        </div>
      )}

      <div className="mt-2 flex items-center justify-between gap-3">
        <span
          className={cn(
            "text-[11px]",
            isUnread ? "text-foreground/70" : "text-muted-foreground",
          )}
        >
          {isUnread ? "Unread" : "Read"}
        </span>
        <div
          className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={(e) => e.stopPropagation()}
        >
          {isUnread && (
            <Button
              variant="ghost"
              size="icon-xs"
              title="Mark as read"
              disabled={isPending}
              onClick={() => onMarkRead(notification.id)}
              className="h-6 w-6 text-muted-foreground hover:text-foreground"
            >
              <Check className="h-5 w-5" />
              <span className="sr-only">Mark as read</span>
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon-xs"
            title="Dismiss notification"
            disabled={isPending}
            onClick={() => onDelete(notification.id)}
            className="h-6 w-6 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-5 w-5" />
            <span className="sr-only">Dismiss</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
