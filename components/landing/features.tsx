import {
  ClipboardList,
  Zap,
  TrendingUp,
  FileText,
  Users,
  Wrench,
} from "lucide-react";

const features = [
  {
    icon: ClipboardList,
    title: "Job and Cost Tracking",
    description:
      "Every job captured from start to finish. Scheduling, assignments, material costs, labor, and payment collection in one clean view. Nothing falls through the cracks.",
  },
  {
    icon: Zap,
    title: "Automated Commission Splits",
    description:
      "Define your rules once. Commissions, payroll breakdowns, and tech payouts are calculated automatically the moment a job closes. No manual math, no disputes.",
  },
  {
    icon: TrendingUp,
    title: "Live Revenue Dashboards",
    description:
      "See your revenue, expenses, and margins update in real time - not at month-end. Know exactly where your business stands at any hour of any day.",
  },
  {
    icon: FileText,
    title: "Estimates and Proposal Tracking",
    description:
      "Track every pending proposal, manage approvals, and convert estimates to active jobs in one click. Stop letting quotes fall through the cracks.",
  },
  {
    icon: Users,
    title: "Team and Subcontractor Management",
    description:
      "Individual profiles, pay rates, job histories, and performance metrics for every technician and partner on your roster.",
  },
  {
    icon: Wrench,
    title: "Built to Change With You",
    description:
      "Need a new report? A different workflow? An extra field? Just ask. We build and ship new features as your business grows - no waiting on a product roadmap.",
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="animate-fade-up mb-16 max-w-170">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-primary">
            What we build for you
          </p>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.15] tracking-[-0.03em] text-foreground">
            Every tool your finances actually need.
          </h2>
          <p className="mt-4 max-w-130 text-[1.05rem] leading-[1.7] text-muted-foreground">
            No bloated software subscriptions. No features you&apos;ll never
            use. Every system is custom-built around your exact workflow.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }, index) => (
            <div
              key={title}
              className={`animate-fade-up relative overflow-hidden rounded-xl border border-border bg-card p-9 transition-all before:absolute before:inset-x-0 before:top-0 before:h-0.75 before:bg-[linear-gradient(90deg,var(--primary),transparent)] before:opacity-0 before:transition-opacity hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] hover:before:opacity-100 ${
                index === 0 || index === 3
                  ? "animate-fade-up-delay-1"
                  : index === 1 || index === 4
                    ? "animate-fade-up-delay-2"
                    : "animate-fade-up-delay-3"
              }`}
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-[10px] bg-primary/8">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mb-2.5 text-[1.1rem] font-bold text-foreground">
                {title}
              </h3>
              <p className="text-[0.92rem] leading-[1.65] text-muted-foreground">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
