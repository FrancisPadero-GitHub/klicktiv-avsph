import { BarChart3, Hourglass, Banknote, Search } from "lucide-react";

const painPoints = [
  {
    icon: BarChart3,
    title: "Spreadsheet overload",
    description:
      "Three tabs for commissions, two for payroll, one for jobs - and none of them agree with each other.",
  },
  {
    icon: Hourglass,
    title: "Hours lost every week",
    description:
      "You're manually reconciling job data, calculating splits, and chasing down numbers instead of running your business.",
  },
  {
    icon: Banknote,
    title: "Commission disputes",
    description:
      "Your techs don't trust the math. Neither do your subcontractors. And you're not sure who's right.",
  },
  {
    icon: Search,
    title: "No real-time visibility",
    description:
      "You find out how last month went when you close the books - not when you still have time to do something about it.",
  },
];

export default function PainSection() {
  return (
    <section id="pain" className="bg-foreground py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="animate-fade-up mb-14">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-primary">
            Sound familiar?
          </p>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.15] tracking-[-0.03em] text-background">
            Your finances are running
            <br />
            on faith and formulas.
          </h2>
          <p className="mt-4 max-w-130 text-[1.05rem] leading-[1.7] text-background/50">
            Most home service owners don&apos;t have a money problem. They have
            a visibility problem. Here&apos;s what that looks like.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border-2 border-background/8 bg-background/6 sm:grid-cols-2 lg:grid-cols-4">
          {painPoints.map(({ icon: Icon, title, description }, i) => (
            <div
              key={title}
              className={`animate-fade-up bg-foreground p-9 transition-colors hover:bg-primary/8 ${
                i === 0
                  ? "animate-fade-up-delay-1"
                  : i === 1
                    ? "animate-fade-up-delay-2"
                    : i === 2
                      ? "animate-fade-up-delay-3"
                      : "animate-fade-up-delay-4"
              }`}
            >
              <div className="mb-4 h-8 w-8 text-background">
                <Icon className="h-full w-full" />
              </div>
              <h3 className="mb-2 text-[1.05rem] font-bold text-background">
                {title}
              </h3>
              <p className="text-[0.9rem] leading-[1.6] text-background/45">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
