import { motion } from "motion/react";
import { Section } from "@/components/ui/section";
import { recognitions } from "@/data/portfolio";

export function Recognition() {
  return (
   <Section
  id="recognition"
  eyebrow="06 — Achievements"
  title="Achievements & Recognition"
  subtitle="A collection of hackathons, competitions, academic achievements, certifications, and professional milestones throughout my learning journey."
>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {recognitions.map((r, i) => (
          <motion.article
            key={r.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
            className="group relative flex h-full flex-col rounded-2xl border border-primary/15 bg-card/50 p-6 backdrop-blur transition-all hover:-translate-y-1 hover:border-primary/40 hover:neon-glow"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-primary">
                {r.tag}
              </span>
              {r.status && (
                <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[10px] font-medium text-primary">
                  {r.status}
                </span>
              )}
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
              {r.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {r.description}
            </p>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
