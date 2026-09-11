import { motion } from "motion/react";
import { ExternalLink, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { certificates } from "@/data/portfolio";

type Certificate = (typeof certificates)[number];

function CertificateCard({ c, index }: { c: Certificate; index: number }) {
  const cls =
    "group block glass-card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:neon-glow";

  const content = (
    <>
      <div className="flex h-48 items-center justify-center overflow-hidden bg-background/40 p-4">
        <img
          src={c.image}
          alt={c.title}
          loading="lazy"
          className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold transition-colors group-hover:text-primary">
          {c.title}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">{c.org}</p>
      </div>
    </>
  );

  if (c.href) {
    return (
      <a
        key={c.title}
        href={c.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${c.title} — view certificate`}
        className={cls}
      >
        {content}
      </a>
    );
  }

  return (
    <div key={c.title} className={cls}>
      {content}
    </div>
  );
}

export function CertificatesPage() {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-6 pt-28 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <span className="mt-6 block text-xs font-semibold uppercase tracking-[0.35em] text-primary">
            07 — All Certifications
          </span>
          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
            All <span className="gradient-text">Certifications</span>
          </h1>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Every certification and achievement representing my journey across web development, AI, and modern technologies.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {certificates.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <CertificateCard c={c} index={i} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
