import { motion } from "motion/react";
import { ExternalLink, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Section } from "@/components/ui/section";
import { certificates } from "@/data/portfolio";

type Certificate = (typeof certificates)[number];

function CertificateCard({ c, index }: { c: Certificate; index: number }) {
  const animProps = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5, delay: index * 0.08 },
  };
  const cls =
    "group block glass-card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:neon-glow";

  const content = (
    <>
      <div className="relative flex h-48 items-center justify-center overflow-hidden bg-background/40 p-4">
        <img
          src={c.image}
          alt={c.title}
          loading="lazy"
          className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
        />
        {c.href ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <span className="absolute right-3 top-3 grid h-9 w-9 translate-y-1 place-items-center rounded-full bg-background/70 text-primary opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <ExternalLink size={15} />
            </span>
          </>
        ) : null}
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
      <motion.a
        key={c.title}
        href={c.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${c.title} — view certificate`}
        {...animProps}
        className={cls}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.div key={c.title} {...animProps} className={cls}>
      {content}
    </motion.div>
  );
}

export function Certificates() {
  const featuredCerts = certificates.slice(0, 6);

  return (
    <Section
      id="certificates"
      eyebrow="07 — Certifications"
      title="Professional Certifications"
      subtitle="Industry-recognized certifications demonstrating continuous learning and technical expertise."
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {featuredCerts.map((c, i) => (
          <CertificateCard key={c.title} c={c} index={i} />
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <Link
          to="/certificates"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-6 py-3 text-sm font-medium text-foreground transition-all duration-300 hover:border-primary hover:text-primary hover:neon-glow group"
        >
          See More
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </Section>
  );
}
