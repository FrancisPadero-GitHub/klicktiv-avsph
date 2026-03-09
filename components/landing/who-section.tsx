import { Check } from "lucide-react";

const whoItems = [
  {
    title: "Chimney Service Companies",
    description:
      "Track sweep jobs, liner installations, and repair revenue with full commission breakdowns for every tech on every job.",
  },
  {
    title: "HVAC Businesses",
    description:
      "Manage seasonal volume, maintenance contracts, and install jobs with a financial view that scales with your call volume.",
  },
  {
    title: "Dryer Vent Service Operators",
    description:
      "Simple jobs, high volume. Automate your payouts and see your daily revenue without opening a single spreadsheet.",
  },
  {
    title: "Multi-Tech & Subcontractor Teams",
    description:
      "Running a mix of employees and subs? Klicktiv handles different pay structures, rates, and splits - all automatically.",
  },
];

const dashboardPreview = [
  { label: "Revenue This Week", value: "$14,820", badge: "↑ 18%", warn: false },
  { label: "Jobs Completed", value: "37", badge: "On Track", warn: false },
  { label: "Commissions Owed", value: "$3,260", badge: "Pending", warn: true },
  { label: "Net Margin", value: "62.4%", badge: "↑ 4pts", warn: false },
];

export default function WhoSection() {
  return (
    <section id="who" className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="animate-fade-up mb-12">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-primary">
            Who It&apos;s For
          </p>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.15] tracking-[-0.03em] text-foreground">
            Built specifically for
            <br />
            home service operators.
          </h2>
          <p className="mt-4 max-w-130 text-[1.05rem] leading-[1.7] text-muted-foreground">
            If you&apos;re running a field team and tracking money in
            spreadsheets, Klicktiv was built for you.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Who list */}
          <div className="flex flex-col gap-5">
            {whoItems.map(({ title, description }, index) => (
              <div
                key={title}
                className={`animate-fade-up flex items-start gap-4 rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/50 ${
                  index === 0
                    ? "animate-fade-up-delay-1"
                    : index === 1
                      ? "animate-fade-up-delay-2"
                      : index === 2
                        ? "animate-fade-up-delay-3"
                        : "animate-fade-up-delay-4"
                }`}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1a7a4a]/10 text-[#1a7a4a]">
                  <Check className="h-4 w-4 stroke-[3]" />
                </div>
                <div>
                  <h4 className="mb-1 text-[0.95rem] font-bold text-foreground">
                    {title}
                  </h4>
                  <p className="text-[0.87rem] leading-normal text-muted-foreground">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Dashboard preview */}
          <div className="animate-scale-in hidden rounded-2xl bg-foreground p-10 lg:flex lg:flex-col lg:gap-5">
            <p className="mb-2 text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-background/35">
              Live Dashboard Preview
            </p>
            {dashboardPreview.map(({ label, value, badge, warn }) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-xl bg-background/6 px-6 py-5"
              >
                <div>
                  <p className="text-[0.82rem] font-medium text-background/40">
                    {label}
                  </p>
                  <p className="text-[1.4rem] font-extrabold text-background">
                    {value}
                  </p>
                </div>
                <span
                  className={`rounded px-2 py-0.5 text-[0.7rem] font-bold text-white ${
                    warn ? "bg-primary" : "bg-[#1a7a4a]"
                  }`}
                >
                  {badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
