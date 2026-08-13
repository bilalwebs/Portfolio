/**
 * Resolved backend API base URL.
 *
 * - When `VITE_BACKEND_API_URL` is set (e.g. the deployed backend on Vercel),
 *   API calls go directly to that origin.
 * - Otherwise it falls back to the same-origin `/api` prefix, which Vite
 *   proxies to the backend during local development (see vite.config.ts).
 */
const raw = (import.meta.env.VITE_BACKEND_API_URL as string | undefined)?.trim();

export const API_BASE_URL = (raw ? raw.replace(/\/+$/, "") : "") || "/api";
