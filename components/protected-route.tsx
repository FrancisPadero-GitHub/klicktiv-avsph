"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import Loading from "@/app/loading";

type ProtectedRouteProps = {
  children: ReactNode;
  /** Where to redirect unauthenticated users (default: /auth/login) */
  redirectTo?: string;
};

/**
 * Wrapper that gates its children behind authentication.
 *
 * While the session is being resolved it renders a centered spinner.
 * Once resolved, unauthenticated users are redirected to `redirectTo`.
 */
export function ProtectedRoute({
  children,
  redirectTo = "/auth/login",
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace(redirectTo);
    }
  }, [isLoading, user, router, redirectTo]);

  if (isLoading || !user) {
    return <Loading />;
  }

  return children;
}
