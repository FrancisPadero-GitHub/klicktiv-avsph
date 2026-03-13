"use client";

import { Fragment, useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Bell, CheckCheck, InboxIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { useFetchNotifications } from "@/hooks/notifications/useFetchNotifications";
import { useUpdateNotifications } from "@/hooks/notifications/useUpdateNotifications";
import type { NotificationsRow } from "@/hooks/notifications/useFetchNotifications";
import { cn } from "@/lib/utils";
import NotificationDetailDialog from "./dialog-notification";
import NotificationItem from "./item-notifications";

export default function SidebarNotification() {
  const { data: notifications, isLoading } = useFetchNotifications();
  const { updateReadAt, softDeleteNotification, isPending } =
    useUpdateNotifications();

  const [selectedNotification, setSelectedNotification] =
    useState<NotificationsRow | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const unreadCount = useMemo(
    () => (notifications ?? []).filter((n) => !n.read_at).length,
    [notifications],
  );

  const hasUnread = unreadCount > 0;
  const hasNotifications = (notifications ?? []).length > 0;

  const handleMarkAllRead = () => {
    (notifications ?? [])
      .filter((n) => !n.read_at)
      .forEach((n) => updateReadAt(n.id));
  };

  const handleViewDetail = (notification: NotificationsRow) => {
    setSelectedNotification(notification);
    setDetailOpen(true);
    if (!notification.read_at) {
      updateReadAt(notification.id);
    }
  };

  return (
    <div>
      <NotificationDetailDialog
        notification={selectedNotification}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />

      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label="Open notifications"
          >
            <Bell className="h-5 w-5" />
            {hasUnread && (
              <span
                className={cn(
                  "absolute right-1.5 top-1.5 flex h-2 w-2 items-center justify-center rounded-full bg-destructive",
                  "animate-[pulse_1.8s_ease-in-out_infinite]",
                )}
              />
            )}
          </Button>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="flex w-[88vw] max-w-sm flex-col gap-0 p-0 sm:h-dvh sm:w-full sm:max-w-sm"
          showCloseButton={true}
        >
          <SheetHeader className="flex-row items-start justify-between border-b px-4 ">
            <div className="flex min-w-0 flex-col gap-1">
              <div className="flex items-center gap-2">
                <SheetTitle className="text-base">Notifications</SheetTitle>
                {hasUnread && (
                  <Badge
                    variant="destructive"
                    className="h-5 min-w-5 px-1.5 text-[10px]"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Company updates and reminders.
              </p>
            </div>
          </SheetHeader>
          {hasUnread && (
            <Button
              variant="ghost"
              size="sm"
              className="h-5 mt-2 text-xs text-muted-foreground hover:text-foreground"
              onClick={handleMarkAllRead}
              disabled={isPending}
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </Button>
          )}

          <ScrollArea className="flex-1 overflow-y-auto">
            {isLoading ? (
              <NotificationSkeleton />
            ) : !hasNotifications ? (
              <EmptyNotifications />
            ) : (
              <div className="flex flex-col py-0">
                {(notifications ?? []).map((notification, index) => (
                  <Fragment key={notification.id}>
                    <div className="px-3 py-2">
                      <NotificationItem
                        notification={notification}
                        onMarkRead={updateReadAt}
                        onDelete={softDeleteNotification}
                        onViewDetail={handleViewDetail}
                        isPending={isPending}
                      />
                    </div>
                    {index < (notifications ?? []).length - 1 && (
                      <Separator className="mx-3" />
                    )}
                  </Fragment>
                ))}
              </div>
            )}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function relativeTime(dateStr: string) {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
  } catch {
    return "recently";
  }
}

function NotificationSkeleton() {
  return (
    <div className="flex flex-col gap-3 px-4 py-3 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-1.5">
          <div className="h-3.5 w-2/3 rounded-md bg-muted" />
          <div className="h-3 w-full rounded-md bg-muted" />
          <div className="h-3 w-1/4 rounded-md bg-muted" />
          {i < 3 && <Separator className="mt-2" />}
        </div>
      ))}
    </div>
  );
}

function EmptyNotifications() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <InboxIcon className="h-7 w-7 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium text-foreground">All caught up!</p>
      <p className="text-xs text-muted-foreground">
        No notifications right now. We&apos;ll let you know when something comes
        in.
      </p>
    </div>
  );
}
