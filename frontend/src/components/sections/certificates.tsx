import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Award } from "lucide-react";
import { certificates } from "@/data/portfolio";

type Certificate = (typeof certificates)[number];

const displayCertificates = certificates.map((c, i) => ({
  id: i + 1,
  title: c.title,
  org: c.org,
  image: c.image,
  href: c.href,
}));

export function Certificates() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const total = displayCertificates.length;

  const goTo = useCallback(
    (idx: number) => {
      if (idx < 0 || idx >= total || idx === active) return;
      setDirection(idx > active ? 1 : -1);
      setActive(idx);
    },
    [active, total],
  );

  const prev = useCallback(() => goTo(active === 0 ? total - 1 : active - 1), [active, total, goTo]);
  const next = useCallback(() => goTo(active === total - 1 ? 0 : active + 1), [active, total, goTo]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  useEffect(() => {
    if (listRef.current) {
      const btn = listRef.current.children[active] as HTMLElement | undefined;
      btn?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [active]);

  const cert = displayCertificates[active];
  const num = String(cert.id).padStart(2, "0");

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <section id="certificates" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-14 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">
              Certifications
            </span>
            <div className="mt-5 h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent" />
            <h2 className="mt-8 text-4xl font-bold sm:text-5xl">
              Proof of continuous{" "}
              <span className="gradient-text">learning.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground lg:text-right">
            A collection of certifications and achievements representing my journey across web development, AI, and modern technologies.
          </p>
        </div>

        {/* Main Container */}
        <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#080c14]">
          <div className="grid min-h-[420px] lg:grid-cols-[280px_1fr]">
            {/* Left Navigation */}
            <div className="hidden border-r border-white/[0.06] bg-white/[0.01] lg:block">
              <div ref={listRef} className="flex flex-col overflow-y-auto p-3">
                {displayCertificates.map((c, i) => {
                  const n = String(c.id).padStart(2, "0");
                  const isActive = i === active;
                  return (
                    <button
                      key={c.id}
                      onClick={() => goTo(i)}
                      className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-left transition-all duration-200 ${
                        isActive
                          ? "bg-white/[0.06] ring-1 ring-white/[0.1]"
                          : "hover:bg-white/[0.03]"
                      }`}
                    >
                      <div className="relative flex h-14 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white/[0.03]">
                        <img
                          src={c.image}
                          alt={c.title}
                          className={`max-h-full max-w-full object-contain transition-all duration-300 ${
                            isActive ? "opacity-100" : "opacity-50 group-hover:opacity-70"
                          }`}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className={`block text-[10px] font-semibold tracking-wider ${isActive ? "text-primary" : "text-white/30"}`}>
                          {n}
                        </span>
                        <span className={`mt-0.5 block truncate text-xs font-medium ${isActive ? "text-white" : "text-white/50"}`}>
                          {c.title.length > 22 ? c.title.slice(0, 22) + "…" : c.title}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile Thumbnail Strip */}
            <div className="flex gap-2 overflow-x-auto border-b border-white/[0.06] bg-white/[0.01] p-3 lg:hidden">
              {displayCertificates.map((c, i) => {
                const n = String(c.id).padStart(2, "0");
                const isActive = i === active;
                return (
                  <button
                    key={c.id}
                    onClick={() => goTo(i)}
                    className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-left transition-all duration-200 ${
                      isActive
                        ? "bg-white/[0.06] ring-1 ring-white/[0.1]"
                        : "hover:bg-white/[0.03]"
                    }`}
                  >
                    <div className="flex h-8 w-12 shrink-0 items-center justify-center overflow-hidden rounded bg-white/[0.03]">
                      <img
                        src={c.image}
                        alt={c.title}
                        className={`max-h-full max-w-full object-contain transition-opacity ${isActive ? "opacity-100" : "opacity-50"}`}
                      />
                    </div>
                    <div className="min-w-0">
                      <span className={`block text-[9px] font-semibold tracking-wider ${isActive ? "text-primary" : "text-white/30"}`}>
                        {n}
                      </span>
                      <span className={`block truncate text-[10px] font-medium ${isActive ? "text-white" : "text-white/50"}`}>
                        {c.title.length > 16 ? c.title.slice(0, 16) + "…" : c.title}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Viewer */}
            <div className="relative flex flex-col">
              {/* Top Bar */}
              <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
                <div className="flex items-center gap-2 text-white/40">
                  <Award size={14} />
                  <span className="text-[10px] font-semibold uppercase tracking-widest">Certificate</span>
                </div>
                <span className="text-sm font-semibold text-white/20">{num}</span>
              </div>

              {/* Certificate Display */}
              <div className="relative flex flex-1 items-center justify-center px-4 py-8 sm:px-16 sm:py-10">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={active}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="flex h-full w-full items-center justify-center"
                  >
                    <a href={cert.href} target="_blank" rel="noopener noreferrer" className="block">
                      <img
                        src={cert.image}
                        alt={cert.title}
                        className="max-h-[380px] max-w-full object-contain object-center sm:max-h-[420px]"
                      />
                    </a>
                  </motion.div>
                </AnimatePresence>

                {/* Nav Arrows */}
                <button
                  onClick={prev}
                  aria-label="Previous certificate"
                  className="absolute left-2 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-white/[0.08] bg-black/40 text-white/50 backdrop-blur transition-all hover:border-white/[0.15] hover:text-white sm:left-4 sm:h-10 sm:w-10"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={next}
                  aria-label="Next certificate"
                  className="absolute right-2 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-white/[0.08] bg-black/40 text-white/50 backdrop-blur transition-all hover:border-white/[0.15] hover:text-white sm:right-4 sm:h-10 sm:w-10"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Bottom Info */}
              <div className="flex items-center justify-between border-t border-white/[0.06] px-6 py-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-white/30">{num}</span>
                  <span className="text-sm font-medium text-white/70">{cert.title.length > 40 ? cert.title.slice(0, 40) + "…" : cert.title}</span>
                </div>
                <span className="text-xs text-white/25">{total} certificates</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
