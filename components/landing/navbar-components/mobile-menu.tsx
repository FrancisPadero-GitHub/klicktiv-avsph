"use client";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {/* Mobile hamburger */}
      <button
        onClick={() => setOpen(!open)}
        className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary md:hidden"
        aria-label="Toggle menu"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      {/* Mobile menu */}
      <div
        className={cn(
          "border-t border-border bg-background md:hidden",
          open ? "block" : "hidden",
        )}
      >
        <div className="flex flex-col gap-1 px-6 py-4">
          <Link
            href="#features"
            onClick={() => setOpen(false)}
            className="rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary hover:text-accent-foreground/80"
          >
            Features
          </Link>
          <Link
            href="#how"
            onClick={() => setOpen(false)}
            className="rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary hover:text-accent-foreground/80"
          >
            How It Works
          </Link>
          <Link
            href="#who"
            onClick={() => setOpen(false)}
            className="rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary hover:text-accent-foreground/80"
          >
            Who It&apos;s For
          </Link>
          <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
            <Link
              href="/auth/login"
              onClick={() => setOpen(false)}
              className="rounded-lg px-4 py-2 text-center text-sm font-medium text-foreground ring-1 ring-border hover:bg-muted"
            >
              Log In
            </Link>
            <Link
              href="https://advancedvirtualstaff.com/booking"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="rounded-lg bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground transition-all hover:opacity-90"
            >
              Book a Demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
