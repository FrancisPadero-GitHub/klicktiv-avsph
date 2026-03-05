import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/components/auth-provider";
import { supabase } from "@/lib/supabase";

const dbBulkSoftDeleteEstimates = async (
  workOrderIds: string[],
  companyId: string,
) => {
  const now = new Date().toISOString();

  const { error: estimateError } = await supabase
    .from("estimates")
    .update({ deleted_at: now })
    .in("work_order_id", workOrderIds)
    .eq("company_id", companyId);

  if (estimateError) {
    throw new Error(estimateError.message || "Failed to delete estimates");
  }

  const { error: jobError } = await supabase
    .from("jobs")
    .update({ deleted_at: now })
    .in("work_order_id", workOrderIds)
    .eq("company_id", companyId);

  if (jobError) {
    throw new Error(jobError.message || "Failed to delete related jobs");
  }

  const { error: woError } = await supabase
    .from("work_orders")
    .update({ deleted_at: now })
    .in("id", workOrderIds)
    .eq("company_id", companyId);

  if (woError) {
    throw new Error(woError.message || "Failed to delete work orders");
  }
};

export function useBulkDelEstimates() {
  const queryClient = useQueryClient();
  const { session } = useAuth();

  return useMutation({
    mutationFn: async (workOrderIds: string[]) => {
      const companyId = session?.user.app_metadata.company_id as
        | string
        | undefined;

      if (!companyId) {
        throw new Error("Company ID is missing from user session");
      }

      return dbBulkSoftDeleteEstimates(workOrderIds, companyId);
    },
    onSuccess: async () => {
      toast.success("Estimates deleted successfully");
      await queryClient.invalidateQueries({
        queryKey: ["estimates"],
        exact: false,
      });
      await queryClient.invalidateQueries({
        queryKey: ["jobs", "work-orders"],
        exact: false,
      });
      await queryClient.invalidateQueries({
        queryKey: ["jobs"],
        exact: false,
      });
      await queryClient.invalidateQueries({
        queryKey: ["job-monthly-financial-summary"],
        exact: false,
      });
      await queryClient.invalidateQueries({
        queryKey: ["technicians"],
        exact: false,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete estimates");
    },
  });
}
