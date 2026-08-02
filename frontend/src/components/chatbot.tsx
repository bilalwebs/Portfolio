import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { API_BASE_URL } from "@/lib/api";

const STORAGE_KEY = "bilal-portfolio-chat-v1";

const SUGGESTIONS = [
  "Tell me about Bilal",
  "Show me Bilal's featured projects",
  "Which hackathons has Bilal participated in?",
  "What technologies does Bilal specialize in?",
];


function loadMessages(): UIMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as UIMessage[]) : [];
  } catch {
    return [];
  }
}

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [initial] = useState<UIMessage[]>(() => loadMessages());
  const scrollRef = useRef<HTMLDivElement>(null);

  const transport = useRef(new DefaultChatTransport({ api: `${API_BASE_URL}/chat` })).current;
  const { messages, sendMessage, status, setMessages } = useChat({
    id: "bilal-assistant",
    messages: initial,
    transport,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      /* ignore quota */
    }
  }, [messages]);

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open, status]);

  const isBusy = status === "submitted" || status === "streaming";

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isBusy) return;
    setInput("");
    void sendMessage({ text });
  };

  const handleSuggestion = (text: string) => {
    if (isBusy) return;
    void sendMessage({ text });
  };

  const clear = () => {
    setMessages([]);
    if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <>
      {/* Launcher */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat with Bilal's AI Assistant"}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 220, damping: 18 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/40 neon-glow-strong sm:bottom-6 sm:right-6"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={22} />
            </motion.span>
          ) : (
            <motion.span
              key="msg"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <MessageCircle size={22} />
              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 animate-pulse rounded-full bg-accent" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="fixed bottom-24 right-3 z-50 flex h-[calc(100dvh-8rem)] max-h-[600px] w-[calc(100vw-1.5rem)] max-w-[400px] flex-col overflow-hidden glass-card border-primary/30 shadow-2xl shadow-primary/20 sm:right-6 sm:bottom-28"
            role="dialog"
            aria-label="Bilal Portfolio AI Assistant"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 border-b border-border/60 bg-background/40 px-4 py-3 backdrop-blur">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/15 text-primary neon-glow">
                  <Sparkles size={16} />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
  Bilal AI Assistant
</p>
                  <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
  AI Assistant • Online
</p>
                </div>
              </div>
              {messages.length > 0 && (
                <button
                  onClick={clear}
                  className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground transition hover:border-primary/60 hover:text-primary"
                >
                  Clear Chat
                </button>
              )}
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="chatbot-messages flex-1 space-y-3 overflow-y-auto px-4 py-4"
            >
              {messages.length === 0 && (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
                      <Sparkles size={14} />
                    </span>
                    <div className="rounded-2xl rounded-tl-sm border border-border bg-background/50 px-3.5 py-2.5 text-sm text-foreground whitespace-pre-line">
                      {`Hi! 👋 I'm Bilal's AI Assistant.

I can answer questions about:

• AI & Full-Stack Projects
• Agentic AI Experience
• Skills & Technologies
• Hackathons
• Certifications
• Education
• Contact Information

Ask me anything!`}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSuggestion(s)}
                        className="rounded-full border border-primary/40 bg-primary/5 px-3 py-1.5 text-xs text-primary transition hover:border-primary hover:bg-primary/15"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m) => {
                const text = m.parts
                  .map((p) => (p.type === "text" ? p.text : ""))
                  .join("");
                const isUser = m.role === "user";
                return (
                  <div
                    key={m.id}
                    className={`flex gap-2 ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    {!isUser && (
                      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
                        <Sparkles size={14} />
                      </span>
                    )}
                    <div
                      className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                        isUser
                          ? "rounded-tr-sm bg-primary text-primary-foreground shadow-md shadow-primary/30"
                          : "rounded-tl-sm border border-border bg-background/50 text-foreground"
                      }`}
                    >
                      {text || (
                        <span className="inline-flex gap-1">
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current" />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {status === "submitted" && (
                <div className="flex gap-2">
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
                    <Sparkles size={14} />
                  </span>
                  <div className="rounded-2xl rounded-tl-sm border border-border bg-background/50 px-3.5 py-2.5 text-sm">
                    <span className="inline-flex gap-1">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Composer */}
            <form
              onSubmit={handleSubmit}
              className="flex items-end gap-2 border-t border-border/60 bg-background/40 p-3 backdrop-blur"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about Bilal..."
                disabled={isBusy}
                className="flex-1 rounded-full border border-border bg-background/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition focus:border-primary focus:neon-glow disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={isBusy || !input.trim()}
                aria-label="Send message"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/30 transition hover:neon-glow-strong disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
