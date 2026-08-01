import { randomUUID } from "node:crypto";
import type { Request, Response } from "express";
import { chatService, type UiMessage } from "../services/chat.service.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

const SSE_HEADERS = {
  "Content-Type": "text/event-stream; charset=utf-8",
  "Cache-Control": "no-cache",
  Connection: "keep-alive",
  // Tells the ai SDK transport this is a UIMessage stream.
  "X-Vercel-AI-UI-Message-Stream": "v1",
  // Disables proxy buffering (nginx) and response compression,
  // so deltas reach the client as soon as they are generated.
  "X-Accel-Buffering": "no",
  "Content-Encoding": "identity",
} as const;

export const chatController = {
  /**
   * POST /api/chat — streams an assistant reply to the frontend's
   * DefaultChatTransport. The response body is an SSE stream of JSON
   * chunks matching the ai SDK's UIMessage chunk schema:
   *   text-start -> text-delta* -> text-end -> finish
   */
  stream: asyncHandler(async (req: Request, res: Response) => {
    const messages = (req.body?.messages ?? []) as UiMessage[];
    const providerMessages = chatService.toProviderMessages(messages);

    const bodyBytes = Buffer.byteLength(JSON.stringify(req.body ?? {}), "utf8");
    const conversationTextChars = messages.reduce((sum, message) => {
      const text = (Array.isArray(message?.parts) ? message.parts : [])
        .filter(
          (part): part is { type: "text"; text: string } =>
            part != null &&
            typeof part === "object" &&
            part.type === "text" &&
            typeof part.text === "string",
        )
        .map((part) => part.text)
        .join("");
      return sum + text.length;
    }, 0);
    console.info(
      `[chat] request bodyBytes=${bodyBytes} messages=${providerMessages.length} ` +
        `conversationTextChars=${conversationTextChars}`,
    );

    const abortController = new AbortController();

    res.set(SSE_HEADERS);
    res.flushHeaders();

    res.on("close", () => {
      if (!res.writableEnded) {
        abortController.abort();
      }
    });

    const write = (chunk: unknown) => {
      if (!res.writableEnded) {
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      }
    };

    const partId = randomUUID();

    write({ type: "text-start", id: partId });

    try {
      const finishReason = await chatService.streamChatResponse({
        messages: providerMessages,
        signal: abortController.signal,
        onDelta: (delta) => write({ type: "text-delta", id: partId, delta }),
      });

      write({ type: "text-end", id: partId });
      write({ type: "finish", finishReason });
    } catch (error) {
      if (abortController.signal.aborted) {
        return;
      }
      console.error("[chat] stream failed", error);
      write({ type: "error", errorText: chatService.toErrorMessage(error) });
    } finally {
      res.end();
    }
  }),
};
