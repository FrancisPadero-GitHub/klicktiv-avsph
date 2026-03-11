import Image from "next/image";
import Link from "next/link";
import { Phone, Mail } from "lucide-react";

const socials = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=100085714730336",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/advanced-virtual-staff-ph/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "Twitter / X",
    href: "https://x.com/advancedvstaff",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/advancedvirtualstaff/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path
          d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
          fill="var(--background)"
        />
        <line
          x1="17.5"
          y1="6.5"
          x2="17.51"
          y2="6.5"
          stroke="var(--background)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export default function AVSSection() {
  return (
    <section className="bg-background py-10">
      <div className="mx-auto max-w-7xl px-6">
        {/* Label */}
        <p className="animate-fade-up mb-12 text-center text-xs font-bold uppercase tracking-widest text-primary">
          Powered By
        </p>

        {/* Card */}
        <div className="animate-fade-up mx-auto max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
          <div className="flex flex-col items-center gap-8 px-10 py-12 sm:flex-row sm:items-start">
            {/* Logo */}
            <div className="shrink-0">
              <div className="relative h-20 w-20 overflow-hidden rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.12)]">
                <Image
                  src="/avs-logo-blue.jpeg"
                  alt="Advanced Virtual Staff logo"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-5 text-center sm:text-left">
              {/* Name */}
              <div>
                <p className="text-lg font-extrabold uppercase tracking-widest text-foreground">
                  Advanced
                </p>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">
                  Virtual Staff
                </p>
              </div>

              {/* Description */}
              <p className="max-w-sm text-[0.9rem] leading-[1.7] text-muted-foreground">
                Your trusted partner for premium virtual staffing solutions. We
                connect businesses with exceptional talent from our{" "}
                <span className="font-semibold text-primary">top 1% pool.</span>
              </p>

              {/* Social icons */}
              <div className="flex justify-center gap-3 sm:justify-start">
                {socials.map(({ label, href, icon }) => (
                  <Link
                    key={label}
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5 hover:text-accent-foreground/80"
                  >
                    {icon}
                  </Link>
                ))}
              </div>

              {/* Contact */}
              <div className="flex flex-col gap-2">
                <Link
                  href="tel:+17313009692"
                  className="group inline-flex items-center gap-2 text-[0.88rem] text-muted-foreground transition-colors hover:text-accent-foreground/80"
                >
                  <Phone className="h-3.5 w-3.5 shrink-0 text-primary" />
                  +1 731-300-9692
                </Link>
                <Link
                  href="mailto:admin@advancedvirtualstaff.com"
                  className="group inline-flex items-center gap-2 text-[0.88rem] text-muted-foreground transition-colors hover:text-accent-foreground/80"
                >
                  <Mail className="h-3.5 w-3.5 shrink-0 text-primary" />
                  admin@advancedvirtualstaff.com
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
