import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/data/portfolio";
import { motion, AnimatePresence } from "motion/react";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "backdrop-blur-xl" : ""
      }`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6 transition-all ${
          scrolled ? "border-b border-border bg-background/70" : ""
        }`}
      >
        <a href="#home" className="group flex shrink-0 items-center gap-3">
          <img
            src="/assets/logo.png"
            alt="Bilal Hussain logo"
            width={44}
            height={42}
            className="h-10 w-auto shrink-0 object-contain transition-transform duration-300 group-hover:scale-105"
          />

          <div className="leading-tight">
            <h1 className="text-lg font-bold tracking-tight">
              Bilal <span className="gradient-text">Hussain</span>
            </h1>

            <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
              AI Engineer
            </p>
          </div>
        </a>

        <nav className="hidden min-w-0 flex-1 items-center justify-center lg:flex lg:gap-1">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="whitespace-nowrap rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary xl:px-4"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          className="hidden shrink-0 whitespace-nowrap rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-105 hover:neon-glow-strong lg:inline-flex lg:px-5 lg:text-sm"
        >
          Hire me
        </a>

        <button
          aria-label="Toggle menu"
          className="rounded-lg p-2 text-primary lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="lg:hidden"
          >
            <div className="mx-4 mb-4 glass-card p-4">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-4 py-3 text-sm text-muted-foreground hover:bg-primary/10 hover:text-primary"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="mt-2 block rounded-lg bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground"
              >
                Hire me
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
