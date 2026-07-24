import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Layers, Server, Wrench, Sparkles, type LucideIcon } from "lucide-react";
import { Section } from "@/components/ui/section";
import { skills } from "@/data/portfolio";

const groupIcons: Record<string, LucideIcon> = {
  Frontend: Layers,
  Backend: Server,
  AI: Sparkles,
  Tools: Wrench,
};

// Desired order: Frontend | Backend / AI | Tools
const orderedGroups = ["Frontend", "Backend", "AI", "Tools"] as const;

function ProgressBar({ value, delay = 0 }: { value: number; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <div ref={ref} className="h-2 w-full overflow-hidden rounded-full bg-background/60">
      <motion.div
        initial={{ width: 0 }}
        animate={inView ? { width: `${value}%` } : { width: 0 }}
        transition={{ duration: 1.1, ease: "easeOut", delay }}
        className="h-full rounded-full bg-gradient-to-r from-primary to-accent neon-glow"
      />
    </div>
  );
}

function SkillCard({ group, index }: { group: keyof typeof skills; index: number }) {
  const Icon = groupIcons[group];
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const items = skills[group];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.08 }}
      whileHover={{ y: -6 }}
      className="glass-card group relative flex h-full flex-col p-6 ring-1 ring-primary/20 transition-all hover:ring-primary/50 hover:neon-glow-strong sm:p-7"
    >
      <div className="mb-6 flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/40 neon-glow">
          <Icon size={20} />
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold">{group}</h3>
          <p className="text-xs text-muted-foreground">{items.length} skills</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-between gap-5">
        {items.map((s, i) => (
          <div key={s.name}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-foreground">{s.name}</span>
              <span className="font-semibold text-primary">{s.level}%</span>
            </div>
            <ProgressBar value={s.level} delay={0.1 + i * 0.1} />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function Skills() {
  return (
    <Section
      id="skills"
      eyebrow="My Toolkit"
      title="Skills"
      subtitle="What I reach for to ship polished products."
    >
      <div className="mx-auto grid max-w-5xl auto-rows-fr gap-6 sm:grid-cols-2 lg:gap-8">
        {orderedGroups.map((g, i) => (
          <SkillCard key={g} group={g} index={i} />
        ))}
      </div>
    </Section>
  );
}
