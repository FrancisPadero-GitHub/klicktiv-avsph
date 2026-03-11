import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import Image from "next/image";

// Components
import { MobileMenu } from "./navbar-components/mobile-menu";

export default function Navbar() {
  return (
    <header className="animate-fade-in fixed top-0 left-0 right-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center hover:scale-[1.02]"
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

        {/* Desktop nav - centered */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="#features"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-accent-foreground/80 hover:scale-[1.02]"
          >
            Features
          </Link>
          <Link
            href="#how"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-accent-foreground/80 hover:scale-[1.02]"
          >
            How It Works
          </Link>
          <Link
            href="#who"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-accent-foreground/80 hover:scale-[1.02]"
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
              className="rounded-lg px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-foreground/15 hover:scale-[1.02]"
            >
              Log In
            </Link>
            <Link
              href="https://advancedvirtualstaff.com/booking"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 hover:scale-[1.02]"
            >
              Book a Demo
            </Link>
          </div>
          <ModeToggle />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
