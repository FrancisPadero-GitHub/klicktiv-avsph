import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/components/auth-provider";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/database.types";
import { toast } from "sonner";

type ReviewTypeInsert = Database["public"]["Tables"]["review_types"]["Insert"];

const dbAddReviewType = async (type: ReviewTypeInsert) => {
  const { data, error } = await supabase
    .from("review_types")
    .insert([type])
    .select()
    .single();

  if (error) {
    throw new Error(error.message || "Failed to add review type");
  }

  return data;
};

export function useAddReviewType() {
  const queryClient = useQueryClient();
  const { session } = useAuth();

  return useMutation({
    mutationFn: async (type: ReviewTypeInsert) => {
      const companyId = session?.user?.app_metadata?.company_id as
        | string
        | undefined;

      if (!companyId) {
        throw new Error("Company ID is missing from user session");
      }

      return dbAddReviewType({
        ...type,
        company_id: companyId,
      });
    },
    onSuccess: async (result) => {
      toast.success(`Review type "${result.name}" added successfully`);
      await queryClient.invalidateQueries({
        queryKey: ["review-types"],
      });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to add review type",
      );
    },
  });
}
