import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section id="cta" className="bg-foreground py-[120px] text-center">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="animate-fade-up mx-auto max-w-[700px] text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.15] tracking-[-0.03em] text-background">
          Ready to see exactly
          <br />
          where your money is?
        </h2>
        <p className="animate-fade-up-delay-1 mx-auto mt-4 max-w-[480px] text-[1.05rem] leading-[1.7] text-background/50">
          Book a free 30-minute consultation. Tell us what&apos;s slowing you
          down - we&apos;ll show you what your business could look like with
          Klicktiv.
        </p>
        <div className="animate-fade-up-delay-2 mt-12 flex flex-wrap items-center justify-center gap-3.5">
          <Link
            href="https://advancedvirtualstaff.com/booking"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-[15px] text-[0.95rem] font-semibold text-primary-foreground shadow-[0_4px_20px_rgba(232,68,10,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(232,68,10,0.4)]"
          >
            Book a Free Consultation
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="#features"
            className="inline-flex items-center gap-2 rounded-lg border-[1.5px] border-background/20 px-8 py-[15px] text-[0.95rem] font-semibold text-background transition-all hover:bg-background/10"
          >
            See All Features →
          </Link>
        </div>
      </div>
    </section>
  );
}
