import "dotenv/config";

const toInt = (value: string | undefined, fallback: number): number => {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const CORS_ORIGINS = (
  process.env.CORS_ORIGINS ?? "http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

if (CORS_ORIGINS.length === 0) {
  throw new Error("Invalid configuration: CORS_ORIGINS must contain at least one origin");
}

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("Invalid configuration: DATABASE_URL is required");
}

const GMAIL_USER = process.env.GMAIL_USER;

if (!GMAIL_USER) {
  throw new Error("Invalid configuration: GMAIL_USER is required");
}

const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, "");

if (!GMAIL_APP_PASSWORD) {
  throw new Error("Invalid configuration: GMAIL_APP_PASSWORD is required");
}

const CONTACT_EMAIL = process.env.CONTACT_EMAIL;

if (!CONTACT_EMAIL) {
  throw new Error("Invalid configuration: CONTACT_EMAIL is required");
}

const AI_PROVIDERS = ["openai", "groq", "gemini"] as const;

export type AiProvider = (typeof AI_PROVIDERS)[number];

const AI_PROVIDER = (process.env.AI_PROVIDER ?? "openai").toLowerCase() as AiProvider;

if (!AI_PROVIDERS.includes(AI_PROVIDER)) {
  throw new Error(
    `Invalid configuration: AI_PROVIDER must be one of: ${AI_PROVIDERS.join(", ")} (got "${AI_PROVIDER}")`,
  );
}

const OPENAI_API_KEY = process.env.OPENAI_API_KEY?.trim();
const GROQ_API_KEY = process.env.GROQ_API_KEY?.trim();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY?.trim();

const AI_API_KEYS: Record<AiProvider, string | undefined> = {
  openai: OPENAI_API_KEY,
  groq: GROQ_API_KEY,
  gemini: GEMINI_API_KEY,
};

const selectedAiApiKey = AI_API_KEYS[AI_PROVIDER];

if (!selectedAiApiKey) {
  throw new Error(
    `Invalid configuration: AI_PROVIDER is "${AI_PROVIDER}" but ${AI_PROVIDER.toUpperCase()}_API_KEY is missing. ` +
      "Add it to the environment (.env) to enable the chat endpoint.",
  );
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  HOST: process.env.HOST ?? "0.0.0.0",
  PORT: toInt(process.env.PORT, 4000),
  DATABASE_URL,
  GMAIL_USER,
  GMAIL_APP_PASSWORD,
  CONTACT_EMAIL,
  CORS_ORIGINS,
  RATE_LIMIT_WINDOW_MS: toInt(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
  RATE_LIMIT_MAX: toInt(process.env.RATE_LIMIT_MAX, 100),
  CONTACT_RATE_LIMIT_WINDOW_MS: toInt(process.env.CONTACT_RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
  CONTACT_RATE_LIMIT_MAX: toInt(process.env.CONTACT_RATE_LIMIT_MAX, 5),
  CHAT_RATE_LIMIT_WINDOW_MS: toInt(process.env.CHAT_RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
  CHAT_RATE_LIMIT_MAX: toInt(process.env.CHAT_RATE_LIMIT_MAX, 30),
  AI_PROVIDER,
  OPENAI_API_KEY,
  GROQ_API_KEY,
  GEMINI_API_KEY,
} as const;

export const isProduction = env.NODE_ENV === "production";
