"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
// hooks
import { useLogin } from "@/hooks/auth/useLogin";
// types
import type { LoginFormValues } from "@/types/auth";
// auth
import { useAuth } from "@/components/auth-provider";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth(); // used to disable the submit button and show "Dashboard" if the user is already authenticated (e.g. from a previous session)
  const { mutate: loginMutation, error: loginError, isPending } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: { email: "", password: "" },
  });
  const [showPassword, setShowPassword] = useState(false);
  function onSubmit(values: LoginFormValues) {
    loginMutation(values);
  }

  const serverError = loginError
    ? loginError instanceof Error
      ? loginError.message
      : "Something went wrong."
    : null;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Content Section - Always dark theme | */}
      <div className="relative hidden w-1/2 flex-col justify-center overflow-hidden border-l border-zinc-800 bg-zinc-950 lg:flex lg:px-12 xl:px-24">
        {/* Subtle grid pattern */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        {/* Radial glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute left-1/2 top-1/2 h-200 w-200 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 opacity-50 blur-[100px]" />
        </div>

        <div className="relative z-10 flex flex-col items-start gap-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-md">
            <span className="h-2 w-2 shrink-0 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-[0.04em] text-zinc-300">
              Built for service businesses
            </span>
          </div>

          <h2 className="text-[clamp(2.5rem,4vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.04em] text-white">
            Stop guessing.
            <br />
            <em className="not-italic text-primary">Start knowing</em>
            <br />
            your numbers.
          </h2>

          <p className="max-w-125 text-lg font-light leading-[1.7] text-zinc-400">
            Klicktiv turns scattered spreadsheets into one live financial
            operating system for chimney, HVAC, and dryer vent companies. From
            commissions to profitability, your team sees the right numbers at
            the right time.
          </p>

          <div className="mt-4 flex flex-col gap-4">
            {[
              "Automated commission splits",
              "Live revenue dashboards",
              "Job and cost tracking",
              "Custom-built for your workflow",
            ].map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-3 text-zinc-300"
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <span className="text-[1rem] font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="animate-fade-in flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-8 lg:py-24">
        <div className="animate-fade-up-delay-1 mx-auto w-full max-w-sm">
          {/* Logo */}
          <div className="mb-5 flex flex-col items-center text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 transition-transform hover:scale-[1.02]"
            >
              <Image
                src="/kt_logo_name.png"
                title="Go to landing page"
                alt="Klicktiv Logo"
                width={90}
                height={40}
                className="w-auto dark:brightness-0 dark:invert teal-dark:brightness-0 teal-dark:invert"
                style={{ width: "auto", height: "auto" }}
                priority
              />
            </Link>
            <h1 className="mt-5 text-2xl font-bold tracking-tight text-foreground">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Log in to your account to continue
            </p>
          </div>

          {/* Form Card */}
          <div className="animate-scale-in rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-md">
            {serverError && (
              <div className="mb-6 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {serverError}
              </div>
            )}

            <form
              onSubmit={(e) => void handleSubmit(onSubmit)(e)}
              noValidate
              className="space-y-5"
            >
              {/* Email */}
              <Field>
                <FieldLabel htmlFor="email">Email address</FieldLabel>
                <FieldContent>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    aria-invalid={true}
                    aria-describedby="email-error"
                    className={cn(
                      "w-full rounded-xl border bg-background px-4 py-3 text-sm text-foreground placeholder-muted-foreground outline-none transition-all",
                      "focus:ring-2 focus:ring-primary/20 focus:border-primary",
                      errors.email
                        ? "border-destructive/50 focus:border-destructive focus:ring-destructive/20"
                        : "border-input",
                    )}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Enter a valid email address",
                      },
                    })}
                  />
                </FieldContent>
                <FieldError errors={[errors.email]} />
              </Field>

              {/* Password */}
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link
                    href="#"
                    className="text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <FieldContent>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      className={cn(
                        "w-full rounded-xl border bg-background px-4 py-3 pr-10 text-sm text-foreground placeholder-muted-foreground outline-none transition-all",
                        "focus:ring-2 focus:ring-primary/20 focus:border-primary",
                        errors.password
                          ? "border-destructive/50 focus:border-destructive focus:ring-destructive/20"
                          : "border-input",
                      )}
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters",
                        },
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FieldContent>
                <FieldError errors={[errors.password]} />
              </Field>

              {/* Submit */}
              <button
                type={isAuthenticated ? "button" : "submit"}
                onClick={
                  isAuthenticated ? () => router.push("/dashboard") : undefined
                }
                disabled={isPending && !isAuthenticated}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(var(--primary),0.3)] disabled:pointer-events-none disabled:opacity-50"
              >
                {isPending && !isAuthenticated ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : isAuthenticated ? (
                  "Dashboard"
                ) : (
                  "Log in"
                )}
              </button>
            </form>
          </div>

          {/* Footer link */}
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="https://advancedvirtualstaff.com/booking"
              className="font-semibold text-foreground underline-offset-4 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
