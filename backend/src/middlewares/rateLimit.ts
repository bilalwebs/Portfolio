import rateLimit, { type RateLimitRequestHandler } from "express-rate-limit";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Global API rate limiter applied to every route.
 */
export const globalRateLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  limit: env.RATE_LIMIT_MAX,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(ApiError.tooManyRequests("Too many requests, please try again later."));
  },
});

/**
 * Stricter limiter for the contact form to prevent spam/abuse.
 */
export const contactRateLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: env.CONTACT_RATE_LIMIT_WINDOW_MS,
  limit: env.CONTACT_RATE_LIMIT_MAX,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(ApiError.tooManyRequests("Too many contact submissions, please try again later."));
  },
});

/**
 * Limiter for the AI chat endpoint to protect against heavy usage/abuse.
 */
export const chatRateLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: env.CHAT_RATE_LIMIT_WINDOW_MS,
  limit: env.CHAT_RATE_LIMIT_MAX,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(ApiError.tooManyRequests("Too many chat requests, please try again later."));
  },
});
