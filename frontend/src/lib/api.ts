/**
 * Resolved backend API base URL.
 *
 * - In development (`vite dev`), always uses the same-origin `/api` prefix
 *   which Vite proxies to the local backend at http://localhost:4000.
 * - In production, uses `VITE_BACKEND_API_URL` if set (e.g. the deployed
 *   backend on Vercel), otherwise falls back to `/api`.
 */
const raw = (import.meta.env.VITE_BACKEND_API_URL as string | undefined)?.trim();
const configured = raw ? raw.replace(/\/+$/, "") : "";

export const API_BASE_URL = import.meta.env.DEV ? "/api" : configured || "/api";
