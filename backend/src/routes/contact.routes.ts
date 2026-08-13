import { Router } from "express";
import { contactController } from "../controllers/contact.controller.js";
import { contactRules } from "../validators/contact.validator.js";
import { validate } from "../middlewares/validate.js";
import { contactRateLimiter } from "../middlewares/rateLimit.js";

export const contactRoutes: Router = Router();

contactRoutes.post(
  "/",
  contactRateLimiter,
  validate(contactRules),
  contactController.submit,
);
