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

/**
 * Maps each supported provider to the environment variables that configure
 * it. Adding a future provider (Anthropic, OpenRouter, DeepSeek, ...) only
 * requires a new entry here plus the corresponding *_API_KEY, *_BASE_URL
 * and *_MODEL variables.
 */
interface AiProviderEnvSpec {
  apiKey: string;
  baseUrl: string;
  model: string;
}

const AI_PROVIDER_ENV_SPECS: Record<AiProvider, AiProviderEnvSpec> = {
  openai: { apiKey: "OPENAI_API_KEY", baseUrl: "OPENAI_BASE_URL", model: "OPENAI_MODEL" },
  groq: { apiKey: "GROQ_API_KEY", baseUrl: "GROQ_BASE_URL", model: "GROQ_MODEL" },
  gemini: { apiKey: "GEMINI_API_KEY", baseUrl: "GEMINI_BASE_URL", model: "GEMINI_MODEL" },
};

const AI_PROVIDER = (process.env.AI_PROVIDER ?? "openai").toLowerCase() as AiProvider;

if (!AI_PROVIDERS.includes(AI_PROVIDER)) {
  throw new Error(
    `Invalid configuration: AI_PROVIDER must be one of: ${AI_PROVIDERS.join(", ")} (got "${AI_PROVIDER}")`,
  );
}

const readAiSetting = (name: string): string => process.env[name]?.trim() ?? "";

const aiEnvSpec = AI_PROVIDER_ENV_SPECS[AI_PROVIDER];
const aiApiKey = readAiSetting(aiEnvSpec.apiKey);
const aiBaseUrl = readAiSetting(aiEnvSpec.baseUrl);
const aiModel = readAiSetting(aiEnvSpec.model);

if (!aiApiKey) {
  throw new Error(
    `Invalid configuration: AI_PROVIDER is "${AI_PROVIDER}" but ${aiEnvSpec.apiKey} is missing. ` +
      "Add it to the environment (.env) to enable the chat endpoint.",
  );
}

if (!aiBaseUrl) {
  throw new Error(
    `Invalid configuration: AI_PROVIDER is "${AI_PROVIDER}" but ${aiEnvSpec.baseUrl} is missing. ` +
      "Add it to the environment (.env) to enable the chat endpoint.",
  );
}

if (!aiModel) {
  throw new Error(
    `Invalid configuration: AI_PROVIDER is "${AI_PROVIDER}" but ${aiEnvSpec.model} is missing. ` +
      "Add it to the environment (.env) to enable the chat endpoint.",
  );
}

export const aiProviderConfig = {
  provider: AI_PROVIDER,
  apiKey: aiApiKey,
  baseUrl: aiBaseUrl,
  model: aiModel,
} as const;

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
  // Configurable prompt budget in tokens. Every LLM request is kept at or
  // below this ceiling by trimming the retrieved portfolio context first.
  PROMPT_BUDGET_TOKENS: toInt(process.env.PROMPT_BUDGET_TOKENS, 6000),
} as const;

export const isProduction = env.NODE_ENV === "production";
