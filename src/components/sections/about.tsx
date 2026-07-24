import { motion } from "motion/react";
import { Section } from "@/components/ui/section";
import { profile, stats } from "@/data/portfolio";

export function About() {
  return (
    <Section
      id="about"
      eyebrow="Get to know me"
      title="About Me"
      subtitle="Engineer by training, designer by obsession — I build calm, fast, considered interfaces."
    >
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-2"
        >
          <div className="relative">
            <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-primary/30 to-accent/10 blur-2xl" />
            <div className="glass-card relative overflow-hidden">
              <img
                src={profile.aboutImage}
                alt="Working"
                loading="lazy"
                className="h-[420px] w-full object-cover opacity-90"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-3"
        >
          <div className="glass-card p-8">
            <h3 className="text-2xl font-semibold">
              Full-Stack Engineer with a designer's <span className="text-primary">eye</span>.
            </h3>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              For the past six years I've partnered with startups and product teams to ship
              interfaces that feel inevitable — deliberate typography, choreographed motion, and
              performance budgets that never slip. I care about the whole stack, from a clean
              database schema to the last easing curve on a button press.
            </p>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              When I'm not shipping, I'm mentoring engineers, writing about UI craft, and exploring
              generative motion systems.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-xl border border-border bg-background/40 p-4 text-center transition-all hover:border-primary/60 hover:neon-glow"
                >
                  <div className="text-2xl font-bold text-primary text-glow">{s.value}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
                </motion.div>
              ))}
            </div>

            <a
              href="#journey"
              className="mt-8 inline-flex rounded-full border border-primary/40 bg-primary/10 px-5 py-2.5 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground hover:neon-glow"
            >
              Read more →
            </a>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
