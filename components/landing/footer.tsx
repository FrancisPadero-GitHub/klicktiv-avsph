import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="animate-fade-up flex flex-col items-center justify-between gap-4 border-t border-border bg-background px-12 py-12 text-center sm:flex-row sm:flex-wrap sm:text-left">
      <div className="text-lg font-bold tracking-tight text-foreground">
        Klick<span className="text-primary">tiv</span>
      </div>
      <p className="text-sm text-muted-foreground">
        Financial clarity for home service businesses.
      </p>
      <div className="flex gap-6">
        {[
          { label: "Privacy Policy", href: "#" },
          { label: "Terms of Service", href: "#" },
          {
            label: "Contact",
            href: "https://advancedvirtualstaff.com/booking",
          },
        ].map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            className="text-sm text-muted-foreground transition-colors hover:text-accent-foreground/80"
          >
            {label}
          </Link>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        &copy; {year} Klicktiv. All rights reserved.
      </p>
    </footer>
  );
}
