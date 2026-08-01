import OpenAI from "openai";
import { aiProviderConfig, env } from "../config/env.js";
import { portfolioData } from "../generated/portfolio.data.js";

export interface UiMessagePart {
  type: string;
  [key: string]: unknown;
}

export interface UiMessageTextPart extends UiMessagePart {
  type: "text";
  text: string;
}

export interface UiMessage {
  id: string;
  role: "user" | "assistant";
  parts: UiMessagePart[];
}

export interface ChatProviderMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface StreamChatResponseOptions {
  messages: ChatProviderMessage[];
  signal?: AbortSignal;
  onDelta: (delta: string) => void;
}

export interface RetrievalResult {
  intent: "portfolio" | "general_knowledge" | "off_topic";
  sectionKeys: string[];
  context: string;
}

const SYSTEM_PROMPT =
  "You are the AI assistant for Bilal Hussain's portfolio website. " +
  "Bilal is an AI Engineer and Full-Stack Engineer based in Karachi, Pakistan who " +
  "builds intelligent AI applications and scalable full-stack solutions. " +
  "Be concise, friendly, and professional.";

const PORTFOLIO_INSTRUCTIONS =
  "Answer the user's question using ONLY the 'Relevant portfolio information' " +
  "provided below. Do not invent facts about Bilal and do not rely on outside " +
  "knowledge about him. If NO relevant portfolio information was provided at all, " +
  "respond with exactly: I couldn't find that information in Bilal Hussain's portfolio. " +
  "When relevant portfolio information IS provided, answer from it; if a specific " +
  "detail is not covered by the provided information, state briefly that it is not " +
  "mentioned in the portfolio instead of using the blanket reply above. When you " +
  "reference links from the information, use the absolute URLs as given.";

const OFF_TOPIC_INSTRUCTIONS =
  "The user's question is not about Bilal or his portfolio. Give a short answer or " +
  "acknowledgement in 2 to 4 sentences, then connect it back to Bilal and what he does " +
  "as an AI Engineer and Full-Stack Engineer. Do not invent facts about Bilal.";

const GENERAL_KNOWLEDGE_INSTRUCTIONS =
  "The user is asking about a general concept. Answer with a short, educational " +
  "explanation of the concept using model knowledge in 2 to 4 sentences. If 'Relevant " +
  "portfolio information' is provided, connect the explanation back to Bilal Hussain's " +
  "actual work using ONLY that information. Never invent or assume anything about Bilal's " +
  "projects, skills, certificates, education, or experience that is not present in the " +
  "provided portfolio information. If no portfolio information is provided or relevant, " +
  "give the explanation without fabricating a connection to Bilal.";

const MAX_CONTEXT_SECTIONS = 3;

/**
 * Upper bound for a single query that enumerates multiple portfolio topics
 * ("education, skills, projects, certificates, ..."). Kept well below the full
 * portfolio so single requests stay small, while still covering every
 * explicitly requested topic.
 */
const MAX_CONTEXT_SECTIONS_MULTI = 10;

/**
 * Signals that a query enumerates multiple topics rather than asking about a
 * single one: comma-separated lists and topic-collecting words/phrases.
 */
const MULTI_INTENT_PATTERN =
  /(?:,\s+[a-z0-9]|\b(?:and|including|such as|like|everything|all about|also|every|list|overview|summary)\b)/i;

const STOPWORDS = new Set([
  "a", "an", "the", "and", "or", "but", "if", "then", "else", "when", "while",
  "of", "at", "by", "for", "with", "about", "against", "between", "into",
  "through", "during", "before", "after", "above", "below", "to", "from", "up",
  "down", "in", "out", "on", "off", "over", "under", "again", "further", "then",
  "once", "here", "there", "all", "any", "both", "each", "few", "more", "most",
  "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so",
  "than", "too", "very", "can", "will", "just", "should", "now", "is", "are",
  "was", "were", "be", "been", "being", "have", "has", "had", "having", "do",
  "does", "did", "doing", "would", "could", "ought", "i", "me", "my", "we", "our",
  "you", "your", "he", "him", "his", "she", "her", "it", "its", "they", "them",
  "what", "which", "who", "whom", "this", "that", "these", "those", "am", "ask",
  "please", "tell", "show", "give", "list", "see", "say", "hello", "hi", "hey",
]);

const SITE_ORIGIN = (env.CORS_ORIGINS[0] ?? "").replace(/\/+$/, "");

let client: OpenAI | undefined;

function getClient(): OpenAI {
  if (client) {
    return client;
  }

  client = new OpenAI({
    apiKey: aiProviderConfig.apiKey,
    baseURL: aiProviderConfig.baseUrl,
  });

  return client;
}

/**
 * Light stemming so "projects" and "hackathons" match "project"/"hackathon"
 * during lexical retrieval.
 */
function stem(token: string): string {
  if (token.length > 4 && token.endsWith("es")) {
    return token.slice(0, -2);
  }
  if (token.length > 3 && token.endsWith("s")) {
    return token.slice(0, -1);
  }
  return token;
}

/**
 * Splits camelCase words ("resumeUrl") so they index as "resume url".
 */
function camelSplit(text: string): string {
  return text.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
}

function tokenize(text: string): Set<string> {
  const tokens = new Set<string>();
  for (const raw of camelSplit(text).toLowerCase().split(/[^a-z0-9]+/)) {
    if (raw.length < 2) continue;
    const token = stem(raw);
    if (!STOPWORDS.has(token)) {
      tokens.add(token);
    }
  }
  return tokens;
}

function flattenValue(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map(flattenValue).join(" ");
  if (typeof value === "object") {
    return Object.entries(value)
      .map(([key, nested]) => `${key} ${flattenValue(nested)}`)
      .join(" ");
  }
  return "";
}

/**
 * Locates the section that describes Bilal himself (a personal profile with a
 * name and at least one detail field) by content rather than by a hardcoded
 * export name, so renaming or adding sections in src/data/portfolio.ts never
 * breaks retrieval.
 */
function findProfileSection(): string | null {
  for (const [key, value] of Object.entries(portfolioData)) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      const record = value as Record<string, unknown>;
      if (
        typeof record.name === "string" &&
        ["role", "email", "location", "greeting", "tagline"].some(
          (field) => typeof record[field] === "string",
        )
      ) {
        return key;
      }
    }
  }
  return null;
}

/**
 * Words that identify "this is a question about Bilal" but carry no signal
 * about WHICH section is relevant. They gate portfolio intent and pull in the
 * profile section, but are excluded from section ranking so noise sections
 * don't win. Derived from the portfolio itself — never hardcoded.
 */
function buildSubjectTokens(): Set<string> {
  const tokens = new Set<string>(["portfolio"]);
  const profileKey = findProfileSection();
  if (profileKey) {
    const record = portfolioData[profileKey] as Record<string, unknown>;
    if (typeof record.name === "string") {
      for (const token of tokenize(record.name)) {
        tokens.add(token);
      }
    }
  }
  return tokens;
}

const SUBJECT_TOKENS = buildSubjectTokens();

/**
 * Phrases built entirely from stop words that still ask about Bilal and must
 * resolve to the profile section rather than being treated as off-topic.
 */
const SUBJECT_PHRASE =
  /\b(?:who are you|about you|about yourself|introduce yourself|tell me about yourself|tell me something about yourself|what do you do|your introduction|yourself)\b/i;

/**
 * General concepts the assistant may briefly explain from model knowledge.
 * Model knowledge is used ONLY for these (or judge-classified) educational
 * concepts; every question about Bilal stays portfolio-only.
 */
const GENERAL_KNOWLEDGE_TERMS = [
  "ai", "artificial intelligence", "machine learning", "deep learning", "ml",
  "nlp", "computer vision", "generative ai", "genai", "llm", "llms",
  "agentic ai", "ai agent", "ai agents", "rag", "langchain", "langgraph",
  "prompt engineering", "python", "fastapi", "react", "next.js", "nextjs",
  "tailwind", "typescript", "javascript", "streamlit", "docker", "postman",
  "vercel", "qwen", "openai", "groq", "gemini", "embedding", "embeddings",
  "vector database", "neural network", "neural networks", "fine-tuning",
  "finetuning", "sqlalchemy", "sqlite", "onnx", "api", "rest api",
  "cloud computing",
];

const GENERAL_KNOWLEDGE_TOKENS = new Set(
  GENERAL_KNOWLEDGE_TERMS.flatMap((term) => [...tokenize(term)]),
);

/**
 * Fixed introduction returned for identity/help intents ("Who are you?",
 * "What can you do?", "Help", "Tell me about yourself", ...). These never
 * trigger portfolio retrieval and never build an LLM prompt — the text below
 * is streamed to the client directly.
 */
const IDENTITY_INTRO =
  "Hi! I'm Bilal Hussain's AI Portfolio Assistant.\n\n" +
  "I can tell you about Bilal — an AI Engineer and Full-Stack Engineer based " +
  "in Karachi, Pakistan — including his AI & Full-Stack projects, agentic AI " +
  "experience, skills and technologies, hackathons, certifications, education, " +
  "and contact information. I can also explain general tech and AI concepts " +
  "like RAG, FastAPI, and machine learning, and relate them to Bilal's work.\n\n" +
  "What would you like to know about Bilal?";

/**
 * Normalized phrases that resolve to the identity/help intent. Matched against
 * the raw user question only (no tokens, no retrieval, no LLM).
 */
const IDENTITY_PHRASES = new Set([
  "who are you",
  "what are you",
  "what can you do",
  "what do you do",
  "what can you do for me",
  "how can you help",
  "how can you help me",
  "how do you help",
  "can you help",
  "can you help me",
  "help",
  "help me",
  "what questions can i ask",
  "what questions can i ask you",
  "what questions can you answer",
  "what can i ask",
  "what can i ask you",
  "tell me about yourself",
  "tell me something about yourself",
  "about yourself",
  "introduce yourself",
  "your introduction",
]);

function isIdentityQuery(query: string): boolean {
  const normalized = query
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/^[?!.\s]+|[?!.\s]+$/g, "")
    .replace(/\s+please$/i, "")
    .trim();
  return IDENTITY_PHRASES.has(normalized);
}

function streamIntro(onDelta: (delta: string) => void): void {
  onDelta(IDENTITY_INTRO);
}

interface SectionIndex {
  key: string;
  text: string;
  tokens: Set<string>;
}

/**
 * Sections that hold no answerable portfolio content. "navLinks" is the site's
 * navigation menu (labels + anchor hrefs) — including it in the index only adds
 * token noise and can win lexical matches for words like "projects"/"skills".
 */
const NON_CONTENT_SECTION_KEYS = new Set(["navLinks"]);

function buildSectionIndexes(): SectionIndex[] {
  return Object.entries(portfolioData)
    .filter(([key]) => !NON_CONTENT_SECTION_KEYS.has(key))
    .map(([key, value]) => {
      const text = `${key} ${flattenValue(value)}`;
      return { key, text, tokens: tokenize(text) };
    });
}

const SECTION_INDEXES: SectionIndex[] = buildSectionIndexes();

const DOC_FREQUENCIES = new Map<string, number>();
for (const index of SECTION_INDEXES) {
  for (const token of index.tokens) {
    DOC_FREQUENCIES.set(token, (DOC_FREQUENCIES.get(token) ?? 0) + 1);
  }
}

/**
 * Rarer tokens (present in fewer sections) are more distinctive and get a
 * higher weight, so a query token like "rag" outranks a common one like
 * "project" when ranking candidate sections.
 */
function tokenWeight(token: string): number {
  const documentFrequency = DOC_FREQUENCIES.get(token) ?? 1;
  return 1 / Math.sqrt(documentFrequency);
}

/**
 * Resolves relative URLs (e.g. "./Bilal_Hussain.pdf") against the site origin
 * so the assistant can hand back absolute, clickable links.
 */
function resolveRelativeUrls(text: string): string {
  if (!SITE_ORIGIN) return text;
  return text.replace(
    /(^|[\s"'(])(\.{1,2}\/)([^\s"')]+)/g,
    (_match, prefix, _dots, path) => `${prefix}${SITE_ORIGIN}/${path}`,
  );
}

function scoreSections(
  queryTokens: Set<string>,
): { index: SectionIndex; score: number }[] {
  const scored = SECTION_INDEXES.map((index) => {
    let score = 0;
    for (const token of queryTokens) {
      if (index.tokens.has(token)) {
        score += tokenWeight(token);
      }
    }
    return { index, score };
  });

  scored.sort(
    (a, b) => b.score - a.score || a.index.tokens.size - b.index.tokens.size,
  );

  return scored;
}

function extractJsonObject(text: string): Record<string, unknown> | null {
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace <= firstBrace) {
    return null;
  }
  const candidate = text.slice(firstBrace, lastBrace + 1);
  try {
    return JSON.parse(candidate) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/**
 * Asks the model to pick the relevant portfolio sections for queries that the
 * lexical index cannot resolve with confidence, or to classify the question as
 * an educational general-knowledge query or as off-topic. Falls back
 * gracefully by throwing so the caller can retry with lexical results.
 */
async function judgeRelevantSections(
  query: string,
  signal?: AbortSignal,
): Promise<string[] | "off_topic" | "general_knowledge"> {
  const sectionLines = SECTION_INDEXES.map(({ key, text }) => {
    const snippet = text.length > 600 ? `${text.slice(0, 600)}...` : text;
    return `"${key}": ${JSON.stringify(snippet)}`;
  }).join("\n");

  const system =
    "You decide how to answer a user's question about Bilal Hussain (an AI Engineer " +
    "and Full-Stack Engineer). The portfolio sections are listed below with their " +
    "content. Choose ONE of the following and reply with a single JSON object and " +
    "nothing else:\n" +
    '1. {"intent":"sections","sections":["key1","key2"]} when portfolio section(s) ' +
    "contain the answer or useful related information. Only use section keys from the " +
    "list below.\n" +
    '2. {"intent":"general_knowledge"} when the question asks for a general educational ' +
    "explanation of a concept (for example: what is RAG, explain machine learning, how " +
    "does a neural network work, what is FastAPI) rather than a fact about Bilal's " +
    "portfolio.\n" +
    '3. {"intent":"off_topic"} only when the question is entirely unrelated to Bilal, ' +
    "his portfolio, or general tech/AI concepts (for example weather, sports, cooking).\n" +
    "Questions about Bilal's resume, contact details, social profiles, education, " +
    "projects, skills, certifications, hackathons, or recognitions are always " +
    "portfolio-related — never classify those as off_topic or general_knowledge.";

  const user = `Portfolio sections:\n${sectionLines}\n\nQuestion: ${query}`;

  const completion = await getClient().chat.completions.create(
    {
      model: aiProviderConfig.model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      stream: false,
      max_tokens: 256,
    },
    { signal },
  );

  const content = completion.choices[0]?.message?.content ?? "";
  const parsed = extractJsonObject(content);

  if (!parsed) {
    throw new Error("retrieval judge returned no valid JSON");
  }

  if (parsed.intent === "off_topic") {
    return "off_topic";
  }

  if (parsed.intent === "general_knowledge") {
    return "general_knowledge";
  }

  if (parsed.intent === "sections" && Array.isArray(parsed.sections)) {
    const keys = parsed.sections.filter(
      (key): key is string =>
        typeof key === "string" &&
        Object.prototype.hasOwnProperty.call(portfolioData, key),
    );
    return keys;
  }

  return "off_topic";
}

/**
 * Recursively strips fields that carry no signal for the model (nulls, empty
 * strings, empty arrays/objects) so the serialized context stays minimal.
 */
function compactValue(value: unknown): unknown {
  if (value == null) return undefined;
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed ? trimmed : undefined;
  }
  if (typeof value === "number" || typeof value === "boolean") return value;
  if (Array.isArray(value)) {
    const compacted = value.map(compactValue).filter((item) => item !== undefined);
    return compacted.length > 0 ? compacted : undefined;
  }
  if (typeof value === "object") {
    const entries = Object.entries(value)
      .map(([key, nested]) => [key, compactValue(nested)] as const)
      .filter(([, nested]) => nested !== undefined);
    return entries.length > 0 ? Object.fromEntries(entries) : undefined;
  }
  return undefined;
}

/**
 * Serializes a section as compact (non-pretty-printed) JSON with empty fields
 * removed — roughly half the size of the previous pretty-printed dump — while
 * still handing back absolute, clickable links.
 */
function serializeSection(key: string): string {
  const compact = compactValue(portfolioData[key]);
  return resolveRelativeUrls(JSON.stringify(compact ?? null));
}

/**
 * Hard ceiling for the retrieved-context block (system prompt payload). Whole
 * sections are kept in relevance order; anything that would overflow the
 * budget is dropped. Always keeps at least the highest-ranked section.
 */
const MAX_CONTEXT_CHARS = 6_000;

function buildContext(keys: string[]): { keys: string[]; context: string } {
  const blocks: { key: string; block: string }[] = [];
  let total = 0;
  for (const key of keys) {
    const block = `[${key}]\n${serializeSection(key)}`;
    if (blocks.length > 0 && total + block.length + 2 > MAX_CONTEXT_CHARS) {
      break;
    }
    total += (blocks.length > 0 ? 2 : 0) + block.length;
    blocks.push({ key, block });
  }
  return {
    keys: blocks.map((entry) => entry.key),
    context: blocks.map((entry) => entry.block).join("\n\n"),
  };
}

/**
 * Counts portfolio records inside a set of section keys (array length for list
 * sections, 1 for object sections) — used for retrieval instrumentation.
 */
function countRecords(sectionKeys: string[]): number {
  let total = 0;
  for (const key of sectionKeys) {
    const value = portfolioData[key];
    if (Array.isArray(value)) {
      total += value.length;
    } else if (value && typeof value === "object") {
      total += 1;
    }
  }
  return total;
}

const judgeCache = new Map<string, Promise<string[] | "off_topic" | "general_knowledge">>();

/**
 * Wraps the judge call with a small in-memory cache so repeated or similar
 * questions don't trigger extra model requests.
 */
function cachedJudgeRelevantSections(
  query: string,
  signal?: AbortSignal,
): Promise<string[] | "off_topic" | "general_knowledge"> {
  const key = query.trim().toLowerCase();
  const existing = judgeCache.get(key);
  if (existing) {
    return existing;
  }

  const pending = judgeRelevantSections(query, signal).catch((error) => {
    judgeCache.delete(key);
    throw error;
  });

  if (judgeCache.size < 100) {
    judgeCache.set(key, pending);
  }

  return pending;
}

/**
 * Selects the portfolio sections relevant to `query` and serializes them into
 * the smallest useful context. Never sends the full portfolio. Handles both
 * single-topic and multi-topic queries: when a query enumerates several topics
 * (commas, "and", "including", "everything"), the planner merges every matched
 * section — ranked, deduplicated, capped at MAX_CONTEXT_SECTIONS_MULTI — so no
 * explicitly requested topic is dropped. No section names are hardcoded; every
 * section exported by src/data/portfolio.ts (and any added in the future) is
 * discovered from the generated snapshot.
 */
async function retrieveRelevantContext(
  query: string,
  signal?: AbortSignal,
): Promise<RetrievalResult> {
  const offTopic: RetrievalResult = { intent: "off_topic", sectionKeys: [], context: "" };
  const queryTokens = tokenize(query);

  if (queryTokens.size === 0) {
    if (SUBJECT_PHRASE.test(query)) {
      const profileKey = findProfileSection();
      if (profileKey) {
        return {
          intent: "portfolio",
          sectionKeys: [profileKey],
          context: `[${profileKey}]\n${serializeSection(profileKey)}`,
        };
      }
    }
    return offTopic;
  }

  const subjectHit = [...queryTokens].some((token) => SUBJECT_TOKENS.has(token));
  const contentTokens = new Set(
    [...queryTokens].filter((token) => !SUBJECT_TOKENS.has(token)),
  );
  const generalHit =
    contentTokens.size > 0 &&
    [...contentTokens].some((token) => GENERAL_KNOWLEDGE_TOKENS.has(token));

  const profileKey = findProfileSection();

  const scored =
    contentTokens.size > 0
      ? scoreSections(contentTokens).filter((entry) => entry.score > 0)
      : [];
  const matchedKeys = scored.map((entry) => entry.index.key);

  const enumerative = MULTI_INTENT_PATTERN.test(query);
  const isMultiTopic =
    enumerative &&
    matchedKeys.length >= 1 &&
    (matchedKeys.length > MAX_CONTEXT_SECTIONS || subjectHit || generalHit);

  const lexicalKeys = (limit: number = MAX_CONTEXT_SECTIONS): string[] =>
    scored.slice(0, limit).map((entry) => entry.index.key);

  const profileOnly = (): string[] => (profileKey ? [profileKey] : []);

  const buildPortfolioKeys = (keys: string[]): string[] =>
    subjectHit && profileKey && !keys.includes(profileKey)
      ? [profileKey, ...keys]
      : keys;

  const judgeKeys = async (): Promise<{
    intent: RetrievalResult["intent"];
    keys: string[];
  }> => {
    try {
      const judged = await cachedJudgeRelevantSections(query, signal);
      if (judged === "general_knowledge") {
        return { intent: "general_knowledge", keys: lexicalKeys() };
      }
      if (judged !== "off_topic" && judged.length > 0) {
        return { intent: "portfolio", keys: judged.slice(0, MAX_CONTEXT_SECTIONS) };
      }
      if (subjectHit) {
        return { intent: "portfolio", keys: lexicalKeys() };
      }
      return { intent: "off_topic", keys: [] };
    } catch (error) {
      console.warn("[chat] retrieval judge unavailable; using lexical fallback", error);
      if (subjectHit) {
        return { intent: "portfolio", keys: lexicalKeys() };
      }
      return { intent: generalHit ? "general_knowledge" : "off_topic", keys: lexicalKeys() };
    }
  };

  let result: { intent: RetrievalResult["intent"]; keys: string[] };

  if (isMultiTopic) {
    result = {
      intent: subjectHit || !generalHit ? "portfolio" : "general_knowledge",
      keys: matchedKeys.slice(0, MAX_CONTEXT_SECTIONS_MULTI),
    };
  } else if (contentTokens.size === 0) {
    result = subjectHit
      ? { intent: "portfolio", keys: profileOnly() }
      : { intent: "off_topic", keys: [] };
  } else if (scored.length === 0) {
    if (subjectHit) {
      result = await judgeKeys();
    } else if (generalHit) {
      result = { intent: "general_knowledge", keys: [] };
    } else {
      result = { intent: "off_topic", keys: [] };
    }
  } else if (scored[0]!.score >= 1) {
    const topTied = scored
      .filter((entry) => entry.score === scored[0]!.score)
      .slice(0, MAX_CONTEXT_SECTIONS)
      .map((entry) => entry.index.key);
    result =
      generalHit && !subjectHit
        ? { intent: "general_knowledge", keys: topTied }
        : { intent: "portfolio", keys: topTied };
  } else if (subjectHit) {
    result = await judgeKeys();
  } else if (generalHit) {
    result = { intent: "general_knowledge", keys: lexicalKeys() };
  } else {
    result = await judgeKeys();
  }

  const keys =
    result.intent === "portfolio" ? buildPortfolioKeys(result.keys) : result.keys;

  if (keys.length === 0) {
    return { intent: result.intent, sectionKeys: [], context: "" };
  }

  const built = buildContext(keys);

  return { intent: result.intent, sectionKeys: built.keys, context: built.context };
}

function toErrorMessage(error: unknown): string {
  if (error instanceof OpenAI.APIError) {
    switch (error.status) {
      case 401:
        return "The AI provider rejected the API key.";
      case 404:
        return "The selected AI model is not available.";
      case 429:
        return "The AI provider is temporarily rate limiting requests.";
      default:
        return "The AI provider could not be reached. Please try again.";
    }
  }

  return "Something went wrong while generating a response. Please try again.";
}

export const chatService = {
  /**
   * Converts the frontend's UIMessage[] payload into the provider
   * message format, keeping only textual parts and the roles the
   * OpenAI-compatible Chat Completions API understands.
   */
  toProviderMessages(messages: UiMessage[]): ChatProviderMessage[] {
    const converted: ChatProviderMessage[] = [];

    for (const message of messages) {
      const text = (Array.isArray(message.parts) ? message.parts : [])
        .filter(
          (part): part is UiMessageTextPart =>
            part != null &&
            typeof part === "object" &&
            part.type === "text" &&
            typeof part.text === "string",
        )
        .map((part) => part.text)
        .join("");

      if (!text.trim()) {
        continue;
      }

      converted.push({
        role: message.role === "assistant" ? "assistant" : "user",
        content: text,
      });
    }

    return converted;
  },

  /**
   * Selects the portfolio sections relevant to a user query. Exposed for
   * debugging and testing; the streaming path uses it internally.
   */
  async retrieveRelevantContext(
    query: string,
    signal?: AbortSignal,
  ): Promise<RetrievalResult> {
    return retrieveRelevantContext(query, signal);
  },

  /**
   * Streams a completion from the configured AI provider, invoking
   * `onDelta` for every text chunk as it arrives. Returns the finish
   * reason reported by the provider. The SSE chunk sequence is identical
   * to before — retrieval only changes the context the model sees.
   */
  async streamChatResponse(options: StreamChatResponseOptions): Promise<string> {
    const lastUserMessage = [...options.messages]
      .reverse()
      .find((message) => message.role === "user");
    const query = lastUserMessage?.content ?? "";

    // Identity/help intents short-circuit before ANY retrieval or LLM call:
    // the fixed introduction is streamed straight to the client.
    if (isIdentityQuery(query)) {
      console.info(
        `[chat] identity/help intent queryLen=${query.length}; streamed canned intro (no retrieval, no LLM call)`,
      );
      streamIntro(options.onDelta);
      return "stop";
    }

    let systemContent = SYSTEM_PROMPT;
    let retrieval: RetrievalResult | null = null;

    if (query.trim()) {
      retrieval = await retrieveRelevantContext(query, options.signal);
      if (retrieval.intent === "off_topic") {
        systemContent = `${SYSTEM_PROMPT}\n\n${OFF_TOPIC_INSTRUCTIONS}`;
      } else if (retrieval.intent === "general_knowledge") {
        const contextBlock = retrieval.context
          ? `\n\nRelevant portfolio information:\n${retrieval.context}`
          : "";
        systemContent = `${SYSTEM_PROMPT}\n\n${GENERAL_KNOWLEDGE_INSTRUCTIONS}${contextBlock}`;
      } else {
        systemContent =
          `${SYSTEM_PROMPT}\n\n${PORTFOLIO_INSTRUCTIONS}\n\n` +
          `Relevant portfolio information:\n${retrieval.context}`;
      }
    }

    const providerMessages: ChatProviderMessage[] = [
      { role: "system", content: systemContent },
      ...options.messages,
    ];
    const requestBodyChars = JSON.stringify({
      model: aiProviderConfig.model,
      messages: providerMessages,
    }).length;

    console.info(
      `[chat] queryLen=${query.length} ` +
        `intent=${retrieval?.intent ?? "none"} ` +
        `sections=${retrieval?.sectionKeys.length ?? 0} ` +
        `records=${retrieval ? countRecords(retrieval.sectionKeys) : 0} ` +
        `contextChars=${retrieval?.context.length ?? 0} ` +
        `systemPromptChars=${systemContent.length} ` +
        `requestBodyChars=${requestBodyChars}`,
    );

    const stream = await getClient().chat.completions.create(
      {
        model: aiProviderConfig.model,
        messages: providerMessages,
        stream: true,
      },
      { signal: options.signal },
    );

    let finishReason = "stop";

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) {
        options.onDelta(delta);
      }
      const chunkFinishReason = chunk.choices[0]?.finish_reason;
      if (chunkFinishReason) {
        finishReason = chunkFinishReason;
      }
    }

    return finishReason;
  },

  toErrorMessage,
};
