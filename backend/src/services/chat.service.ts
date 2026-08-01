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
  recordCount?: number;
}

const SYSTEM_PROMPT =
  "You are the AI assistant for Bilal Hussain's portfolio website. " +
  "Bilal is an AI Engineer and Full-Stack Engineer based in Karachi, Pakistan who " +
  "builds intelligent AI applications and scalable full-stack solutions. " +
  "Be concise, friendly, and professional.";

/**
 * Exact message for questions that have no answerable portfolio content. It is
 * streamed directly to the client (zero AI tokens) whenever retrieval finds no
 * relevant portfolio section, so the wording never drifts through the model.
 */
const PORTFOLIO_NOT_FOUND =
  "Sorry, I couldn't find that information in Bilal Hussain's portfolio. " +
  "Please ask about his projects, skills, education, certifications, " +
  "experience, hackathons, or other portfolio details.";

const PORTFOLIO_INSTRUCTIONS =
  "Answer the user's question using ONLY the 'Relevant portfolio information' " +
  "provided below. Do not invent facts about Bilal and do not rely on outside " +
  "knowledge about him. If NO relevant portfolio information was provided at all, " +
  "respond with exactly: " +
  JSON.stringify(PORTFOLIO_NOT_FOUND) +
  " When relevant portfolio information IS provided, answer from it; if a " +
  "specific detail is not covered by the provided information, state briefly " +
  "that it is not mentioned in the portfolio instead of using the blanket " +
  "reply above. When you reference links from the information, use the " +
  "absolute URLs as given.";

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

/**
 * Semantic identity/help patterns. They run against the normalized query and
 * never trigger retrieval or an LLM call — the canned intro is streamed back
 * instead, consuming zero AI tokens. The alternation is ordered so phrases
 * about the assistant ("about yourself", "your purpose") are matched while
 * questions about Bilal ("tell me about bilal", "your projects") fall through
 * to portfolio retrieval.
 */
const IDENTITY_PATTERNS: RegExp[] = [
  /^(?:who|what)\s+(?:are|is)\s+you$/,
  /^(?:what|which)\s+(?:do|can)\s+you\s+do\b/,
  /^(?:what|how)\s+can\s+you\s+help(?:\s+me)?$/,
  /^(?:can\s+you\s+help(?:\s+me)?|how\s+do\s+you\s+help|how\s+would\s+you\s+help\s+me|are\s+you\s+able\s+to\s+help\s+me)$/,
  /^help(?:\s+me)?$/,
  /^what\s+questions\s+(?:can\s+i\s+ask|can\s+i\s+ask\s+you|can\s+you\s+answer|do\s+you\s+answer)(?:\s+me)?$/,
  /^what\s+can\s+i\s+ask(?:\s+you)?$/,
  /^(?:can\s+you\s+)?(?:tell\s+me|tell)\s+(?:a\s+(?:little|bit)\s+)?about\s+(?:yourself|you)\b/,
  /^(?:tell\s+me\s+)?about\s+(?:yourself|this\s+(?:assistant|bot|chatbot))\b/,
  /^(?:introduce|introducing)\s+(?:yourself|you)\b/,
  /^your\s+introduction\b/,
  /^(?:explain|what\s+is|what's|what\s+are)\s+(?:your|the\s+assistant['’]?s?)\s+(?:purpose|role|job|function|name)\b/,
  /^(?:who|what)\s+(?:is|are)\s+this\s+(?:assistant|bot|chatbot)\b/,
  /^(?:are\s+you\s+an?\s+)?(?:ai|bot|assistant|chatbot)$/,
  /^are\s+you\s+(?:real|human|a\s+robot)\b/,
];

function isIdentityQuery(query: string): boolean {
  const normalized = query
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[?!.,;:]+$/g, "")
    .replace(/\s+please$/i, "")
    .trim();
  if (IDENTITY_PHRASES.has(normalized)) {
    return true;
  }
  return IDENTITY_PATTERNS.some((pattern) => pattern.test(normalized));
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
    '2. {"intent":"sections","sections":[]} when the question asks for a specific fact ' +
    "about Bilal (for example his GPA, CGPA, whether he built some famous product, a " +
    "particular employer, or any detail that appears in NO section). Do not invent or " +
    "guess a section — if the fact is absent, return an empty sections list.\n" +
    '3. {"intent":"general_knowledge"} when the question asks for a general educational ' +
    "explanation of a concept (for example: what is RAG, explain machine learning, how " +
    "does a neural network work, what is FastAPI) rather than a fact about Bilal's " +
    "portfolio.\n" +
    '4. {"intent":"off_topic"} only when the question is entirely unrelated to Bilal, ' +
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
 * `maxFieldChars` truncates long strings (used when the prompt budget is
 * tight) and `maxRecords` keeps only the top records of a list.
 */
interface CompactOptions {
  maxFieldChars?: number;
  maxRecords?: number;
}

function compactValue(value: unknown, opts: CompactOptions = {}): unknown {
  if (value == null) return undefined;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    const max = opts.maxFieldChars;
    if (max && trimmed.length > max) {
      return `${trimmed.slice(0, Math.max(1, max - 1))}…`;
    }
    return trimmed;
  }
  if (typeof value === "number" || typeof value === "boolean") return value;
  if (Array.isArray(value)) {
    const limited = opts.maxRecords ? value.slice(0, opts.maxRecords) : value;
    const compacted = limited
      .map((item) => compactValue(item, opts))
      .filter((item) => item !== undefined);
    return compacted.length > 0 ? compacted : undefined;
  }
  if (typeof value === "object") {
    const entries = Object.entries(value)
      .map(([key, nested]) => [key, compactValue(nested, opts)] as const)
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
 * Rough token estimate (chars / 4) used to keep every request inside the
 * configured prompt budget. Only used for budgeting and instrumentation, never
 * to gate features.
 */
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

interface ContextBlock {
  key: string;
  label: string;
  value: unknown;
}

function serializeBlock(block: ContextBlock, opts: CompactOptions = {}): string {
  const compact = compactValue(block.value, opts);
  return `[${block.label}]\n${resolveRelativeUrls(JSON.stringify(compact ?? null))}`;
}

function sectionBlocks(keys: string[]): ContextBlock[] {
  return keys
    .filter((key) => Object.prototype.hasOwnProperty.call(portfolioData, key))
    .map((key) => ({ key, label: key, value: portfolioData[key] }));
}

/**
 * Builds the smallest context that fits the prompt budget. Sections are kept
 * in relevance order; a section that would overflow the budget is first
 * trimmed (descriptions shortened, records capped) and only dropped if it
 * still does not fit. The highest-ranked section is always kept.
 */
function buildContext(
  blocks: ContextBlock[],
  opts: { maxTokens: number; baseChars: number },
): { keys: string[]; context: string } {
  const maxContextChars = Math.max(600, opts.maxTokens * 4 - opts.baseChars);
  const out: { key: string; text: string }[] = [];
  let total = 0;

  for (const block of blocks) {
    const join = out.length > 0 ? 2 : 0;
    let text = serializeBlock(block);
    let len = text.length;

    if (out.length > 0 && total + join + len > maxContextChars) {
      text = serializeBlock(block, { maxFieldChars: 220 });
      len = text.length;
    }
    if (out.length > 0 && total + join + len > maxContextChars) {
      text = serializeBlock(block, { maxFieldChars: 140, maxRecords: 10 });
      len = text.length;
    }
    if (out.length > 0 && total + join + len > maxContextChars) {
      text = serializeBlock(block, { maxFieldChars: 100, maxRecords: 6 });
      len = text.length;
    }
    if (total + join + len > maxContextChars) {
      if (out.length === 0) {
        text = serializeBlock(block, { maxFieldChars: 70, maxRecords: 4 });
        len = text.length;
      } else {
        continue;
      }
    }

    total += join + len;
    out.push({ key: block.key, text });
  }

  return {
    keys: out.map((entry) => entry.key),
    context: out.map((entry) => entry.text).join("\n\n"),
  };
}

/**
 * Length of the fixed system-prompt prefix (base prompt + intent instructions
 * + conversation history) that competes with the retrieved context for the
 * prompt budget. Adding 100 chars of slack keeps the final estimate from
 * drifting past the ceiling after JSON serialization.
 */
function promptReservedChars(intent: RetrievalResult["intent"], historyChars: number): number {
  const prefix =
    intent === "portfolio"
      ? `${SYSTEM_PROMPT}\n\n${PORTFOLIO_INSTRUCTIONS}\n\nRelevant portfolio information:\n`
      : intent === "general_knowledge"
        ? `${SYSTEM_PROMPT}\n\n${GENERAL_KNOWLEDGE_INSTRUCTIONS}`
        : `${SYSTEM_PROMPT}\n\n${OFF_TOPIC_INSTRUCTIONS}`;
  return prefix.length + historyChars + 100;
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

/**
 * Semantic aliases: query words that describe a portfolio concept but never
 * appear verbatim in the indexed text. They expand into field tokens so the
 * right section still wins lexically — e.g. "contact" resolves to the profile's
 * email/phone/location without needing an LLM. Content-derived, not tied to
 * export names.
 */
const QUERY_ALIASES: Record<string, string[]> = {
  contact: ["email", "phone", "location"],
  resume: ["resume", "pdf", "cv"],
  social: ["github", "linkedin", "twitter", "dribbble"],
  live: ["location", "karachi"],
  resides: ["location", "karachi"],
  address: ["location", "karachi"],
  work: ["role", "engineer"],
};

/**
 * True when at least one non-subject query token appears in any of the selected
 * sections. Used to reject judge-selected sections that share no signal with
 * the query (e.g. the profile picked for "What is Bilal's GPA?") so those
 * questions stream the exact not-found fallback instead of a vague LLM reply.
 */
function hasContentMatch(sectionKeys: string[], contentTokens: Set<string>): boolean {
  if (contentTokens.size === 0) return true;
  for (const key of sectionKeys) {
    const value = portfolioData[key];
    if (value == null) continue;
    const tokens = tokenize(`${key} ${flattenValue(value)}`);
    for (const token of contentTokens) {
      if (tokens.has(token)) return true;
    }
  }
  return false;
}

/**
 * True when the user asks for a whole-profile overview ("tell me everything",
 * "summarize Bilal", "biography", ...). These queries build one ordered,
 * merged, budget-capped context instead of scoring individual sections.
 */
function isSummaryQuery(query: string): boolean {
  const normalized = query.toLowerCase().replace(/\s+/g, " ").trim();
  return (
    /\beverything\b/.test(normalized) ||
    /\b(summarize|summary)\b/.test(normalized) ||
    /\bbiography\b/.test(normalized) ||
    /\b(complete|full|entire)\s+(profile|portfolio)\b/.test(normalized) ||
    /\boverview\b/.test(normalized) ||
    /(?:^|[!?.\s])(?:tell\s+me\s+|give\s+me\s+)?about\s+bilal\b(?!'s)/i.test(normalized)
  );
}

function isRecordArray(value: unknown): value is Record<string, unknown>[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(
      (item) => item != null && typeof item === "object" && !Array.isArray(item),
    )
  );
}

function hasFields(record: Record<string, unknown>, fields: string[]): boolean {
  return fields.every((field) => record[field] !== undefined);
}

function isStatsSection(value: unknown): boolean {
  return isRecordArray(value) && value.every((record) => hasFields(record, ["label", "value"]));
}

function isSocialsSection(value: unknown): boolean {
  return (
    isRecordArray(value) &&
    value.every(
      (record) =>
        hasFields(record, ["name", "href"]) &&
        !hasFields(record, ["title", "tag", "tech", "period", "type"]),
    )
  );
}

function isJourneySection(value: unknown): boolean {
  return (
    isRecordArray(value) &&
    value.every(
      (record) =>
        hasFields(record, ["title"]) &&
        (hasFields(record, ["period"]) || hasFields(record, ["type"])) &&
        !hasFields(record, ["href", "tag", "tech"]),
    )
  );
}

function isCertificatesSection(value: unknown): boolean {
  return (
    isRecordArray(value) &&
    value.every(
      (record) =>
        hasFields(record, ["title", "org", "href"]) &&
        !hasFields(record, ["period", "type", "tag"]),
    )
  );
}

function isRecognitionsSection(value: unknown): boolean {
  return isRecordArray(value) && value.every((record) => hasFields(record, ["tag", "title"]));
}

function isProjectsSection(value: unknown): boolean {
  return (
    isRecordArray(value) &&
    value.every(
      (record) =>
        hasFields(record, ["title"]) &&
        (hasFields(record, ["tech"]) || hasFields(record, ["github"]) || hasFields(record, ["demo"])),
    )
  );
}

function isSkillsSection(value: unknown): boolean {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const entries = Object.values(value as Record<string, unknown>);
  return (
    entries.length > 0 &&
    entries.every(
      (arr) =>
        Array.isArray(arr) &&
        arr.length > 0 &&
        arr.every(
          (item) =>
            item != null && typeof item === "object" && hasFields(item as Record<string, unknown>, ["name", "level"]),
        ),
    )
  );
}

/**
 * Builds the ordered, merged "tell me everything" context. Sections are
 * discovered by their data shape (never by hardcoded export names) in the
 * preferred order: About, Statistics, Journey, Skills, Projects, Recognitions,
 * Certificates, Contact, Resume, Social Links. Similar content is merged —
 * journey Certification entries become part of the Certificates section —
 * duplicates are dropped, and any future export (awards, blogs, research, ...)
 * is appended automatically.
 */
function buildSummaryBlocks(): { blocks: ContextBlock[]; recordCount: number } {
  const blocks: ContextBlock[] = [];
  const usedKeys = new Set<string>();
  let recordCount = 0;

  const add = (label: string, key: string, value: unknown) => {
    if (value == null) return;
    blocks.push({ key, label, value });
    if (key) usedKeys.add(key);
    recordCount += Array.isArray(value) ? value.length : 1;
  };

  const entries = Object.entries(portfolioData).filter(
    ([key]) => !NON_CONTENT_SECTION_KEYS.has(key),
  );

  const findFirst = (predicate: (value: unknown) => boolean): [string, unknown] | undefined => {
    for (const [key, value] of entries) {
      if (!usedKeys.has(key) && predicate(value)) return [key, value];
    }
    return undefined;
  };

  const profileKey = findProfileSection();
  const profile =
    profileKey && portfolioData[profileKey] && typeof portfolioData[profileKey] === "object"
      ? (portfolioData[profileKey] as Record<string, unknown>)
      : null;

  if (profileKey && profile) add("About", profileKey, profile);

  const stats = findFirst(isStatsSection);
  if (stats) add("Portfolio Statistics", stats[0], stats[1]);

  const journey = findFirst(isJourneySection);
  if (journey) add("Journey", journey[0], journey[1]);

  const skills = findFirst(isSkillsSection);
  if (skills) add("Skills", skills[0], skills[1]);

  const projects = findFirst(isProjectsSection);
  if (projects) add("Projects", projects[0], projects[1]);

  const recognitions = findFirst(isRecognitionsSection);
  if (recognitions) add("Recognitions", recognitions[0], recognitions[1]);

  // Certificates: journey Certification entries merged with the certificates
  // section, deduplicated by title.
  const mergedCerts: Record<string, unknown>[] = [];
  const seenTitles = new Set<string>();
  const pushCert = (item: Record<string, unknown>) => {
    const title = typeof item.title === "string" ? item.title.trim().toLowerCase() : "";
    if (!title || seenTitles.has(title)) return;
    seenTitles.add(title);
    mergedCerts.push(item);
  };
  if (journey) {
    for (const item of journey[1] as Record<string, unknown>[]) {
      if (typeof item.type === "string" && /certification/i.test(item.type)) pushCert(item);
    }
  }
  const certSection = findFirst(isCertificatesSection);
  if (certSection) {
    for (const item of certSection[1] as Record<string, unknown>[]) pushCert(item);
  }
  if (mergedCerts.length > 0) {
    add("Certificates", certSection?.[0] ?? journey?.[0] ?? "", mergedCerts);
  }

  // Hackathons stay separate only when recognitions mixes in non-hackathon
  // entries; otherwise the recognitions block already covers them.
  if (recognitions) {
    const items = recognitions[1] as Record<string, unknown>[];
    const hackathons = items.filter(
      (item) => typeof item.tag === "string" && /hackathon/i.test(item.tag),
    );
    const others = items.filter(
      (item) => !(typeof item.tag === "string" && /hackathon/i.test(item.tag)),
    );
    if (hackathons.length > 0 && others.length > 0) add("Hackathons", "Hackathons", hackathons);
  }

  if (profile) {
    const contact: Record<string, unknown> = {};
    if (typeof profile.email === "string") contact.email = profile.email;
    if (typeof profile.phone === "string") contact.phone = profile.phone;
    if (typeof profile.location === "string") contact.location = profile.location;
    if (Object.keys(contact).length > 0) add("Contact", "Contact", contact);
    if (typeof profile.resumeUrl === "string" && profile.resumeUrl) {
      add("Resume", "Resume", { resumeUrl: resolveRelativeUrls(profile.resumeUrl) });
    }
  }

  const socials = findFirst(isSocialsSection);
  if (socials) add("Social Links", socials[0], socials[1]);

  // Any remaining discovered section (future exports) is appended as-is so it
  // automatically becomes part of the summary too.
  for (const [key, value] of entries) {
    if (!usedKeys.has(key)) add(key, key, value);
  }

  return { blocks, recordCount };
}

function buildSummaryContext(
  maxTokens: number,
  baseChars: number,
): { keys: string[]; context: string; recordCount: number } {
  const { blocks, recordCount } = buildSummaryBlocks();
  const built = buildContext(blocks, { maxTokens, baseChars });
  return { keys: built.keys, context: built.context, recordCount };
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
 * explicitly requested topic is dropped. Whole-profile requests ("tell me
 * everything", "summarize Bilal") build one ordered, merged context. No section
 * names are hardcoded; every section exported by src/data/portfolio.ts (and any
 * added in the future) is discovered from the generated snapshot. The retrieval
 * logic itself never depends on AI_PROVIDER — the optional LLM judge is only a
 * lexical fallback and degrades to the index when unavailable.
 */
async function retrieveRelevantContext(
  query: string,
  signal?: AbortSignal,
  options?: { historyChars?: number },
): Promise<RetrievalResult> {
  const historyChars = options?.historyChars ?? 0;
  const offTopic: RetrievalResult = { intent: "off_topic", sectionKeys: [], context: "" };

  if (isSummaryQuery(query)) {
    const built = buildSummaryContext(
      env.PROMPT_BUDGET_TOKENS,
      promptReservedChars("portfolio", historyChars),
    );
    return {
      intent: "portfolio",
      sectionKeys: built.keys,
      context: built.context,
      recordCount: built.recordCount,
    };
  }

  const queryTokens = tokenize(query);

  if (queryTokens.size === 0) {
    if (SUBJECT_PHRASE.test(query)) {
      const profileKey = findProfileSection();
      if (profileKey) {
        return {
          intent: "portfolio",
          sectionKeys: [profileKey],
          context: `[${profileKey}]\n${serializeSection(profileKey)}`,
          recordCount: 1,
        };
      }
    }
    return offTopic;
  }

  // Semantic alias expansion: "contact" -> profile email/phone/location etc.
  for (const token of [...queryTokens]) {
    const aliases = QUERY_ALIASES[token];
    if (aliases) {
      for (const alias of aliases) {
        for (const expanded of tokenize(alias)) {
          queryTokens.add(expanded);
        }
      }
    }
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
    if (subjectHit && !generalHit) {
      // A question about Bilal that matches no portfolio content at all
      // (GPA, "did he build X", ...) — deterministic not-found, zero AI tokens.
      result = { intent: "portfolio", keys: [] };
    } else if (subjectHit) {
      result = { intent: "general_knowledge", keys: [] };
    } else if (generalHit) {
      result = { intent: "general_knowledge", keys: [] };
    } else {
      result = await judgeKeys();
    }
  } else if (scored[0]!.score >= 0.5) {
    const topTied = scored
      .filter((entry) => entry.score === scored[0]!.score)
      .slice(0, MAX_CONTEXT_SECTIONS)
      .map((entry) => entry.index.key);
    result = generalHit
      ? { intent: "general_knowledge", keys: topTied }
      : { intent: "portfolio", keys: topTied };
  } else if (subjectHit) {
    result = generalHit
      ? { intent: "general_knowledge", keys: lexicalKeys() }
      : await judgeKeys();
  } else if (generalHit) {
    result = { intent: "general_knowledge", keys: lexicalKeys() };
  } else {
    result = await judgeKeys();
  }

  const keys =
    result.intent === "portfolio" && result.keys.length > 0
      ? buildPortfolioKeys(result.keys)
      : result.keys;

  if (result.intent === "portfolio" && !hasContentMatch(keys, contentTokens)) {
    return { intent: "portfolio", sectionKeys: [], context: "", recordCount: 0 };
  }

  if (keys.length === 0) {
    return { intent: result.intent, sectionKeys: [], context: "", recordCount: 0 };
  }

  const built = buildContext(sectionBlocks(keys), {
    maxTokens: env.PROMPT_BUDGET_TOKENS,
    baseChars: promptReservedChars(result.intent, historyChars),
  });

  return {
    intent: result.intent,
    sectionKeys: built.keys,
    context: built.context,
    recordCount: countRecords(built.keys),
  };
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

    const historyText = options.messages.map((message) => message.content ?? "").join("");

    let systemContent = SYSTEM_PROMPT;
    let retrieval: RetrievalResult | null = null;

    if (query.trim()) {
      retrieval = await retrieveRelevantContext(query, options.signal, {
        historyChars: historyText.length,
      });

      // Unknown portfolio question: no relevant section exists, so the exact
      // fallback is streamed statically — zero AI tokens, no hallucination.
      if (retrieval.intent === "portfolio" && !retrieval.context) {
        console.info(
          `[chat] no relevant portfolio info queryLen=${query.length}; streamed exact fallback (no LLM call)`,
        );
        options.onDelta(PORTFOLIO_NOT_FOUND);
        return "stop";
      }

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
    const promptTokens = estimateTokens(systemContent) + estimateTokens(historyText);

    console.info(
      `[chat] queryLen=${query.length} ` +
        `intent=${retrieval?.intent ?? "none"} ` +
        `sections=${retrieval?.sectionKeys.length ?? 0} ` +
        `records=${retrieval?.recordCount ?? (retrieval ? countRecords(retrieval.sectionKeys) : 0)} ` +
        `contextChars=${retrieval?.context.length ?? 0} ` +
        `systemPromptChars=${systemContent.length} ` +
        `historyChars=${historyText.length} ` +
        `promptTokens≈${promptTokens} ` +
        `budget=${env.PROMPT_BUDGET_TOKENS} ` +
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
