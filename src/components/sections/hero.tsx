import { motion } from "motion/react";
import { Download, Mail, Github, Linkedin, Twitter, Dribbble } from "lucide-react";
import { profile, socials } from "@/data/portfolio";

const iconMap = { Github, Linkedin, Twitter, Dribbble };

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden pt-32 pb-20 sm:pt-40">
      {/* particles / orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl animate-drift" />
        <div className="absolute right-0 top-40 h-96 w-96 rounded-full bg-accent/10 blur-3xl animate-drift" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,191,255,0.08)_1px,transparent_1px)] [background-size:32px_32px] opacity-40" />
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="order-2 md:order-1"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs font-medium text-primary backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Available for new projects
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
            <span className="block text-muted-foreground text-lg font-medium sm:text-xl">
              {profile.greeting}
            </span>
            <span className="mt-2 block">{profile.name}</span>
            <span className="mt-3 block gradient-text text-3xl sm:text-4xl lg:text-5xl">
              {profile.role}
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {profile.tagline}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={profile.resumeUrl}
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:scale-105 hover:neon-glow-strong"
            >
              <Download size={16} className="transition-transform group-hover:translate-y-0.5" />
              Download Resume
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-card/40 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur transition-all hover:bg-primary/10"
            >
              <Mail size={16} />
              Contact me
            </a>
          </div>

          <div className="mt-8 flex items-center gap-3">
            {socials.map((s) => {
              const Icon = iconMap[s.icon];
              return (
                <a
                  key={s.name}
                  href={s.href}
                  aria-label={s.name}
                  target="_blank"
                  rel="noreferrer"
                  className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card/60 text-muted-foreground transition-all hover:scale-110 hover:border-primary hover:text-primary hover:neon-glow"
                >
                  <Icon size={16} />
                </a>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, filter: "blur(8px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="order-1 md:order-2 mx-auto"
        >
          <div className="relative animate-float">
            {/* rotating ring */}
            <div className="absolute inset-0 -m-8 rounded-full">
              <div className="absolute inset-0 animate-pulse-ring rounded-full border border-primary/50 neon-glow" />
              <div
                className="absolute inset-2 rounded-full border border-dashed border-accent/40"
                style={{ animation: "spin 22s linear infinite" }}
              />
            </div>
            <div className="relative h-64 w-64 overflow-hidden rounded-full ring-4 ring-primary/40 neon-glow-strong sm:h-80 sm:w-80">
              <img
                src={profile.image}
                alt={profile.name}
                width={512}
                height={512}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            </div>
            {/* floating badge */}
            <div className="absolute -bottom-4 -right-4 rounded-2xl border border-border bg-card px-4 py-3 text-xs shadow-xl backdrop-blur">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-muted-foreground">Currently</span>
                <span className="font-semibold text-foreground">Building</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
