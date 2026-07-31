import OpenAI from "openai";
import { env, type AiProvider } from "../config/env.js";

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

interface ProviderConfig {
  model: string;
  baseURL?: string;
}

const PROVIDER_CONFIG: Record<AiProvider, ProviderConfig> = {
  openai: { model: "gpt-4o-mini" },
  groq: { model: "llama-3.3-70b-versatile", baseURL: "https://api.groq.com/openai/v1" },
  gemini: { model: "gemini-2.0-flash", baseURL: "https://generativelanguage.googleapis.com/v1beta/openai" },
};

const SYSTEM_PROMPT =
  "You are the AI assistant for Bilal Hussain's portfolio website. " +
  "Answer questions about Bilal's projects, skills, technologies, hackathons, " +
  "certifications, education, and contact information. " +
  "Be concise, friendly, and professional, and do not invent facts about Bilal.";

const API_KEY_BY_PROVIDER: Record<AiProvider, string | undefined> = {
  openai: env.OPENAI_API_KEY,
  groq: env.GROQ_API_KEY,
  gemini: env.GEMINI_API_KEY,
};

let client: OpenAI | undefined;

function getClient(): OpenAI {
  if (client) {
    return client;
  }

  const apiKey = API_KEY_BY_PROVIDER[env.AI_PROVIDER];

  if (!apiKey) {
    throw new Error(
      `Chat provider "${env.AI_PROVIDER}" is not configured: ${env.AI_PROVIDER.toUpperCase()}_API_KEY is missing`,
    );
  }

  const config = PROVIDER_CONFIG[env.AI_PROVIDER];

  client = new OpenAI({ apiKey, baseURL: config.baseURL });

  return client;
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
      const text = message.parts
        .filter(
          (part): part is UiMessageTextPart =>
            part.type === "text" && typeof part.text === "string",
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
   * Streams a completion from the configured AI provider, invoking
   * `onDelta` for every text chunk as it arrives. Returns the finish
   * reason reported by the provider.
   */
  async streamChatResponse(options: StreamChatResponseOptions): Promise<string> {
    const config = PROVIDER_CONFIG[env.AI_PROVIDER];
    const currentClient = getClient();

    const stream = await currentClient.chat.completions.create(
      {
        model: config.model,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...options.messages],
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
