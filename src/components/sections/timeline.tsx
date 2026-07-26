import { motion } from "motion/react";
import { GraduationCap, Briefcase, Award, Rocket } from "lucide-react";
import { Section } from "@/components/ui/section";
import { journey } from "@/data/portfolio";

const iconFor = (t: string) => {
  if (t === "Education") return GraduationCap;
  if (t === "Achievement") return Award;
  if (t === "Internship") return Rocket;
  return Briefcase;
};

export function Timeline() {
  return (
    <Section
      id="journey"
      eyebrow="My Path"
      title="My Journey"
      subtitle="Six years of building, learning, and shipping."
    >
      <div className="relative mx-auto max-w-5xl">
        {/* Center / left rail */}
        <div className="pointer-events-none absolute left-4 top-0 h-full w-px bg-gradient-to-b from-transparent via-primary/50 to-transparent md:left-1/2 md:-translate-x-1/2" />

        <ol className="space-y-8 md:space-y-14">
          {journey.map((item, i) => {
            const Icon = iconFor(item.type);
            const left = i % 2 === 0;
            return (
              <li key={item.title} className="group relative">
                <div className="md:grid md:grid-cols-2 md:items-center md:gap-12">
                  {/* Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className={`relative pl-12 md:pl-0 ${
                      left
                        ? "md:col-start-1 md:pr-10 md:text-right"
                        : "md:col-start-2 md:pl-10"
                    }`}
                  >
                    <div className="glass-card p-5 transition-all hover:-translate-y-0.5 hover:neon-glow sm:p-6">
                      <div
                        className={`flex flex-wrap items-center gap-2 text-xs ${
                          left ? "md:justify-end" : ""
                        }`}
                      >
                        <span className="rounded-full bg-primary/15 px-2.5 py-0.5 font-semibold uppercase tracking-wider text-primary">
                          {item.type}
                        </span>
                        <span className="text-muted-foreground">{item.period}</span>
                      </div>
                      <h3 className="mt-2 text-lg font-semibold sm:text-xl">{item.title}</h3>
                      <p className="text-sm text-primary/80">{item.org}</p>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>

                  {/* Dot on rail */}
                  <span
                    aria-hidden
                    className="absolute left-0 top-6 grid h-9 w-9 -translate-x-0 place-items-center rounded-full border border-primary/60 bg-transparent text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-background group-hover:neon-glow md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2"
                  >
                    <Icon size={15} />
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
