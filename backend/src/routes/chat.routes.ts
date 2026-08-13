import { Router } from "express";
import { chatController } from "../controllers/chat.controller.js";
import { chatRules } from "../validators/chat.validator.js";
import { validate } from "../middlewares/validate.js";
import { chatRateLimiter } from "../middlewares/rateLimit.js";

export const chatRoutes: Router = Router();

chatRoutes.post("/", chatRateLimiter, validate(chatRules), chatController.stream);
