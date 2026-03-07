import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/database.types";

type FeedbackUpdate =
  Database["public"]["Tables"]["feedback_reports"]["Update"] & { id: string };
type FeedbackRow = Database["public"]["Tables"]["feedback_reports"]["Row"];

const updateFeedback = async (data: FeedbackUpdate) => {
  const { id, ...updateData } = data;
  const { data: result, error } = await supabase
    .from("feedback_reports")
    .update(updateData)
    .eq("id", id)
    .select();

  if (error) {
    throw new Error(error.message || "Failed to update feedback");
  }

  if (result.length === 0) {
    throw new Error("Failed to update: no rows returned or permission denied");
  }

  return result[0] as FeedbackRow;
};

export function useUpdateFeedback() {
  const queryClient = useQueryClient();

  return useMutation<FeedbackRow, Error, FeedbackUpdate>({
    mutationFn: updateFeedback,
    onSuccess: async (result) => {
      void result;
      toast.success("Feedback updated successfully");
      await queryClient.invalidateQueries({
        queryKey: ["feedbacks"],
        exact: false,
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update feedback");
    },
  });
}
