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
    <Section id="journey" eyebrow="My Path" title="My Journey" subtitle="Six years of building, learning, and shipping.">
      <div className="relative mx-auto max-w-3xl">
        <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-transparent via-primary/50 to-transparent md:left-1/2" />
        <div className="space-y-10">
          {journey.map((item, i) => {
            const Icon = iconFor(item.type);
            const left = i % 2 === 0;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: left ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55 }}
                className={`relative flex items-start gap-6 md:grid md:grid-cols-2 md:gap-10 ${
                  left ? "" : "md:[&>*:first-child]:col-start-2"
                }`}
              >
                <div
                  className={`relative pl-12 md:pl-0 ${
                    left ? "md:pr-10 md:text-right" : "md:pl-10"
                  }`}
                >
                  <span
                    className={`absolute left-0 top-1 grid h-8 w-8 place-items-center rounded-full border border-primary/60 bg-background text-primary neon-glow md:left-auto ${
                      left ? "md:-right-4" : "md:-left-4"
                    }`}
                  >
                    <Icon size={14} />
                  </span>
                  <div className="glass-card p-5">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="rounded-full bg-primary/15 px-2.5 py-0.5 font-semibold uppercase tracking-wider text-primary">
                        {item.type}
                      </span>
                      <span className="text-muted-foreground">{item.period}</span>
                    </div>
                    <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
                    <p className="text-sm text-primary/80">{item.org}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
