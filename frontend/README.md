# Muhammad Bilal Hussain — Portfolio

> **AI Engineer | Full-Stack Engineer**

A modern, production-ready portfolio monorepo with a **React + Vite** single-page frontend and a **Node.js + Express** backend API. The site showcases Bilal's projects, skills, journey, certifications, and recognitions, and ships with a working contact form (with email notifications), an AI-powered portfolio chatbot, and a cyber-blue neon dark theme throughout.

---

## Table of Contents

- [Highlights](#highlights)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Repository Structure](#repository-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Frontend Setup](#1-frontend-setup)
  - [2. Backend Setup](#2-backend-setup)
- [Running in Development](#running-in-development)
- [Scripts](#scripts)
- [API Reference](#api-reference)
- [Contact Flow](#contact-flow)
- [AI Chatbot](#ai-chatbot)
- [Portfolio Data Sync](#portfolio-data-sync)
- [Email Notification Template](#email-notification-template)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [Quality Checks](#quality-checks)
- [Future Improvements](#future-improvements)
- [License](#license)
- [Author](#author)

---

## Highlights

- **Single-page portfolio** — Hero, About, Journey timeline, Skills, Process, Projects, Recognition, Certificates, and Contact sections, all driven by one data file.
- **Fully functional backend** — Express 5 REST API with PostgreSQL persistence via Prisma, input validation, rate limiting, and security hardening.
- **Contact form with email notifications** — Submissions are stored in the database and a **premium HTML notification email** is delivered to the owner's inbox via Gmail SMTP, with reply-to the sender and a one-click "Reply to Sender" button.
- **AI portfolio chatbot** — A floating assistant that answers questions about Bilal using the live portfolio data as context. Provider-agnostic (OpenAI, Groq, or Gemini).
- **Email-safe, responsive design** — The notification email is built with table-based, inline-CSS HTML that renders correctly in Gmail, Outlook, Apple Mail, Yahoo Mail, and mobile clients.

---

## Features

### Frontend

- **Hero Section** — Typewriter role animation, CTA buttons, social links
- **About Section** — Bio, animated stats counters, resume download
- **Journey Timeline** — Alternating cards for education and certifications
- **Skills Grid** — Animated progress bars grouped by category (Frontend, Backend, AI, Tools)
- **Process Section** — 5-step workflow (Discover → Design → Build → Validate → Deploy)
- **Projects Showcase** — Cards with image overlay, preview animation, and tech tags
- **Recognition & Certificates** — Hackathon/award cards and certificate gallery
- **Contact Section** — Info cards + validated form posting to `/api/contact`
- **AI Chatbot** — Floating assistant powered by the AI SDK, posting to `/api/chat`; mobile-responsive composer (input auto-shrinks, send button always visible, message text wraps — no horizontal overflow)
- **Custom Cursor & Preloader** — Neon-accent cursor (desktop) and branded entry animation
- **Responsive + Dark Theme** — Mobile-first layout with a cyber-blue neon aesthetic

### Backend

- `GET /health` — Liveness/health check
- `POST /api/contact` — Validated, rate-limited contact submissions
- `POST /api/chat` — LLM chat with streaming via a configurable AI provider
- **PostgreSQL persistence** — All contact submissions stored via Prisma
- **Email delivery** — Nodemailer (Gmail SMTP) with a redesigned premium HTML notification
- **Security & hardening** — Helmet, CORS, response compression, bounded body limits, global + per-route rate limiting, graceful shutdown

---

## Tech Stack

### Frontend

| Category       | Technology                                             |
| -------------- | ------------------------------------------------------ |
| **Framework**  | React 19 + Vite 8 (SPA)                                |
| **Language**   | TypeScript 5.x (pinned)                                  |
| **Styling**    | Tailwind CSS v4 (`@tailwindcss/vite`) + tw-animate-css  |
| **Animations** | Motion + react-type-animation + custom CSS              |
| **Icons**      | Lucide React                                            |
| **UI Library** | shadcn/ui (Radix primitives)                            |
| **Forms**      | react-hook-form + @hookform/resolvers + sonner toasts   |
| **AI Chat**    | AI SDK (`ai` + `@ai-sdk/react`)                         |
| **Build**      | Vite 8 + vite-tsconfig-paths                            |
| **Linting**    | ESLint 9 + Prettier                                     |
| **Package**    | npm                                                     |

### Backend

| Category              | Technology                                   |
| --------------------- | -------------------------------------------- |
| **Runtime**           | Node.js 20+ (ESM, TypeScript)                |
| **Framework**         | Express 5                                    |
| **Language**          | TypeScript (`tsx` for dev, `tsc` for build)  |
| **Database**          | PostgreSQL via Prisma ORM (Prisma 7 + `@prisma/adapter-pg`) |
| **Email**             | Nodemailer (Gmail SMTP)                      |
| **AI Chat**           | `openai` SDK (provider-agnostic config)      |
| **Validation**        | express-validator                            |
| **Rate Limiting**     | express-rate-limit (global + contact + chat) |
| **Security**          | Helmet, CORS, compression, bounded body size |
| **Build**             | `tsc` + esbuild (for portfolio data sync)    |

---

## Architecture

```
┌─────────────────────────────┐         ┌──────────────────────────────┐
│   Frontend (React + Vite)   │         │   Backend (Express + Prisma) │
│                             │  /api   │                              │
│  src/  →  static SPA (dist) │ ──────► │  POST /api/contact           │
│  /api/*  proxied in dev     │ ◄────── │  POST /api/chat              │
│                             │  JSON   │  GET  /health                │
└─────────────────────────────┘         └──────────────┬───────────────┘
                                                       │
                                          ┌────────────┴────────────┐
                                          │  PostgreSQL             │
                                          │  (contact_submissions)  │
                                          └─────────────────────────┘
                                          ┌─────────────────────────┐
                                          │  Gmail SMTP (Nodemailer)│
                                          │  notification emails    │
                                          └─────────────────────────┘
```

- The frontend is a **static SPA**. During local development, Vite proxies `/api/*` to `http://localhost:4000` (see `vite.config.ts`).
- The backend is a **self-contained Express API**. It owns the database, validation, rate limiting, and email delivery.
- The chatbot runs **server-side on the backend** (unlike the original client-side design) and uses an LLM provider configured via environment variables.

---

## Repository Structure

```
Bilal_Portfolio/
├── frontend/                 # React + Vite single-page app
│   ├── index.html            # HTML entry (SEO/OG/Twitter meta, fonts)
│   ├── package.json          # Frontend package & scripts
│   ├── vite.config.ts        # Vite + React + Tailwind + /api proxy
│   ├── .env.example
│   ├── public/               # Favicons, resume, static assets
│   └── src/
│       ├── assets/           # Images (profile, projects, certificates)
│       ├── components/
│       │   ├── layout/       # Navbar, Footer
│       │   ├── sections/     # Hero, About, Timeline, Skills, Process,
│       │   │                 # Projects, Recognition, Certificates, Contact
│       │   ├── chatbot.tsx   # AI assistant widget
│       │   ├── preloader.tsx # Branded entry animation
│       │   ├── custom-cursor.tsx # Neon cursor (desktop)
│       │   └── ui/           # shadcn/ui components + Section wrapper
│       ├── data/
│       │   └── portfolio.ts  # Single source of truth for all content
│       ├── hooks/            # use-mobile, etc.
│       ├── lib/              # cn() class utility, api.ts (env-driven API base)
│       ├── App.tsx           # Root component (composes every section)
│       ├── main.tsx          # React entry point
│       └── styles.css        # Global styles, Tailwind, theme

backend/                      # Express + Prisma API
├── package.json              # Backend package & scripts
├── tsconfig.json
├── .env.example              # Backend environment template
├── prisma/
│   └── schema.prisma         # ContactSubmission model
├── scripts/
│   ├── generate-portfolio-data.mjs   # Bundles portfolio.ts → JSON snapshot
│   ├── verify-chat.mjs               # Manual chat endpoint smoke test
│   └── verify-multiintent.mjs        # Multi-intent chat verification
└── src/
    ├── app.ts                # Express app (middleware, routes, handlers)
    ├── server.ts             # HTTP server + graceful shutdown
    ├── config/               # env, cors
    ├── controllers/          # health, contact, chat
    ├── services/             # contact, chat, email (Nodemailer + HTML template)
    ├── validators/           # contact, chat
    ├── middlewares/          # validate, rateLimit, error, asyncHandler
    ├── routes/               # index, health, contact, chat
    ├── lib/prisma.ts         # Prisma client (adapter-pg)
    ├── utils/                # ApiResponse, ApiError
    └── generated/            # prisma client + portfolio data snapshot
```

---

## Getting Started

### Prerequisites

- **Node.js 20+** ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- **npm**
- **PostgreSQL** (local instance or a hosted service such as Neon/Supabase)

### 1. Frontend Setup

```sh
git clone <repository-url>
cd Bilal_Portfolio/frontend
npm install
```

No environment variables are required for the frontend. In development it proxies `/api/*` to `http://localhost:4000`.

### 2. Backend Setup

```sh
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env` and fill in at minimum:

- `DATABASE_URL` — your PostgreSQL connection string
- `GMAIL_USER` + `GMAIL_APP_PASSWORD` — Gmail account + [App Password](https://myaccount.google.com/apppasswords) used to send contact notifications
- `CONTACT_EMAIL` — the inbox that receives contact notifications
- One AI provider block (`AI_PROVIDER=openai|groq|gemini` + its `API_KEY`/`BASE_URL`/`MODEL`)

Then prepare the database:

```sh
cd backend
npx prisma migrate dev   # create the schema in your local DB
```

---

## Running in Development

Frontend (http://localhost:5173):

```sh
cd frontend
npm run dev
```

Backend (http://localhost:4000):

```sh
cd backend
npm run dev
```

`npm run dev` in the backend first runs the portfolio data sync (`predev`), then starts the API with `tsx watch`. Open http://localhost:5173 and the frontend proxies `/api/*` to the backend automatically.

---

## Scripts

### Frontend

| Script              | Description                              |
| ------------------- | ---------------------------------------- |
| `npm run dev`       | Start Vite dev server with HMR           |
| `npm run build`     | Build the production bundle to `dist/`   |
| `npm run build:dev` | Build in development mode                |
| `npm run preview`   | Preview the production build locally     |
| `npm run lint`      | Run ESLint across all source files       |
| `npm run format`    | Format code with Prettier                |

### Backend

| Script                          | Description                                         |
| ------------------------------- | --------------------------------------------------- |
| `npm run dev`                   | Start the API with `tsx watch` (auto-syncs portfolio data) |
| `npm run build`                 | Generate Prisma client + typecheck and compile to `dist/` |
| `npm run start`                 | Run the compiled server from `dist/`                |
| `npm run preview`               | Build and start                                     |
| `npm run typecheck`             | Type-check without emitting (`tsc --noEmit`)        |
| `npm run sync:portfolio`        | Regenerate the chatbot portfolio snapshot            |
| `npm run prisma:generate`       | Generate the Prisma client                          |
| `npm run prisma:migrate`        | Create/apply migrations in dev                      |
| `npm run prisma:deploy`         | Apply migrations in production                      |
| `npm run prisma:studio`         | Open Prisma Studio                                  |

---

## API Reference

| Method | Endpoint      | Description                                                    |
| ------ | ------------- | -------------------------------------------------------------- |
| GET    | `/health`     | Health check (`status: "ok"`, uptime, timestamp, environment)  |
| POST   | `/api/contact`| Create a contact submission and email the owner a notification |
| POST   | `/api/chat`   | Stream a chatbot reply grounded in portfolio data               |

**`POST /api/contact`** request body:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "subject": "Job opportunity",
  "message": "Hi Bilal, we'd love to work with you."
}
```

Responses: `202` with `{ accepted, trackingId, provider }` on success; `422` for validation errors; `429` when rate-limited; `502` if the notification email could not be delivered (the submission is still saved).

---

## Contact Flow

1. The visitor submits the form on the frontend → `POST /api/contact`.
2. The request passes validation (`express-validator`) and a strict anti-spam rate limiter.
3. The submission is persisted to the `contact_submissions` table via Prisma.
4. A **notification email** is sent to `CONTACT_EMAIL` via Gmail SMTP:
   - Reply-To is set to the visitor's email so the owner can reply in-place.
   - The email includes a tracking/reference ID, submission time, and a "Reply to Sender" button that opens a pre-addressed `mailto:`.
5. The API returns the stored row's id as the `trackingId`.
6. If email delivery fails, the submission remains saved and a `502` is returned so the client can inform the user.

---

## AI Chatbot

The floating chatbot answers questions about Bilal's background, skills, projects, education, and contact details. How it works:

- The frontend streams requests to `POST /api/chat` using the AI SDK.
- The backend injects the **live portfolio data snapshot** as context (generated from `src/data/portfolio.ts`), with a token budget (`PROMPT_BUDGET_TOKENS`) that trims large contexts before each request.
- The provider is configured entirely through environment variables:

| Provider | Variables                                                |
| -------- | -------------------------------------------------------- |
| `openai` | `OPENAI_API_KEY`, `OPENAI_BASE_URL`, `OPENAI_MODEL`       |
| `groq`   | `GROQ_API_KEY`, `GROQ_BASE_URL`, `GROQ_MODEL`             |
| `gemini` | `GEMINI_API_KEY`, `GEMINI_BASE_URL`, `GEMINI_MODEL`       |

Set `AI_PROVIDER` to the active provider; only that provider's variables are required. Changing providers requires no code changes.

The composer is fully responsive on mobile (320–480px): the input auto-shrinks with `min-width: 0` to whatever space is available, the send button keeps a fixed size and stays visible, and message text wraps so nothing overflows horizontally.

---

## Portfolio Data Sync

The chatbot is always in sync with the portfolio content:

```sh
cd backend
npm run sync:portfolio
```

`scripts/generate-portfolio-data.mjs` bundles `frontend/src/data/portfolio.ts` with esbuild, executes it under Node (stubbing image imports), and writes a plain JSON snapshot to `backend/src/generated/portfolio.data.ts`. The chat service reads from that snapshot. This runs automatically as a `predev`/`prebuild` hook — edit `frontend/src/data/portfolio.ts` and the assistant picks up the changes on the next sync/build.

> **Note:** `backend/src/generated/` is auto-generated. Do not edit it manually.

---

## Email Notification Template

When a contact submission arrives, the owner receives a modern, recruiter-friendly HTML notification built in `backend/src/services/email.service.ts`:

- **Branded header** — MBH monogram, name, role, and a "Portfolio Contact Notification" badge
- **Contact details card** — Name, email, and subject with muted labels
- **Highlighted message block** — the visitor's message with a cyan accent border, proper whitespace handling, and long-URL wrapping
- **Submission details** — Reference ID, submission time (UTC), and source
- **Reply to Sender** — a pill-shaped button that opens a pre-addressed `mailto:` to the visitor
- **Clean footer** — auto-generated notice, no-reply guidance, and copyright

The template is **email-safe HTML**: table-based layout, inline CSS, no JavaScript, no external fonts/images, and fully responsive from desktop to mobile clients (Gmail, Outlook, Apple Mail, Yahoo Mail). The companion plain-text body is preserved for clients that don't render HTML.

---

## Deployment

The current target is **Vercel**, where the frontend and backend are **separate projects**. This frontend is a static SPA; see the [root README](../README.md#deployment) for the full end-to-end walkthrough.

### Frontend on Vercel (static SPA)

1. Create a Vercel project from this repository with **Root Directory** set to `frontend`.
2. Framework preset auto-detects **Vite**; build command `npm run build`, output directory `dist`.
3. Set `VITE_BACKEND_API_URL` to the deployed backend URL, e.g. `https://your-backend-project.vercel.app/api` (see [Environment Variables](#environment-variables)).
4. Deploy. `vercel.json` in this folder keeps the Vite defaults for the SPA.

```sh
npm run build          # production bundle to dist/
```

### Backend on Vercel (Node API)

See the [root README](../README.md#deployment). In short: a second Vercel project with Root Directory `backend`, using the `vercel-build` script and the `api/index.ts` serverless entry; all configuration comes from the project's environment variables (`DATABASE_URL` → Neon, Gmail SMTP, AI provider, `CORS_ORIGINS`).

> The backend pins `typescript` to `~5.9.3`: `@vercel/node` is incompatible with TypeScript 7 and fails the build with `Cannot read properties of undefined (reading 'readFile')`.

> **Note:** In production the app sets `trust proxy` so rate limiting and `req.ip` behave correctly behind load balancers/proxies.

---

## Environment Variables

The frontend needs **no** environment variables in development. On Vercel, add one optional variable so the deployed SPA talks to the backend:

| Variable               | Required | Description                                                                 |
| ---------------------- | -------- | --------------------------------------------------------------------------- |
| `VITE_BACKEND_API_URL` | –        | Absolute base URL of the deployed backend, e.g. `https://your-backend.vercel.app/api`. Unset → same-origin `/api` (Vite dev proxy). |

The backend is configured via `backend/.env` (see `backend/.env.example`):

| Variable                    | Required | Description                                              |
| --------------------------- | -------- | -------------------------------------------------------- |
| `DATABASE_URL`              | ✓        | PostgreSQL connection string used by Prisma              |
| `GMAIL_USER`                | ✓        | Gmail address used as the notification sender            |
| `GMAIL_APP_PASSWORD`        | ✓        | Gmail App Password (not the account password)            |
| `CONTACT_EMAIL`             | ✓        | Inbox that receives contact notifications                |
| `AI_PROVIDER`               | ✓        | Active chat provider: `openai`, `groq`, or `gemini`      |
| `OPENAI_API_KEY` / `OPENAI_BASE_URL` / `OPENAI_MODEL` | * | OpenAI provider credentials        |
| `GROQ_API_KEY` / `GROQ_BASE_URL` / `GROQ_MODEL`      | * | Groq provider credentials            |
| `GEMINI_API_KEY` / `GEMINI_BASE_URL` / `GEMINI_MODEL` | * | Gemini provider credentials          |
| `NODE_ENV`                  | –        | `development` (default) or `production`                  |
| `HOST` / `PORT`             | –        | Server bind address/port (default `0.0.0.0:4000`)        |
| `CORS_ORIGINS`              | –        | Comma-separated allowed origins (default `http://localhost:5173`) |
| `RATE_LIMIT_WINDOW_MS` / `RATE_LIMIT_MAX` | –    | Global rate limit window/count                           |
| `CONTACT_RATE_LIMIT_WINDOW_MS` / `CONTACT_RATE_LIMIT_MAX` | – | Stricter contact-form anti-spam limits |
| `CHAT_RATE_LIMIT_WINDOW_MS` / `CHAT_RATE_LIMIT_MAX` | – | Chat endpoint limits                    |
| `PROMPT_BUDGET_TOKENS`      | –        | Max prompt tokens for the chatbot context (default `6000`) |

_\* Only the variables for the provider selected by `AI_PROVIDER` are required._

---

## Quality Checks

```sh
# Frontend
npm run lint          # ESLint
npm run format        # Prettier

# Backend
cd backend && npm run typecheck
```

`npm run build` in the backend also runs the TypeScript compiler, so a clean build doubles as a full type check.

---

## Future Improvements

- [ ] Live deployment URL for the portfolio
- [ ] Replace placeholder project/social links with final URLs
- [ ] Image optimization (WebP/AVIF, responsive `srcset`)
- [ ] Remove unused shadcn/ui components to slim the bundle
- [ ] Automated test suite for the backend (unit + integration)
- [ ] Admin dashboard to manage contact submissions
- [ ] Accessibility audit and improvements
- [ ] Internationalization (i18n) support

---

## License

This project is open source and available under the MIT License.

---

## Author

Built with [React](https://react.dev), [Vite](https://vite.dev), [Tailwind CSS](https://tailwindcss.com), [Express](https://expressjs.com), and [Prisma](https://www.prisma.io).

© Muhammad Bilal Hussain — AI Engineer | Full-Stack Engineer
