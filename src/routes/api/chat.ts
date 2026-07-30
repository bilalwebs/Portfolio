import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import {
  profile,
  skills,
  projects,
  journey,
  recognitions,
  certificates,
} from "@/data/portfolio";

const portfolioContext = `
Name: ${profile.name}
Role: ${profile.role}
Location: ${profile.location}
Email: ${profile.email}

Skills:
${Object.entries(skills)
  .map(([category, items]) => {
    return `${category}: ${items.map((s) => s.name).join(", ")}`;
  })
  .join("\n")}

Projects:
${projects
  .map(
    (p) => `- ${p.title}: ${p.description}
Tech: ${p.tech.join(", ")}`
  )
  .join("\n\n")}

Education & Journey:
${journey
  .map((j) => `- ${j.title} (${j.org})`)
  .join("\n")}

Recognitions:
${recognitions
  .map((r) => `- ${r.title}: ${r.description}`)
  .join("\n")}

Certificates:
${certificates
  .map((c) => `- ${c.title} (${c.org})`)
  .join("\n")}
`;
const SYSTEM_PROMPT = `
You are Bilal's AI Assistant.

You answer questions only about Bilal's portfolio.

Here is Bilal's latest portfolio information:

${portfolioContext}

Rules:
- Be professional and concise.
- Answer only using the information above.
- Never invent projects, skills, achievements, certifications, education, or experience that are not present in the portfolio information.
- If information is unavailable, politely say you don't know instead of making up an answer.
- If someone greets you, introduce yourself as Bilal's AI Assistant and briefly explain what you can help with.
- If someone wants to contact Bilal, provide his email or tell them to use the Contact section.
`;
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
