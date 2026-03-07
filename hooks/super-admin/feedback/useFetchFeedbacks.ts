import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/database.types";

export type FeedbacksRow =
  Database["public"]["Tables"]["feedback_reports"]["Row"];

export const fetchFeedbacks = async (): Promise<FeedbacksRow[]> => {
  const { data: result, error } = await supabase
    .from("feedback_reports")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "Failed to fetch feedbacks");
  }

  return result as FeedbacksRow[];
};

export function useFetchFeedbacks() {
  return useQuery<FeedbacksRow[], Error>({
    queryKey: ["feedbacks"],
    queryFn: fetchFeedbacks,
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });
}
