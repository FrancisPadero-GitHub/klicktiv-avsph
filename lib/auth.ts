import { supabase } from "@/lib/supabase";
import type { LoginFormValues, SignUpFormValues } from "@/types/auth";

/**
 * Sign in with email & password.
 * Returns the Supabase session data.
 */
export async function loginWithEmail({ email, password }: LoginFormValues) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

/**
 * Create a new account with email, password & metadata.
 * Returns the Supabase session data.
 */
export async function signUpWithEmail({
  email,
  password,
  fullName,
}: Omit<SignUpFormValues, "confirmPassword">) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
  if (error) throw error;
  return data;
}

/**
 * Sign out the current user.
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut({ scope: "local" });
  if (error) throw error;
}

/**
 * Retrieve the current session (null when unauthenticated).
 */
export async function getCurrentSession() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
}

/**
 * Retrieve the currently authenticated user (null when unauthenticated).
 */
export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}
