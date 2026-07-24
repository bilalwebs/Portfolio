import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const SYSTEM_PROMPT = `You are Aiden's AI assistant on his portfolio site.
Aiden Vector is a Full-Stack Engineer & UI Architect based in Berlin (remote).
Contact: hello@aidenvector.dev · +49 30 5555 0182.
He has 6+ years of experience, shipped 80+ projects, and works with React, Next.js, TypeScript, Tailwind, Motion, Node.js, Postgres, GraphQL, and LLM/agent tooling.
Selected work: Halcyon Command Center (realtime agent observability), Northwave Commerce (headless storefront), Nova Chat (multi-model AI assistant), Pulse Analytics.
Answer visitor questions about Aiden's skills, projects, experience, and how to hire him. Be concise, warm, and professional. Use short paragraphs and lists. If asked something you don't know, say so and point them to the contact form.`;

type ChatRequestBody = { messages?: unknown };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as ChatRequestBody;
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const result = streamText({
          model: gateway("google/gemini-3.6-flash"),
          system: SYSTEM_PROMPT,
          messages: await convertToModelMessages(messages as UIMessage[]),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages as UIMessage[],
        });
      },
    },
  },
});
