import { DefaultChatTransport } from "ai";

const transport = new DefaultChatTransport({ api: "http://localhost:4000/api/chat" });

const messages = [
  {
    id: "u1",
    role: "user",
    parts: [{ type: "text", text: "Which hackathons has Bilal participated in?" }],
  },
];

try {
  const stream = await transport.sendMessages({
    chatId: "test-chat",
    messages,
    abortSignal: new AbortController().signal,
    trigger: "submit-message",
  });

  const reader = stream.getReader();
  const chunks = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  console.log("RECEIVED CHUNKS:", JSON.stringify(chunks, null, 2));
  console.log("TOTAL CHUNKS:", chunks.length);
} catch (error) {
  console.error("TRANSPORT ERROR:", error);
  console.error("MESSAGE:", error instanceof Error ? error.message : error);
  if (error && typeof error === "object" && "stack" in error) {
    console.error(error.stack);
  }
  process.exit(1);
}
