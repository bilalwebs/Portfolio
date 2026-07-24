import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import { ChevronDown, Layers, Server, Wrench, Sparkles } from "lucide-react";
import { Section } from "@/components/ui/section";
import { skills } from "@/data/portfolio";

const groupIcons = {
  Frontend: Layers,
  Backend: Server,
  Tools: Wrench,
  AI: Sparkles,
} as const;

type Group = keyof typeof skills;

function ProgressBar({ value }: { value: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <div ref={ref} className="h-2 w-full overflow-hidden rounded-full bg-background/60">
      <motion.div
        initial={{ width: 0 }}
        animate={inView ? { width: `${value}%` } : { width: 0 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
        className="h-full rounded-full bg-gradient-to-r from-primary to-accent neon-glow"
      />
    </div>
  );
}

export function Skills() {
  const groups = Object.keys(skills) as Group[];
  const [open, setOpen] = useState<Group>("Frontend");

  return (
    <Section id="skills" eyebrow="My Toolkit" title="Skills" subtitle="What I reach for to ship polished products.">
      <div className="mx-auto max-w-3xl space-y-4">
        {groups.map((g) => {
          const Icon = groupIcons[g];
          const isOpen = open === g;
          return (
            <div key={g} className="glass-card overflow-hidden">
              <button
                onClick={() => setOpen(isOpen ? ("" as Group) : g)}
                className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-primary/5"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/15 text-primary">
                    <Icon size={16} />
                  </span>
                  <span className="font-semibold">{g}</span>
                  <span className="text-xs text-muted-foreground">
                    {skills[g].length} skills
                  </span>
                </div>
                <ChevronDown
                  size={18}
                  className={`text-primary transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              <motion.div
                initial={false}
                animate={{
                  height: isOpen ? "auto" : 0,
                  opacity: isOpen ? 1 : 0,
                }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="space-y-4 border-t border-border p-5">
                  {skills[g].map((s) => (
                    <div key={s.name}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="text-foreground">{s.name}</span>
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-primary font-semibold"
                        >
                          {s.level}%
                        </motion.span>
                      </div>
                      <ProgressBar value={s.level} />
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
