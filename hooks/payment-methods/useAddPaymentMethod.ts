import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/components/auth-provider";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/database.types";
import { toast } from "sonner";

type PaymentMethodInsert =
  Database["public"]["Tables"]["payment_methods"]["Insert"];

const dbAddPaymentMethod = async (method: PaymentMethodInsert) => {
  const { data, error } = await supabase
    .from("payment_methods")
    .insert([method])
    .select()
    .single();

  if (error) {
    throw new Error(error.message || "Failed to add payment method");
  }

  return data;
};

export function useAddPaymentMethod() {
  const queryClient = useQueryClient();
  const { session } = useAuth();

  return useMutation({
    mutationFn: async (method: PaymentMethodInsert) => {
      const companyId = session?.user?.app_metadata?.company_id as
        | string
        | undefined;

      if (!companyId) {
        throw new Error("Company ID is missing from user session");
      }

      return dbAddPaymentMethod({
        ...method,
        company_id: companyId,
      });
    },
    onSuccess: async (result) => {
      toast.success(`Payment method "${result.name}" added successfully`);
      await queryClient.invalidateQueries({
        queryKey: ["payment-methods"],
      });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to add payment method",
      );
    },
  });
}
