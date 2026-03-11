import type { User, Session } from "@supabase/supabase-js";

export type LoginFormValues = {
  email: string;
  password: string;
};

export type SignUpFormValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

// Auth Context Types
export type AuthState = {
  user: User | null;
  role: string | null;
  session: Session | null;
  company_id: string | null;
  isAuthenticated: boolean | null;
  isLoading: boolean;
};

export type AuthContextValue = AuthState & {
  signOut: () => Promise<void>;
};
