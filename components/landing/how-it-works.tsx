const steps = [
  {
    number: "01",
    title: "Tell us what's broken",
    description:
      "Book a consultation and walk us through exactly what's slowing you down. We ask the right questions to map your workflow precisely.",
  },
  {
    number: "02",
    title: "We build your system",
    description:
      "Our team designs and develops a solution around your exact business - not a generic template with your logo slapped on it.",
  },
  {
    number: "03",
    title: "You're live from day one",
    description:
      "We migrate your existing data, configure everything, and walk your team through the platform. You're operational immediately.",
  },
  {
    number: "04",
    title: "We grow with you",
    description:
      "Your business evolves. So does your system. Request changes, new reports, or new features anytime - we ship them fast.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="bg-foreground py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="animate-fade-up mb-16">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.1em] text-primary">
            How It Works
          </p>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.15] tracking-[-0.03em] text-background">
            Operational in days,
            <br />
            not months.
          </h2>
          <p className="mt-4 max-w-[520px] text-[1.05rem] leading-[1.7] text-background/50">
            We handle all the technical work. You just describe your problems -
            we solve them.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ number, title, description }, index) => (
            <div
              key={number}
              className={`animate-fade-up p-10 ${
                index > 0 ? "border-l border-background/[0.07]" : ""
              } ${
                index === 0
                  ? "animate-fade-up-delay-1"
                  : index === 1
                    ? "animate-fade-up-delay-2"
                    : index === 2
                      ? "animate-fade-up-delay-3"
                      : "animate-fade-up-delay-4"
              }`}
            >
              <span className="mb-5 block text-[3.5rem] font-extrabold leading-none text-background/[0.5]">
                {number}
              </span>
              <h3 className="mb-2.5 text-[1.1rem] font-bold text-background">
                {title}
              </h3>
              <p className="text-[0.9rem] leading-[1.65] text-background/45">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
