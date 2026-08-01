import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { Mail, Phone, MapPin, Send, Check } from "lucide-react";
import { Section } from "@/components/ui/section";
import { profile, socials } from "@/data/portfolio";
import { SocialIcon } from "@/components/ui/social-icon";

export function Contact() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      setLoading(true);
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData)),
      });

      const data = (await res.json()) as {
        success?: boolean;
        message?: string;
        error?: { message?: string; details?: { msg?: string }[] };
      };

      if (!res.ok || !data.success) {
        const detail = Array.isArray(data.error?.details) ? data.error.details[0]?.msg : undefined;
        throw new Error(
          detail || data.message || data.error?.message || "Something went wrong. Please try again in a moment.",
        );
      }

      setSent(true);
      form.reset();
      setTimeout(() => setSent(false), 3500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again in a moment.");
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    { icon: Mail, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
    { icon: Phone, label: "Phone", value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, "")}` },
    { icon: MapPin, label: "Location", value: profile.location, href: "#" },
  ];

  return (
    <Section
      id="contact"
      eyebrow="08 — Contact"
      title="Let's Connect"
      subtitle="Have an AI, software engineering, or full-stack idea? Let's explore how we can build it together."
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
        {/* Left column — pitch + contacts */}
        <motion.aside
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6 lg:col-span-5"
        >
          <div>
            <h3 className="text-2xl font-bold sm:text-3xl">Let's build what's next.</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              From AI-powered products, agentic LLM applications, and intelligent automation to scalable
              full-stack platforms built with FastAPI, React, and Next.js — I engineer software that delivers
              real results. If you have a bold idea, let's turn it into something remarkable together.
            </p>
          </div>

          <div className="space-y-3">
            {cards.map((c) => (
              <a
                key={c.label}
                href={c.href}
                className="glass-card flex items-center gap-4 p-4 transition-all hover:-translate-y-0.5 hover:neon-glow"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary neon-glow">
                  <c.icon size={18} />
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{c.label}</p>
                  <p className="truncate text-sm font-semibold text-foreground">{c.value}</p>
                </div>
              </a>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                aria-label={s.name}
                target="_blank"
                rel="noreferrer"
                className="grid h-10 w-10 place-items-center rounded-full border border-border bg-background/40 text-muted-foreground transition hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:neon-glow"
              >
                <SocialIcon name={s.icon} size={16} />
              </a>
            ))}
          </div>
        </motion.aside>

        {/* Right column — form */}
        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card space-y-4 p-6 sm:p-8 lg:col-span-7"
        >
          <input
            type="text"
            name="_hp"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            style={{ position: "absolute", left: "-9999px", opacity: 0 }}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Full Name" name="name" placeholder="Enter your full name" />
            <Field label="Email" name="email" type="email" placeholder="Enter your email address" />
          </div>
          <Field label="Subject" name="subject" placeholder="Project inquiry or collaboration" />
          <div>
            <label
              htmlFor="message"
              className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Message
            </label>
            <textarea
              id="message"
              required
              rows={6}
              name="message"
              placeholder="Tell me about your project, idea, or how I can help."
              className="w-full resize-none rounded-xl border border-border bg-background/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition focus:border-primary focus:neon-glow"
            />
          </div>
          <button
            type="submit"
            disabled={sent || loading}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:scale-[1.01] hover:neon-glow-strong disabled:opacity-70"
          >
            {sent ? (
              <>
                <Check size={16} /> Message sent — I'll be in touch soon.
              </>
            ) : (
              <>
                <Send size={16} className="transition-transform group-hover:translate-x-0.5" />
                Send Inquiry
              </>
            )}
          </button>
          {error ? (
            <p className="text-center text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}
        </motion.form>
      </div>
    </Section>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-background/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition focus:border-primary focus:neon-glow"
      />
    </div>
  );
}
