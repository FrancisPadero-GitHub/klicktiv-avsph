const stats = [
  {
    value: "100%",
    label: "Custom-built for your business, not a one-size-fits-all template",
  },
  {
    value: "0",
    label: "Spreadsheets needed once you're on Klicktiv",
  },
  {
    value: "24/7",
    label: "Live dashboards that update the moment your data changes",
  },
  {
    value: "∞",
    label: "Feature requests - we build what you need, when you need it",
  },
];

export default function Stats() {
  return (
    <section id="stats" className="bg-primary py-20 text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-12 lg:grid-cols-4">
          {stats.map(({ value, label }, index) => (
            <div
              key={value}
              className={`animate-fade-up text-center ${
                index === 0
                  ? "animate-fade-up-delay-1"
                  : index === 1
                    ? "animate-fade-up-delay-2"
                    : index === 2
                      ? "animate-fade-up-delay-3"
                      : "animate-fade-up-delay-4"
              }`}
            >
              <span className="mb-2 block text-[clamp(2rem,5vw,3.2rem)] font-extrabold leading-none">
                {value}
              </span>
              <p className="text-sm opacity-80">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
