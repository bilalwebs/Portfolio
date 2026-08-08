import { ArrowUp } from "lucide-react";
import { socials, profile } from "@/data/portfolio";
import { SocialIcon } from "@/components/ui/social-icon";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-border bg-card/40 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 sm:flex-row sm:justify-between">
        <a href="#home" className="group flex items-center gap-3">
          <img
            src="/assets/logo.png"
            alt="Bilal Hussain logo"
            width={40}
            height={38}
            className="h-9 w-auto shrink-0 object-contain transition-transform duration-300 group-hover:scale-105"
          />

          <h2 className="text-base font-bold tracking-tight">
            Bilal <span className="gradient-text">Hussain</span>
          </h2>
        </a>

        <p className="text-xs text-muted-foreground">
          © {year} {profile.name}. All rights reserved.
        </p>

        <div className="flex items-center gap-3">
          {socials.map((s) => {
            return (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name}
                className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-all hover:border-primary hover:text-primary hover:neon-glow"
              >
                <SocialIcon name={s.icon} size={14} />
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
