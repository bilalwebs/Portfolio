// End-to-end verification of the chat pipeline.
// Runs against the BUILT backend (dist) and the real AI provider configured
// in backend/.env. Usage:  node scripts/verify-chat.mjs   (from backend/)
import { chatService } from "../dist/services/chat.service.js";

const originalInfo = console.info;
const chatLogs = [];
console.info = (...args) => {
  const line = args.map((a) => (typeof a === "string" ? a : JSON.stringify(a))).join(" ");
  if (line.startsWith("[chat]")) chatLogs.push(line);
  originalInfo(...args);
};

const queries = [
  "Who are you?",
  "What can you do?",
  "Help",
  "How can you help?",
  "What questions can I ask?",
  "Tell me about yourself",
  "Tell me about Bilal",
  "Show Bilal's projects",
  "Show Bilal's skills",
  "Show Bilal's education",
  "Show Bilal's certificates",
  "Show Bilal's hackathons",
  "Explain FastAPI and relate it to Bilal",
  "Tell me everything about Bilal",
  "What is Bilal's GPA?",
  "Did Bilal build ChatGPT?",
  "What is the weather today?",
];

for (const query of queries) {
  const logStart = chatLogs.length;
  let text = "";
  let finish = "";
  const started = Date.now();
  try {
    finish = await chatService.streamChatResponse({
      messages: [{ role: "user", content: query }],
      onDelta: (delta) => {
        text += delta;
      },
    });
  } catch (error) {
    originalInfo(
      `[VERIFY] FAILED ${JSON.stringify(query)} -> ${error?.name}: ${error?.message}`,
    );
    continue;
  }
  const elapsed = Date.now() - started;
  const metrics = chatLogs.slice(logStart).join(" | ");
  originalInfo(
    `[VERIFY] ${JSON.stringify(query)} finish=${finish} answerChars=${text.length} ms=${elapsed}`,
  );
  originalInfo(`[VERIFY]   ${metrics}`);
  originalInfo(`[VERIFY]   answer: ${text.slice(0, 180).replace(/\s+/g, " ")}...`);
}
