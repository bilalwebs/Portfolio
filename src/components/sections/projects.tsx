import { motion } from "motion/react";
import { Github, ExternalLink } from "lucide-react";
import { Section } from "@/components/ui/section";
import { projects } from "@/data/portfolio";

export function Projects() {
  return (
    <Section
      id="projects"
      eyebrow="Selected Work"
      title="My Projects"
      subtitle="A few things I've built recently — from realtime dashboards to full commerce stacks."
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {projects.map((p, i) => (
          <motion.article
            key={p.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: i * 0.08 }}
            className="group glass-card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:neon-glow"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src={p.image}
                alt={p.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent opacity-70" />
              <div className="absolute inset-0 flex items-end justify-end gap-2 p-4 opacity-0 transition-opacity group-hover:opacity-100">
                <a
                  href={p.github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${p.title} on GitHub`}
                  className="grid h-10 w-10 place-items-center rounded-full border border-border bg-background/80 text-foreground backdrop-blur transition hover:border-primary hover:text-primary"
                >
                  <Github size={16} />
                </a>
                <a
                  href={p.demo}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${p.title} live demo`}
                  className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground transition hover:scale-105 hover:neon-glow-strong"
                >
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                {p.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {p.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs text-primary"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-5 flex gap-3">
                <a
                  href={p.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-4 py-2 text-xs font-medium text-foreground transition hover:border-primary hover:text-primary"
                >
                  <Github size={14} /> Code
                </a>
                <a
                  href={p.demo}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:scale-105 hover:neon-glow"
                >
                  <ExternalLink size={14} /> Live Demo
                </a>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
