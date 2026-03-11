import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-32 bg-background">
      {/* Subtle grid pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.08] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      {/* Radial glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-200 w-200 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 opacity-50 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-4xl px-6 text-center">
        {/* Eyebrow */}
        <div className="animate-fade-up mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5">
          <span className="h-2 w-2 shrink-0 rounded-full bg-primary animate-pulse-glow" />
          <span className="text-xs font-semibold uppercase tracking-[0.04em] text-muted-foreground">
            Built for chimney, HVAC and dryer vent businesses
          </span>
        </div>

        {/* Headline */}
        <h1 className="animate-fade-up-delay-1 mb-7 text-[clamp(2.8rem,6vw,5rem)] font-extrabold leading-[1.08] tracking-[-0.04em] text-foreground">
          Stop guessing.
          <br />
          <em className="not-italic text-primary">Start knowing</em>
          <br />
          your numbers.
        </h1>

        {/* Subheadline */}
        <p className="animate-fade-up-delay-2 mx-auto mb-12 max-w-145 text-lg font-light leading-[1.7] text-muted-foreground">
          Klicktiv turns scattered spreadsheets into one live financial
          operating system for chimney, HVAC, and dryer vent companies. From
          commissions to profitability, your team sees the right numbers at the
          right time.
        </p>

        {/* CTAs */}
        <div className="animate-fade-up-delay-3 flex flex-wrap items-center justify-center gap-3.5">
          <Link
            href="https://advancedvirtualstaff.com/booking"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3.75 text-[0.95rem] font-semibold text-primary-foreground shadow-[0_4px_20px_rgba(232,68,10,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(232,68,10,0.4)]"
          >
            Book a Free Consultation
          </Link>
          <Link
            href="#features"
            className="inline-flex items-center gap-2 rounded-lg border-[1.5px] border-border bg-transparent px-8 py-3.75 text-[0.95rem] font-semibold text-foreground transition-all hover:border-accent-foreground/80 hover:bg-foreground/4"
          >
            See What We Build <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Tags */}
        <div className="animate-fade-up-delay-4 mt-12 flex flex-wrap items-center justify-center gap-2.5">
          {[
            "Commission splits automated",
            "No spreadsheets",
            "Custom-built for you",
            "Live revenue dashboards",
          ].map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1.5 rounded-md border border-border bg-card px-3.5 py-1.5 text-[0.82rem] font-medium text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-foreground/20 hover:bg-muted/50 hover:text-accent-foreground/80"
            >
              <Check className="h-3 w-3" />
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
