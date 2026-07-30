import type { ReactNode } from "react";
import { motion } from "motion/react";

interface SectionProps {
  id: string;
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function Section({ id, eyebrow, title, subtitle, children, className = "" }: SectionProps) {
  return (
    <section id={id} className={`relative py-24 sm:py-32 ${className}`}>
      <div className="mx-auto max-w-6xl px-6">

        <motion.div
  initial={{ opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-80px" }}
  transition={{ duration: 0.6, ease: "easeOut" }}
  className="mb-14 text-center"
>
  {eyebrow && (
    <div className="flex flex-col items-center">
      <span className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">
        {eyebrow}
      </span>

      <div className="mt-5 h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent" />
    </div>
  )}

  <h2 className="mt-8 text-4xl font-bold sm:text-5xl">
    <span className="gradient-text">{title}</span>
  </h2>

  {subtitle && (
    <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
      {subtitle}
    </p>
  )}
</motion.div>
        {children}
      </div>
    </section>
  );
}
