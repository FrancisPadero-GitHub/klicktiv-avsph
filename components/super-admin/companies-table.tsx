"use client";

import { useState } from "react";
import {
  Building2,
  Loader2,
  MoreHorizontal,
  Trash2,
  RotateCcw,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { CompanyWithUserCount } from "@/hooks/super-admin/useFetchCompanies";
import {
  useConfigureCompany,
  type ConfigureCompanyInput,
} from "@/hooks/super-admin/useConfigureCompany";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CompaniesTableProps {
  companies: CompanyWithUserCount[] | null;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function CompaniesTable({ companies }: CompaniesTableProps) {
  const { mutate: configureCompany, isPending } = useConfigureCompany();
  // track the company/user we intend to deactivate along with the desired
  // account state. camelCase makes the intent clearer and aligns with
  // standard React useState naming conventions.
  const [companyId, setCompanyId] = useState<
    ConfigureCompanyInput["companyId"] | null
  >(null);

  const [userId, setUserId] = useState<ConfigureCompanyInput["userId"] | null>(
    null,
  );

  const [accountState, setAccountState] = useState<
    ConfigureCompanyInput["state"] | null
  >(null);

  return (
    <>
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-6 py-4">
          <h3 className="text-base font-semibold text-foreground">
            All Companies
          </h3>
          <p className="text-xs text-muted-foreground">
            {companies?.length} total &mdash;{" "}
            {companies?.filter((c) => !c.deleted_at).length} active
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Company", "Status", "Users", "Created", ""].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground last:w-10"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {companies?.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-muted-foreground"
                  >
                    No companies found.
                  </td>
                </tr>
              ) : (
                companies?.map((company, i) => {
                  const isActive = company.deleted_at === null;
                  return (
                    <tr
                      key={company.id}
                      className={cn(
                        "transition-colors hover:bg-muted/50",
                        i !== companies.length - 1 && "border-b border-border",
                      )}
                    >
                      {/* Company name */}
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <span className="font-medium text-foreground">
                            {company.name}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-3">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                            isActive
                              ? "bg-success/10 text-success"
                              : "bg-muted text-muted-foreground",
                          )}
                        >
                          {isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* Users */}
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Users className="h-3.5 w-3.5" />
                          <span>{company.user_count}</span>
                        </div>
                      </td>

                      {/* Created */}
                      <td className="px-6 py-3 text-muted-foreground">
                        {formatDate(company.created_at)}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        {isActive ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                disabled={isPending}
                                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                {isPending ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <MoreHorizontal className="h-4 w-4" />
                                )}
                                <span className="sr-only">Actions</span>
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => {
                                  setCompanyId(company.id);
                                  setUserId(company.auth_id);
                                  setAccountState(true); // deletes the company and disables the user account
                                }}
                              >
                                <Trash2 className="mr-2 h-3.5 w-3.5" />
                                Deactivate
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                disabled={isPending}
                                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                {isPending ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <MoreHorizontal className="h-4 w-4" />
                                )}
                                <span className="sr-only">Actions</span>
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                className="text-success focus:text-success"
                                onClick={() => {
                                  configureCompany({
                                    companyId: company.id,
                                    userId: company.auth_id,
                                    state: false, // enables the company and re-enables the user account
                                  });
                                }}
                              >
                                <RotateCcw className="mr-2 h-3.5 w-3.5" />
                                Enable
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deactivate confirmation */}
      <AlertDialog
        open={accountState === true}
        onOpenChange={(open) =>
          !open && (setCompanyId(null), setAccountState(null))
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate company?</AlertDialogTitle>
            <AlertDialogDescription>
              This will deactivate the company and all associated user/va
              accounts. Are you sure you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={() => {
                if (companyId) {
                  configureCompany({
                    companyId,
                    userId,
                    state: accountState,
                  });
                  setCompanyId(null);
                  setUserId(null);
                  setAccountState(null);
                }
              }}
            >
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
