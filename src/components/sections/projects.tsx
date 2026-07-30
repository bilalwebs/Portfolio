import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Github, ExternalLink, Loader2 } from "lucide-react";
import { Section } from "@/components/ui/section";
import { projects } from "@/data/portfolio";

export function Projects() {
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);

  const handlePreview = (index: number, url: string) => {
    setLoadingIndex(index);
    setTimeout(() => {
      window.open(url, "_blank", "noopener,noreferrer");
      setLoadingIndex(null);
    }, 1100);
  };

  return (
    <Section
      id="projects"
      eyebrow="05 — Featured Projects"
      title="Featured Projects"
      subtitle="A few things I've built recently — from realtime dashboards to full commerce stacks."
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {projects.map((p, i) => {
          const isLoading = loadingIndex === i;
          return (
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

                {/* Blurred hover overlay with centered Live Preview */}
                <div
                  className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/50 opacity-0 backdrop-blur-md transition-all duration-500 group-hover:pointer-events-auto group-hover:opacity-100"
                >
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex flex-col items-center gap-3"
                      >
                        <div className="relative grid h-16 w-16 place-items-center">
                          <span className="absolute inset-0 rounded-full border-2 border-primary/30" />
                          <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-primary" />
                          <Loader2 className="animate-spin text-primary" size={22} />
                        </div>
                        <span className="text-xs font-medium tracking-widest text-primary uppercase text-glow">
                          Loading Demo...
                        </span>
                      </motion.div>
                    ) : (
                      <motion.button
                        key="preview"
                        type="button"
                        onClick={() => handlePreview(i, p.demo)}
                        initial={{ opacity: 0, y: 12, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.96 }}
                        className="relative inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg neon-glow-strong"
                      >
                        <span className="absolute inset-0 -z-10 animate-pulse-ring rounded-full bg-primary/40" />
                        <ExternalLink size={16} />
                        Live Preview
                      </motion.button>
                    )}
                  </AnimatePresence>
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
                    <Github size={14} /> Source Code
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
          );
        })}
      </div>
    </Section>
  );
}
