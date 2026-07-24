import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { Mail, Phone, MapPin, Send, Check } from "lucide-react";
import { Section } from "@/components/ui/section";
import { profile } from "@/data/portfolio";

export function Contact() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3500);
    (e.currentTarget as HTMLFormElement).reset();
  };

  const cards = [
    { icon: Mail, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
    { icon: Phone, label: "Phone", value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, "")}` },
    { icon: MapPin, label: "Location", value: profile.location, href: "#" },
  ];

  return (
    <Section
      id="contact"
      eyebrow="Say hello"
      title="Let's Connect"
      subtitle="Got a project in mind? I'd love to hear about it."
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card space-y-4 p-6 sm:p-8 lg:col-span-3"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Name" name="name" placeholder="Your name" />
            <Field label="Email" name="email" type="email" placeholder="you@company.com" />
          </div>
          <Field label="Subject" name="subject" placeholder="Project inquiry" />
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Message
            </label>
            <textarea
              required
              rows={5}
              name="message"
              placeholder="Tell me a little about what you're building…"
              className="w-full resize-none rounded-xl border border-border bg-background/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition focus:border-primary focus:neon-glow"
            />
          </div>
          <button
            type="submit"
            disabled={sent}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:scale-[1.01] hover:neon-glow-strong disabled:opacity-70 sm:w-auto"
          >
            {sent ? (
              <>
                <Check size={16} /> Message sent
              </>
            ) : (
              <>
                <Send size={16} className="transition-transform group-hover:translate-x-0.5" />
                Send Message
              </>
            )}
          </button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-4 lg:col-span-2"
        >
          {cards.map((c) => (
            <a
              key={c.label}
              href={c.href}
              className="glass-card flex items-center gap-4 p-5 transition-all hover:-translate-y-0.5 hover:neon-glow"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/15 text-primary neon-glow">
                <c.icon size={18} />
              </span>
              <div>
                <p className="text-xs text-muted-foreground">{c.label}</p>
                <p className="text-sm font-semibold text-foreground">{c.value}</p>
              </div>
            </a>
          ))}
        </motion.div>
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
      <label htmlFor={name} className="mb-1.5 block text-xs font-medium text-muted-foreground">
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
