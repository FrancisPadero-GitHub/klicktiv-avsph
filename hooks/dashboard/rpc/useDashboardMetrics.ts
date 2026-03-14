import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/database.types";

export type MetricsParams =
  Database["public"]["Functions"]["dashboard_metrics"]["Args"];

export type DashboardMetrics =
  Database["public"]["Functions"]["dashboard_metrics"]["Returns"][number];

const fetchDashboardMetrics = async (
  params: MetricsParams,
): Promise<DashboardMetrics | null> => {
  const { data, error } = await supabase.rpc("dashboard_metrics", params);

  if (error) {
    throw new Error(error.message);
  }

  // Supabase returns an array for "returns table" RPCs. We just need the first row.
  return data?.[0] || null;
};

export const useDashboardMetrics = (params: MetricsParams) => {
  return useQuery({
    // Automatically refetch when any of these parameters change
    queryKey: ["dashboard-metrics", params],
    queryFn: () => fetchDashboardMetrics(params),
    // Prevent the query from running if we don't have a company_id yet
    enabled: Boolean(params.p_company_id),
    // Optional: Keep data fresh for 1 minute before refetching in the background
    staleTime: 1000 * 60,
  });
};
