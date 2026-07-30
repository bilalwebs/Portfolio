# Bilal Hussain — Portfolio

> Full-Stack Engineer & UI Architect

A modern, single-page portfolio website built with **TanStack Start**, **React 19**, and **Tailwind CSS v4**. Features a cyber-blue neon dark theme, interactive AI chatbot assistant, and SSR-powered performance.

---

## Live Demo

[Live Demo](https://your-demo-url.vercel.app) — _placeholder, update with your actual deployment URL_

---

## Features

- **Hero Section** — Typewriter role animation, CTA buttons, social links
- **About Section** — Bio, stats counters, resume download
- **Journey Timeline** — Alternating card layout with icons for education, experience, achievements
- **Skills Grid** — Animated progress bars grouped by category (Frontend, Backend, AI, Tools)
- **Process Section** — 5-step workflow (Discover → Design → Build → Validate → Deploy)
- **Projects Showcase** — Cards with image overlay, live preview animation, tech tags
- **Recognition** — Hackathon wins, Kaggle rankings, awards
- **Certificates** — Certificate cards with hover-reveal view action
- **Contact Section** — Contact info cards + form (UI only, no backend)
- **AI Chatbot** — Floating assistant powered by Vercel AI SDK + Lovable AI Gateway
- **Custom Cursor** — Neon-accent cursor on desktop
- **Preloader Animation** — Branded entry animation
- **Responsive Design** — Mobile-first with responsive navigation
- **SSR** — Server-side rendering with robust error handling
- **Dark Theme** — Cyber-blue neon aesthetic throughout

---

## Tech Stack

| Category             | Technology                                 |
| -------------------- | ------------------------------------------ |
| **Framework**  | TanStack Start (React 19 + Vite 8 + Nitro) |
| **Routing**    | TanStack Router (file-based)               |
| **State**      | TanStack Query (React Query)               |
| **Language**   | TypeScript 5.8                             |
| **Styling**    | Tailwind CSS v4 + tw-animate-css           |
| **Animations** | Motion (React) + Custom CSS                |
| **Icons**      | Lucide React                               |
| **UI Library** | shadcn/ui (Radix primitives)               |
| **AI Chat**    | Vercel AI SDK + @ai-sdk/openai-compatible  |
| **AI Gateway** | Lovable AI Gateway                         |
| **Form**       | react-hook-form + zod                      |
| **Build**      | Vite 8 + Nitro 3                           |
| **Linting**    | ESLint 9 + Prettier                        |
| **Package**    | npm / bun                                  |

---

## Project Architecture

```
TanStack Start (SSR)
├── Vite 8 — Build tool
├── TanStack Router — File-based routing
├── TanStack Query — Server state management
├── Nitro — Server engine (Cloudflare-compatible)
└── Lovable Config — Preconfigured plugin stack
```

The application is structured as a **single-page portfolio** where all sections are rendered on the `/` route. An API route at `/api/chat` handles AI chat requests server-side using the Lovable AI Gateway.

---

## Folder Structure

```
src/
├── assets/              # Static images (profile, projects, certificates)
├── components/
│   ├── layout/          # Navbar, Footer
│   ├── sections/        # Hero, About, Timeline, Skills, Process, Projects,
│   │                    # Recognition, Certificates, Contact
│   └── ui/              # shadcn/ui components + custom Section wrapper
├── data/
│   └── portfolio.ts     # All portfolio content data
├── hooks/
│   └── use-mobile.tsx   # Mobile detection hook
├── lib/
│   ├── utils.ts         # cn() Tailwind class merge utility
│   ├── error-capture.ts # SSR error capture & console.error wrapping
│   ├── error-page.ts    # SSR error page HTML renderer
│   ├── lovable-error-reporting.ts  # Lovable editor telemetry
│   └── ai-gateway.server.ts # AI Gateway OpenAPI-compatible provider
├── routes/
│   ├── __root.tsx       # Root layout, 404, error boundary
│   ├── index.tsx        # Homepage (all sections)
│   └── api/chat.ts      # AI Chat POST endpoint
├── router.tsx           # Router + QueryClient factory
├── routeTree.gen.ts     # Auto-generated route tree
├── server.ts            # SSR entry point with error normalization
├── start.ts             # TanStack Start instance + error middleware
└── styles.css           # Global styles, Tailwind, theme, utilities
```

---

## Installation

### Prerequisites

- **Node.js** 20+ ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- **npm** or **bun**

### Clone & Install

```sh
git clone <repository-url>
cd Bilal_Portfolio
npm install
```

---

## Running the Project

### Development

```sh
npm run dev
```

Starts the Vite dev server with HMR at `http://localhost:5173`.

### Production Preview

```sh
npm run build
npm run preview
```

---

## Available Scripts

| Script                | Description                        |
| --------------------- | ---------------------------------- |
| `npm run dev`       | Start development server with HMR  |
| `npm run build`     | Build for production               |
| `npm run build:dev` | Build in development mode          |
| `npm run preview`   | Preview production build locally   |
| `npm run lint`      | Run ESLint across all source files |
| `npm run format`    | Format code with Prettier          |

---

## Environment Variables

| Variable            | Required          | Description                        |
| ------------------- | ----------------- | ---------------------------------- |
| `LOVABLE_API_KEY` | Yes (for chatbot) | API key for the Lovable AI Gateway |

Create a `.env` file in the project root or set the variable in your deployment environment.

---

## Build Instructions

```sh
npm run build
```

The output is written to `.output/` (Nitro server build) and `dist/` (client build). The production server runs on the Nitro engine, compatible with Cloudflare Pages, Vercel, and Node.js environments.

---

## Deployment

### Deploy to Vercel

1. Push the repository to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Set the `LOVABLE_API_KEY` environment variable in Vercel's dashboard.
4. Deploy — Vercel auto-detects the framework.

The project is preconfigured for Vercel deployment via the `@tanstack/react-start` + Nitro server engine.

---

## Dependencies Overview

### Core

- `react` / `react-dom` — v19.2
- `@tanstack/react-start` — SSR meta-framework
- `@tanstack/react-router` — File-based routing
- `@tanstack/react-query` — Server state management

### UI & Styling

- `tailwindcss` — v4 (utility-first CSS)
- `motion` — Animation library
- `lucide-react` — Icon library
- `@radix-ui/*` — Accessible UI primitives (via shadcn/ui)
- `class-variance-authority` / `clsx` / `tailwind-merge` — Class utilities

### AI Chat

- `ai` / `@ai-sdk/react` — Vercel AI SDK
- `@ai-sdk/openai-compatible` — OpenAI-compatible provider
- `@lovable.dev/vite-tanstack-config` — Lovable plugin config

---

## Project Structure Explanation

- **`src/data/portfolio.ts`** — Central data file. Edit this to update all portfolio content (name, bio, skills, projects, etc.).
- **`src/components/sections/`** — One component per page section. Each reads from `portfolio.ts`.
- **`src/components/ui/section.tsx`** — Reusable section wrapper with consistent heading/styling patterns.
- **`src/lib/error-capture.ts`** — Patches `console.error` and captures global errors for SSR recovery.
- **`src/server.ts`** — Server entry point that intercepts swallowed SSR errors and renders a fallback page.
- **`src/routes/__root.tsx`** — Root layout with `<head>`, 404 page, error boundary, and `QueryClientProvider`.

---

## Future Improvements

- [ ] Contact form backend integration (EmailJS, Resend, or Nodemailer)
- [ ] Replace placeholder links with actual GitHub/social profiles
- [ ] Resume/CV download endpoint
- [ ] Add `.env.example` file
- [ ] Lazy-load sections below the fold
- [ ] Image optimization (WebP/AVIF, responsive srcset)
- [ ] Remove unused shadcn/ui components to reduce bundle size
- [ ] Add unit and integration tests
- [ ] Accessibility audit and improvements
- [ ] Internationalization (i18n) support

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

## Author

Built with [TanStack Start](https://tanstack.com/start) and [Lovable](https://lovable.dev).

For questions or collaboration:
