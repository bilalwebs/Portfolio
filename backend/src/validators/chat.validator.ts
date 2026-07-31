import { body, type ValidationChain } from "express-validator";

const MAX_MESSAGES = 50;
const MAX_CONVERSATION_TEXT = 20_000;

interface UiMessageLike {
  parts?: { type?: string; text?: unknown }[];
}

const totalConversationText = (messages: unknown[]): number =>
  messages.reduce<number>((sum, message) => {
    const candidate = message as UiMessageLike;
    const textLength = (Array.isArray(candidate?.parts) ? candidate.parts : []).reduce(
      (partSum, part) => {
        const text = part && typeof part === "object" && part.type === "text" ? part.text : "";
        return partSum + (typeof text === "string" ? text.length : 0);
      },
      0,
    );
    return sum + textLength;
  }, 0);

export const chatRules: ValidationChain[] = [
  body("id")
    .optional()
    .isString()
    .withMessage("Chat id must be a string")
    .isLength({ max: 200 })
    .withMessage("Chat id must be 200 characters or fewer"),

  body("messages")
    .isArray({ min: 1 })
    .withMessage("messages must be a non-empty array")
    .custom((messages: unknown[]) => Array.isArray(messages) && messages.length <= MAX_MESSAGES)
    .withMessage(`messages must contain at most ${MAX_MESSAGES} entries`)
    .custom((messages: unknown[]) =>
      Array.isArray(messages) && totalConversationText(messages) <= MAX_CONVERSATION_TEXT,
    )
    .withMessage(`Total conversation text must not exceed ${MAX_CONVERSATION_TEXT} characters`),

  body("messages.*.id")
    .optional()
    .isString()
    .withMessage("Each message id must be a string"),

  body("messages.*.role")
    .isIn(["user", "assistant"])
    .withMessage("Each message role must be either 'user' or 'assistant'"),

  body("messages.*.parts")
    .isArray()
    .withMessage("Each message must have a parts array"),
];
