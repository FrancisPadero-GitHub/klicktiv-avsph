"use client";

import { useMemo, useState } from "react";
import { ExternalLink, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { useUpdateFeedback } from "@/hooks/super-admin/feedback/useUpdateFeedbacks";
import type { FeedbacksRow } from "@/hooks/super-admin/feedback/useFetchFeedbacks";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface FeedbacksDialogProps {
  feedback: FeedbacksRow;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isSafeUrl(url: string): boolean {
  try {
    const { protocol } = new URL(url);
    return protocol === "https:" || protocol === "http:";
  } catch {
    return false;
  }
}

const STATUS_COLORS: Record<string, string> = {
  open: "bg-primary/10 text-primary",
  in_progress: "bg-secondary text-secondary-foreground",
  resolved: "bg-success/10 text-success",
  closed: "bg-muted text-muted-foreground",
};

const PRIORITY_COLORS: Record<string, string> = {
  critical: "bg-destructive/10 text-destructive",
  high: "bg-primary/10 text-primary",
  medium: "bg-primary/10 text-primary",
  low: "bg-success/10 text-success",
};

const DEFAULT_BG = "bg-muted text-muted-foreground";

export function FeedbacksDialog({
  feedback,
  open,
  onOpenChange,
}: FeedbacksDialogProps) {
  const { mutate: updateFeedback, isPending } = useUpdateFeedback();

  const [status, setStatus] = useState<string>(feedback.status ?? "open");
  const [priority, setPriority] = useState<string>(feedback.priority ?? "low");
  const [screenshotError, setScreenshotError] = useState(false);

  const isDirty = useMemo(
    () =>
      status !== (feedback.status ?? "open") ||
      priority !== (feedback.priority ?? "low"),
    [status, priority, feedback.status, feedback.priority],
  );

  const handleUpdate = () => {
    updateFeedback(
      { id: feedback.id, status, priority },
      { onSuccess: () => onOpenChange(false) },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Update Feedback</DialogTitle>
          <DialogDescription>
            View details and update the status and priority of this feedback
            report.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col flex-1 min-h-0">
          <div className="overflow-y-auto flex-1 grid gap-6 py-2 pl-2 pr-1">
            {/* ── Feedback Details Section ─────────────────────────── */}
            <div className="grid gap-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Feedback Details
              </h3>

              {/* Title */}
              <div className="grid gap-1.5">
                <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Title
                </Label>
                <p className="text-sm font-semibold text-foreground break-all">
                  {feedback.title}
                </p>
              </div>

              {/* Description */}
              <div className="grid gap-1.5">
                <Label className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                  Description
                </Label>
                <div className="max-h-40 overflow-y-auto whitespace-pre-wrap break-all rounded-md bg-muted p-3 text-sm text-foreground min-h-20">
                  {feedback.description}
                </div>
              </div>

              {/* Type + Submitted */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                  <Label className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                    Type
                  </Label>
                  <p className="text-sm capitalize text-foreground">
                    {feedback.type.replace(/_/g, " ")}
                  </p>
                </div>
                <div className="grid gap-1.5">
                  <Label className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                    Submitted
                  </Label>
                  <p className="text-sm text-foreground">
                    {formatDate(feedback.created_at)}
                  </p>
                </div>
              </div>

              {/* Page URL */}
              {feedback.page_url && isSafeUrl(feedback.page_url) && (
                <div className="grid gap-1.5">
                  <Label className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                    Page
                  </Label>
                  <a
                    href={feedback.page_url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1 truncate text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="h-3 w-3 shrink-0" />
                    {feedback.page_url}
                  </a>
                </div>
              )}

              {/* Screenshot */}
              {feedback.screenshot_url &&
                isSafeUrl(feedback.screenshot_url) && (
                  <div className="grid gap-1.5">
                    <Label className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                      Screenshot
                    </Label>
                    {screenshotError ? (
                      <a
                        href={feedback.screenshot_url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        <ExternalLink className="h-3 w-3 shrink-0" />
                        View Screenshot
                      </a>
                    ) : (
                      <div className="relative overflow-hidden rounded-md border border-border bg-muted">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={feedback.screenshot_url}
                          alt="Feedback screenshot"
                          className="max-h-50 w-full object-contain"
                          onError={() => setScreenshotError(true)}
                        />
                        <a
                          href={feedback.screenshot_url}
                          target="_blank"
                          rel="noreferrer noopener"
                          title="Open full size"
                          className="absolute right-2 top-2 rounded bg-black/50 p-1 text-white hover:bg-black/70"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    )}
                  </div>
                )}
            </div>

            {/* ── Resolution Section ─────────────────────────────── */}
            <div className="grid gap-4 border-t border-border pt-5 mt-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Resolution Management
              </h3>

              {/* Current status + priority badges */}
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
                    STATUS_COLORS[feedback.status ?? "open"] ?? DEFAULT_BG,
                  )}
                >
                  {(feedback.status ?? "open").replace(/_/g, " ")}
                </span>
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
                    PRIORITY_COLORS[feedback.priority ?? "low"] ?? DEFAULT_BG,
                  )}
                >
                  {feedback.priority ?? "low"}
                </span>
              </div>

              {/* Status + Priority selects */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="status">Update Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="priority">Update Priority</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Resolved at */}
              {feedback.resolved_at && (
                <div className="grid gap-1.5 mt-2">
                  <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Resolved At
                  </Label>
                  <p className="text-sm text-foreground">
                    {formatDate(feedback.resolved_at)}
                  </p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="pt-5 pb-1">
            <div className="flex gap-2 ml-auto">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdate} disabled={isPending || !isDirty}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
