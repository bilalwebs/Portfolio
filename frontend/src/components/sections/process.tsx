import { motion } from "motion/react";
import { Compass, PenTool, Code2, ShieldCheck, Rocket, type LucideIcon } from "lucide-react";
import { Section } from "@/components/ui/section";

type Step = {
  num: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

const steps: Step[] = [
  {
    num: "01",
    title: "Requirements Analysis",
    description:
      "Understand business goals, gather requirements, analyze user needs, and define the project scope before development begins.",
    icon: Compass,
  },
  {
    num: "02",
    title: "System Design",
    description:
      "Design scalable system architecture, APIs, databases, AI workflows, and intuitive user experiences with security, maintainability, and performance in mind.",
    icon: PenTool,
  },
  {
    num: "03",
    title: "Development",
    description:
      "Develop scalable AI-powered applications using Python, FastAPI, React, Next.js, SQL, and Large Language Models while following clean architecture and industry best practices.",
    icon: Code2,
  },
  {
    num: "04",
    title: "Testing & Optimization",
    description:
      "Test application functionality, resolve issues, optimize performance, refine AI workflows, and ensure production-ready reliability.",
    icon: ShieldCheck,
  },
  {
    num: "05",
    title: "Deployment & Maintenance",
    description:
      "Deploy applications to cloud platforms, monitor performance, maintain reliability, and continuously improve the product through iterative updates and user feedback.",
    icon: Rocket,
  },
];
export function Process() {
  return (
<Section
  id="process"
  eyebrow="04 — Development Process"
  title="How I Build AI Solutions"
  subtitle="A structured workflow for building scalable, production-ready AI applications."
>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const isLast = i === steps.length - 1;
          return (
            <motion.article
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: "easeOut" }}
              whileHover={{ y: -6 }}
              className={`glass-card group relative flex h-full flex-col p-6 ring-1 ring-primary/20 transition-all hover:ring-primary/50 hover:neon-glow-strong sm:p-7 ${
                isLast && steps.length % 3 === 2 ? "lg:col-start-2" : ""
              }`}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute right-5 top-4 text-5xl font-black leading-none text-primary/10 transition-colors group-hover:text-primary/25 sm:text-6xl"
              >
                {step.num}
              </span>

              <span className="mb-5 grid h-12 w-12 place-items-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/40 transition-all group-hover:bg-primary group-hover:text-primary-foreground neon-glow">
                <Icon size={22} />
              </span>

              <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>

              <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-60 transition-opacity group-hover:opacity-100" />
            </motion.article>
          );
        })}
      </div>
    </Section>
  );
}
