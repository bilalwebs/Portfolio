/**
 * Resolved backend API base URL.
 *
 * - In development (`vite dev`), always uses the same-origin `/api` prefix
 *   which Vite proxies to the local backend at http://localhost:4000.
 * - In production, uses `VITE_BACKEND_API_URL` if set (e.g. the deployed
 *   backend on Vercel), otherwise falls back to `/api`.
 *
 * IMPORTANT: The backend runs on Vercel as an api/index.ts serverless
 * function. Vercel automatically strips the /api prefix before forwarding
 * requests to the function. But Express routes are mounted WITH /api
 * (e.g. app.use("/api/chat", ...)). So to make Express see /api/chat,
 * we must send to /api/api/chat — the first /api is for Vercel routing,
 * the second /api matches the Express route.
 */
const raw = (import.meta.env.VITE_BACKEND_API_URL as string | undefined)?.trim();
const configured = raw ? raw.replace(/\/+$/, "") : "";

function resolveBaseUrl(): string {
  if (import.meta.env.DEV) return "/api";
  if (!configured) return "/api";

  // Production Vercel: the base URL must include /api for Vercel routing,
  // PLUS the /api prefix that Express expects.
  // configured = "https://backend.vercel.app/api"
  // We need base = "https://backend.vercel.app/api/api"
  // So chat URL = ".../api/api/chat" → Vercel strips first /api → Express sees /api/chat ✓
  return `${configured}/api`;
}

export const API_BASE_URL = resolveBaseUrl();
