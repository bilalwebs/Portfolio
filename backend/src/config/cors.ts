import type { CorsOptions } from "cors";
import { env } from "./env.js";
import { ApiError } from "../utils/ApiError.js";

export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    // Allow same-origin / non-browser requests (e.g. curl, health checks).
    if (!origin || env.CORS_ORIGINS.includes(origin)) {
      callback(null, true);
      return;
    }
    // Passing an ApiError routes through the global error handler,
    // which returns a clean 403 instead of a 500.
    callback(ApiError.forbidden("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 86400,
};
