import { useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/components/auth-provider";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/database.types";

export type NotificationsRow =
  Database["public"]["Tables"]["notifications"]["Row"];

export const fetchNotifications = async (
  companyId: string,
  userId: string,
): Promise<NotificationsRow[]> => {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("company_id", companyId)
    .eq("user_id", userId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message || "Failed to fetch notifications");

  return data as NotificationsRow[];
};

export function useFetchNotifications() {
  const { session } = useAuth();
  const companyId = session?.user.app_metadata.company_id as string | undefined;
  const userId = session?.user.id;
  const queryClient = useQueryClient();
  const queryKey = useMemo(
    () => ["notifications", companyId ?? null, userId ?? null] as const,
    [companyId, userId],
  );

  const query = useQuery<NotificationsRow[], Error>({
    queryKey,
    queryFn: () => {
      if (!companyId || !userId) {
        throw new Error("Company ID or user ID is missing from user session");
      }

      return fetchNotifications(companyId, userId);
    },
    enabled: Boolean(companyId && userId),
  });

  useEffect(() => {
    if (!companyId || !userId) return;

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          void queryClient.invalidateQueries({ queryKey });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel).catch((err) => {
        console.error("Error removing channel:", err);
      });
    };
  }, [companyId, userId, queryClient, queryKey]);

  return query;
}
