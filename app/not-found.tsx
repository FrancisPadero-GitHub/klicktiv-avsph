"use client";
import { FileQuestion, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white px-4 text-center dark:bg-zinc-950">
      {/* Icon */}
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
        <FileQuestion className="h-7 w-7 text-zinc-400 dark:text-zinc-500" />
      </div>

      {/* 404 label */}
      <span className="text-7xl font-bold tabular-nums text-zinc-200 dark:text-zinc-800">
        404
      </span>

      {/* Text */}
      <div className="-mt-2 space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Page not found
        </h1>
        <p className="max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>

      {/* Action */}
      <Button
        type="button"
        className="gap-2"
        onClick={() =>
          window.history.length > 1
            ? window.history.back()
            : window.location.assign("/dashboard")
        }
      >
        <ArrowLeft className="h-4 w-4" />
        Go back
      </Button>
    </div>
  );
}
