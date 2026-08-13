import { chatService } from "../dist/services/chat.service.js";

const originalInfo = console.info;
const chatLogs = [];
console.info = (...args) => {
  const line = args.map((a) => (typeof a === "string" ? a : JSON.stringify(a))).join(" ");
  if (line.startsWith("[chat]")) chatLogs.push(line);
  originalInfo(...args);
};

const queries = [
  "Show Bilal's education, skills, projects, certificates, and hackathons",
  "List Bilal's projects and certificates",
];

for (const query of queries) {
  const logStart = chatLogs.length;
  let text = "";
  const retrieval = await chatService.retrieveRelevantContext(query);
  const started = Date.now();
  try {
    await chatService.streamChatResponse({
      messages: [{ role: "user", content: query }],
      onDelta: (delta) => {
        text += delta;
      },
    });
  } catch (error) {
    originalInfo(`[VERIFY] FAILED ${JSON.stringify(query)} -> ${error?.name}: ${error?.message}`);
    continue;
  }
  const metrics = chatLogs.slice(logStart).join(" | ");
  originalInfo(
    `[VERIFY] ${JSON.stringify(query)} answerChars=${text.length} ms=${Date.now() - started}`,
  );
  originalInfo(`[VERIFY]   retrievalKeys=${JSON.stringify(retrieval.sectionKeys)}`);
  originalInfo(`[VERIFY]   ${metrics}`);
}
