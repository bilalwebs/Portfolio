import express, { type Express } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";
import { corsOptions } from "./config/cors.js";
import { isProduction } from "./config/env.js";
import { apiRoutes } from "./routes/index.js";
import { notFoundHandler, errorHandler } from "./middlewares/error.js";
import { globalRateLimiter } from "./middlewares/rateLimit.js";

export const app: Express = express();

// Trust the first proxy hop (load balancer / reverse proxy) in production
// so req.ip and rate limiting behave correctly behind Vercel/Railway/NGINX.
if (isProduction) {
  app.set("trust proxy", 1);
}

// --- Security & hardening ---
app.use(helmet());

// --- Cross-origin resource sharing ---
app.use(cors(corsOptions));

// --- Response compression (gzip/brotli) ---
app.use(compression());

// --- Request body parsing (bounded payload size) ---
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// --- Request logging ---
app.use(morgan(isProduction ? "combined" : "dev"));

// --- Global rate limiting ---
app.use(globalRateLimiter);

// --- API routes ---
app.use(apiRoutes);

// --- 404 handler (must come after all routes) ---
app.use(notFoundHandler);

// --- Global error handler (must be last) ---
app.use(errorHandler);
