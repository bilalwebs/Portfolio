import { ArrowUp, Github, Linkedin, Twitter, Dribbble } from "lucide-react";
import { socials, profile } from "@/data/portfolio";

const iconMap = { Github, Linkedin, Twitter, Dribbble };

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-border bg-card/40 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 sm:flex-row sm:justify-between">
        <a href="#home" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary neon-glow ring-1 ring-primary/40 font-bold">
            A
          </span>
          <span className="font-semibold">
            Aiden<span className="text-primary">.</span>
          </span>
        </a>

        <p className="text-xs text-muted-foreground">
          © {year} {profile.name}. Crafted with care and caffeine.
        </p>

        <div className="flex items-center gap-3">
          {socials.map((s) => {
            const Icon = iconMap[s.icon];
            return (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.name}
                className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-all hover:border-primary hover:text-primary hover:neon-glow"
              >
                <Icon size={14} />
              </a>
            );
          })}
          <a
            href="#home"
            aria-label="Back to top"
            className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground transition hover:scale-110 hover:neon-glow-strong"
          >
            <ArrowUp size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
}
