import { motion } from "motion/react";
import { Download } from "lucide-react";
import { Section } from "@/components/ui/section";
import { profile } from "@/data/portfolio";

const aboutStats = [
  { value: "5th", label: "Semester BSCS" },
  { value: "15+", label: "Projects Done" },
  { value: "2+", label: "Yrs in Design" },
];

export function About() {
  return (
    <Section id="about" eyebrow="01 — About Me" title="" subtitle="">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
        {/* Left: framed portrait with corner brackets */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-5"
        >
          <div className="relative mx-auto w-full max-w-[420px]">
            {/* corner brackets */}
            <span className="pointer-events-none absolute -left-3 -top-3 h-8 w-8 border-l-2 border-t-2 border-primary/70" />
            <span className="pointer-events-none absolute -right-3 -top-3 h-8 w-8 border-r-2 border-t-2 border-primary/70" />
            <span className="pointer-events-none absolute -bottom-3 -left-3 h-8 w-8 border-b-2 border-l-2 border-primary/70" />
            <span className="pointer-events-none absolute -bottom-3 -right-3 h-8 w-8 border-b-2 border-r-2 border-primary/70" />

            {/* soft glow */}
            <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-primary/25 via-accent/10 to-transparent blur-3xl" />

            <div className="relative overflow-hidden rounded-2xl border border-primary/25 bg-card/60 p-2 backdrop-blur">
              <img
                src={profile.aboutImage}
                alt="Portrait"
                loading="lazy"
                className="h-[460px] w-full rounded-xl object-cover"
              />
            </div>
          </div>
        </motion.div>

        {/* Right: content */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-7"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Frontend Developer &amp; Visual Designer
          </p>
          <h3 className="mt-4 text-4xl font-bold leading-tight text-foreground sm:text-5xl">
            Engineering Fluid Interfaces
          </h3>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
            I specialize in translating sophisticated structural designs into highly optimized,
            performant source code. With strong academic pillars in Computer Science and hands-on
            freelance delivery workflows, I cross-engineer interfaces for scalable client success.
          </p>

          {/* stats row */}
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {aboutStats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
                className="rounded-2xl border border-primary/20 bg-card/50 py-6 text-center backdrop-blur transition-all hover:border-primary/60 hover:neon-glow"
              >
                <div className="text-3xl font-bold text-primary text-glow">{s.value}</div>
                <div className="mt-1 text-xs tracking-wide text-muted-foreground">{s.label}</div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-10">
            <a
              href={profile.resumeUrl}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_rgba(0,191,255,0.45)] transition-all hover:-translate-y-0.5 hover:bg-accent"
            >
              <Download className="h-4 w-4" />
              Download CV
            </a>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
