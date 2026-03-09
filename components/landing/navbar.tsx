"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";
import Image from "next/image";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="animate-fade-in fixed top-0 left-0 right-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/kt_logo_name.png"
            title="Go to Klicktiv"
            alt="Klicktiv Logo"
            width={160}
            height={48}
            className="h-12 w-auto dark:brightness-0 dark:invert teal-dark:brightness-0 teal-dark:invert"
            priority
          />
        </Link>

        {/* Desktop nav - centered */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="#features"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-accent-foreground/80"
          >
            Features
          </Link>
          <Link
            href="#how"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-accent-foreground/80"
          >
            How It Works
          </Link>
          <Link
            href="#who"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-accent-foreground/80"
          >
            Who It&apos;s For
          </Link>
        </nav>

        {/* Right side: CTA (desktop) + theme toggle + hamburger (mobile) */}
        <div className="flex items-center gap-2">
          {/* Desktop-only CTAs */}
          <div className="hidden items-center gap-2 md:flex">
            <Link
              href="/auth/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-foreground/15"
            >
              Log In
            </Link>
            <Link
              href="https://advancedvirtualstaff.com/booking"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:opacity-90"
            >
              Book a Demo
            </Link>
          </div>

          <ModeToggle />

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

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
    </header>
  );
}
