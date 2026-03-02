import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/components/auth-provider";
import { supabase } from "@/lib/supabase";
//  (( SELECT auth.uid() AS uid) = id)
type CreateRole = "user" | "admin";

export type CreateUserInput = {
  email: string;
  password: string;
  role?: CreateRole; // default: "user"
  f_name: string;
  l_name: string;
  username?: string;
  avatar_url?: string;
  website?: string;
};

type CreateUserResponse = {
  data?: {
    user?: {
      id?: string;
    };
    [key: string]: unknown;
  };
  user?: {
    id?: string;
  };
  error?: string;
  message?: string;
};

export function useCreateUser() {
  const { session } = useAuth();

  return useMutation({
    mutationFn: async ({
      email,
      password,
      role = "user",
      f_name,
      l_name,
      username,
      avatar_url,
      website,
    }: CreateUserInput) => {
      const accessToken = session?.access_token;
      if (!accessToken) {
        throw new Error("Admin is not authenticated");
      }

      const profileRole = role === "admin" ? "admin" : "user";
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

      if (!supabaseUrl) {
        throw new Error("NEXT_PUBLIC_SUPABASE_URL is not configured");
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/create_users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const text = await response.text();
      let json: CreateUserResponse = {};

      if (text) {
        try {
          json = JSON.parse(text) as CreateUserResponse;
        } catch {
          json = {};
        }
      }

      if (!response.ok) {
        throw new Error(
          json?.error ||
            json?.message ||
            `Failed to create user (${response.status})`,
        );
      }

      const newUserId = json?.data?.user?.id ?? json?.user?.id;
      if (!newUserId) {
        throw new Error("Failed to get new user UID from Edge Function");
      }

      const { error: profileError } = await supabase.from("profiles").upsert(
        {
          id: newUserId,
          role: profileRole,
          email: email,
          f_name,
          l_name,
          username: username?.trim() || null,
          avatar_url: avatar_url?.trim() || null,
          website: website?.trim() || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" },
      );

      if (profileError) {
        throw new Error(profileError.message || "Failed to insert profile");
      }

      return {
        ...json.data,
        profile_id: newUserId,
        created_role: role,
      };
    },
    onSuccess: () => {
      console.log("User created successfully:");
    },
    onError: (error) => {
      console.error(
        "Error creating user:",
        error instanceof Error ? error.message : error,
      );
    },
  });
}
