# Muhammad Bilal Hussain — Portfolio

> **AI Engineer | Full-Stack Engineer**

A production-ready monorepo for Bilal's portfolio — a **React + Vite** single-page frontend and a **Node.js + Express** backend API. The site showcases projects, skills, journey, certifications, and recognitions, and ships with a working contact form (with email notifications), an AI-powered portfolio chatbot, and a cyber-blue neon dark theme.

## Repository Structure

```
Bilal_Portfolio/
├── frontend/          # React + Vite SPA (portfolio UI, chatbot widget, contact form)
│   ├── src/           # App source (components, data, styles)
│   ├── public/        # Favicons, resume, static assets
│   └── vercel.json    # Vercel config (root directory: frontend)
├── backend/           # Express + Prisma API (contact, chat, health endpoints)
│   ├── api/           # Vercel serverless entry point
│   ├── Dockerfile     # Future Docker deployment (not used on Vercel)
│   └── docker-compose.yml
├── .dockerignore      # Build context exclusions for the backend Docker image
├── .gitignore
└── README.md
```

- **`frontend/`** — the React + Vite single-page application. See [`frontend/README.md`](frontend/README.md).
- **`backend/`** — the Express + Prisma REST API. It owns the database, validation, rate limiting, and email delivery.

## Getting Started

Prerequisites: **Node.js 20+** and **npm**.

### Frontend

```sh
cd frontend
npm install
npm run dev
```

Starts Vite at http://localhost:5173. In development it proxies `/api/*` to `http://localhost:4000`.

### Backend

```sh
cd backend
npm install
cp .env.example .env   # then fill in your environment variables
npm run dev
```

Starts the API at http://localhost:4000. See [`backend/.env.example`](backend/.env.example) for the required variables (`DATABASE_URL`, Gmail SMTP credentials, and an AI provider).

### Build

```sh
cd frontend && npm run build   # production bundle to frontend/dist/
cd backend  && npm run build   # compile + generate Prisma client
```

## Deployment

The current target is **Vercel**. The frontend and backend are deployed as **two separate Vercel projects** (each deploys its own folder). The production database stays on **Neon PostgreSQL**. Docker files are provided for future portability only.

### Frontend on Vercel

1. Create a new Vercel project and import this repository.
2. Set **Root Directory** to `frontend`.
3. Framework preset auto-detects **Vite**; build command `npm run build`, output directory `dist`.
4. Add the environment variable so the app talks to your deployed backend:

   | Name                    | Example                                            |
   | ----------------------- | -------------------------------------------------- |
   | `VITE_BACKEND_API_URL`  | `https://your-backend-project.vercel.app/api`      |

   > If unset, the frontend falls back to the same-origin `/api` prefix (used by the Vite dev proxy). Set it in **Production**, **Preview**, and **Development** environments.
5. Deploy. The static site is served from `frontend/dist`.

### Backend on Vercel

1. Create a second Vercel project and import the same repository.
2. Set **Root Directory** to `backend`.
3. Build command uses the `vercel-build` script (`npm run sync:portfolio && npm run prisma:generate`). The serverless entry point is `api/index.ts` (see `backend/vercel.json`).

   > **TypeScript version:** `@vercel/node` requires TypeScript **5.x**. The backend pins `typescript` to `~5.9.3` on purpose — TypeScript 7 is incompatible and aborts the serverless build with `Error: Cannot read properties of undefined (reading 'readFile')`. Keep the pin in place.
4. Add all environment variables from [`backend/.env.example`](backend/.env.example) to the Vercel project (Production + Preview). The important ones:

   | Variable              | Description                                           |
   | --------------------- | ----------------------------------------------------- |
   | `DATABASE_URL`        | Your **Neon** PostgreSQL connection string            |
   | `GMAIL_USER`          | Gmail address used as the notification sender         |
   | `GMAIL_APP_PASSWORD`  | Gmail App Password (not the account password)         |
   | `CONTACT_EMAIL`       | Inbox that receives contact notifications             |
   | `AI_PROVIDER` + keys  | Active chat provider (`openai` \| `groq` \| `gemini`) |
   | `CORS_ORIGINS`        | The deployed frontend URL (comma-separated)           |
   | `NODE_ENV`            | `production`                                          |

5. Apply the database schema to Neon:

   ```sh
   cd backend
   npx prisma migrate deploy
   ```

   > During Vercel builds, `DATABASE_URL` must be available. For Neon, prefer the pooled connection string (host ending in `-pooler`) or add `?sslmode=require` to the direct one. `prisma.config.ts` reads it automatically.

6. After both projects are live, point the frontend at the backend by setting `VITE_BACKEND_API_URL` on the frontend project (step 4 above) and redeploy the frontend. Add the frontend URL to the backend's `CORS_ORIGINS`.

**Endpoints** (from the backend project):

| Method | Endpoint      | Description                                                    |
| ------ | ------------- | -------------------------------------------------------------- |
| GET    | `/health`     | Health check (`status: "ok"`, uptime, timestamp, environment)  |
| POST   | `/api/contact`| Create a contact submission and email the owner a notification |
| POST   | `/api/chat`   | Stream a chatbot reply grounded in portfolio data               |

### Future Docker deployment (backend)

Docker is **not** used for the current Vercel deployment. Files live in `backend/` for portability.

- `backend/Dockerfile` — multi-stage production image (build + runtime).
- `backend/docker-compose.yml` — Compose service wired to the same environment variables as Vercel (Neon stays the database; no local DB is started by default).
- `.dockerignore` (repository root) — required because the Docker build context is the repository root (the build reads `frontend/src/data/portfolio.ts` for the chatbot snapshot).

```sh
cd backend
cp .env.example .env      # fill in DATABASE_URL (Neon), SMTP, AI provider
docker compose up -d --build
```

The container runs `node dist/server.js` on port `4000` with `NODE_ENV=production`. Apply migrations before/after startup with `npx prisma migrate deploy`.

### Troubleshooting

| Symptom | Cause & fix |
| ------- | ----------- |
| Backend build fails with `Error: Cannot read properties of undefined (reading 'readFile')` | `@vercel/node` is incompatible with **TypeScript 7**. `backend/package.json` must keep `"typescript": "~5.9.3"`; after changing the version, re-run `npm install` so the lockfile and `node_modules` resolve to 5.x, then redeploy. |

## License

This project is open source and available under the MIT License.

## Author

Built with [React](https://react.dev), [Vite](https://vite.dev), [Tailwind CSS](https://tailwindcss.com), [Express](https://expressjs.com), and [Prisma](https://www.prisma.io).

© Muhammad Bilal Hussain — AI Engineer | Full-Stack Engineer
