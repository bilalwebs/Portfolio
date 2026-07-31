import { body, type ValidationChain } from "express-validator";

const MAX_MESSAGES = 50;
const MAX_CONVERSATION_TEXT = 20_000;

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
    .custom((messages: unknown[]) => messages.length <= MAX_MESSAGES)
    .withMessage(`messages must contain at most ${MAX_MESSAGES} entries`),

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

  body("messages").custom((messages: unknown[]) => {
    const totalText = (messages as UiMessageLike[]).reduce((sum, message) => {
      const textLength = (message?.parts ?? [])
        .filter((part) => part?.type === "text" && typeof part.text === "string")
        .reduce((partSum, part) => partSum + (part as { text: string }).text.length, 0);
      return sum + textLength;
    }, 0);
    return totalText <= MAX_CONVERSATION_TEXT;
  }).withMessage(`Total conversation text must not exceed ${MAX_CONVERSATION_TEXT} characters`),
];

interface UiMessageLike {
  parts?: { type?: string; text?: unknown }[];
}
