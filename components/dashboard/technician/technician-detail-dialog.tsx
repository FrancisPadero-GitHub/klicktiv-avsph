"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { CalendarDays, Mail, Pencil, Percent, Trash2 } from "lucide-react";

type TechnicianDetail = {
  technician_id: string | null;
  name: string | null;
  commission: number | null;
  email: string | null;
  hired_date: string | null;
  deleted_at: string | null;
  total_jobs: number | null;
  gross_revenue: number | null;
  total_company_net: number | null;
  total_commission_earned: number | null;
  total_parts: number | null;
  total_tips: number | null;
};

type TechnicianDetailDialogProps = {
  selectedTech: TechnicianDetail | null;
  formatCurrency: (value: number) => string;
  onClose: () => void;
  onRemove: (technicianId: string) => void;
  onEdit: (tech: TechnicianDetail) => void;
};

export function TechnicianDetailDialog({
  selectedTech,
  formatCurrency,
  onClose,
  onRemove,
  onEdit,
}: TechnicianDetailDialogProps) {
  return (
    <Dialog open={!!selectedTech} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden">
        {selectedTech && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3 pr-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-sm font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  {(selectedTech.name || "?")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="min-w-0">
                  <DialogTitle className="truncate text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                    {selectedTech.name || "Unknown"}
                  </DialogTitle>
                  <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
                    {selectedTech.email || "No email"}
                  </p>
                </div>
              </div>
            </DialogHeader>

            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {[
                  {
                    label: "Total Gross",
                    value: formatCurrency(selectedTech.gross_revenue ?? 0),
                    className: "text-zinc-900 dark:text-zinc-100",
                  },
                  {
                    label: "Company Net",
                    value: formatCurrency(selectedTech.total_company_net ?? 0),
                    className: "text-cyan-700 dark:text-cyan-400",
                  },
                  {
                    label: "Tech Earned",
                    value: formatCurrency(
                      selectedTech.total_commission_earned ?? 0,
                    ),
                    className: "text-emerald-600 dark:text-emerald-400",
                  },
                  {
                    label: "Jobs",
                    value: String(selectedTech.total_jobs ?? 0),
                    className: "text-zinc-900 dark:text-zinc-100",
                  },
                  {
                    label: "Parts",
                    value: formatCurrency(selectedTech.total_parts ?? 0),
                    className: "text-zinc-500 dark:text-zinc-400",
                  },
                  {
                    label: "Tips",
                    value: formatCurrency(selectedTech.total_tips ?? 0),
                    className: "text-zinc-500 dark:text-zinc-400",
                  },
                ].map(({ label, value, className }) => (
                  <div
                    key={label}
                    className="flex flex-col justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800/50"
                  >
                    <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                      {label}
                    </p>
                    <p
                      className={cn(
                        "mt-1 text-base font-semibold tabular-nums",
                        className,
                      )}
                    >
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-zinc-100 dark:bg-zinc-800">
                    <Percent className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                      Commission Rate
                    </p>
                    <p className="mt-0.5 text-sm text-zinc-800 dark:text-zinc-200">
                      {selectedTech.commission ?? 0}%
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-zinc-100 dark:bg-zinc-800">
                    <Mail className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                      Email
                    </p>
                    <p className="mt-0.5 text-sm text-zinc-800 dark:text-zinc-200">
                      {selectedTech.email || "-"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-zinc-100 dark:bg-zinc-800">
                    <CalendarDays className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                      Hired
                    </p>
                    <p className="mt-0.5 text-sm text-zinc-800 dark:text-zinc-200">
                      {selectedTech.hired_date
                        ? new Date(selectedTech.hired_date).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="border-t border-zinc-200 pt-4 dark:border-zinc-700 sm:justify-between">
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
                  onClick={() => onRemove(selectedTech.technician_id ?? "")}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </Button>
                <Button
                  size="sm"
                  className="gap-1.5"
                  onClick={() => {
                    onClose();
                    onEdit(selectedTech);
                  }}
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </Button>
              </div>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
