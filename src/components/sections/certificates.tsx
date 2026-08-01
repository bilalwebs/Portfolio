import { motion } from "motion/react";
import { Eye } from "lucide-react";
import { Section } from "@/components/ui/section";
import { certificates } from "@/data/portfolio";

export function Certificates() {
  return (
    <Section
      id="certificates"
      eyebrow="07 — Certifications"
      title="Professional Certifications"
      subtitle="Industry-recognized certifications demonstrating continuous learning and technical expertise."
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {certificates.map((c, i) => (
         <motion.a
  key={c.title}
  href={c.href}
  target="_blank"
  rel="noopener noreferrer"
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5, delay: i * 0.08 }}
  className="group glass-card overflow-hidden transition-all hover:-translate-y-1 hover:neon-glow"
>
            <div className="relative aspect-[4/3] overflow-hidden bg-background/40">
              <img
                src={c.image}
                alt={c.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-background/70 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">
                  <Eye size={14} /> View Credential
                </span>
              </div>
            </div>
            <div className="p-5">
            <h3 className="text-lg font-semibold transition-colors group-hover:text-primary">
                {c.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
  {c.org}
</p>
            </div>
          </motion.a>
        ))}
      </div>
    </Section>
  );
}
