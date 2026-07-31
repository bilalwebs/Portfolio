# Bilal Hussain — Portfolio

> AI Engineer & Full-Stack Developer

A modern, single-page portfolio website built with **React 19**, **Vite 8**, and **Tailwind CSS v4**. Features a cyber-blue neon dark theme, interactive AI chatbot assistant, and a fully responsive, mobile-first layout.

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
- **Contact Section** — Contact info cards + form (posts to `/api/contact`)
- **AI Chatbot** — Floating assistant powered by Vercel AI SDK (client-side, posts to `/api/chat`)
- **Custom Cursor** — Neon-accent cursor on desktop
- **Preloader Animation** — Branded entry animation
- **Responsive Design** — Mobile-first with responsive navigation
- **Dark Theme** — Cyber-blue neon aesthetic throughout

---

## Tech Stack

| Category          | Technology                                   |
| ----------------- | -------------------------------------------- |
| **Framework**     | React 19 + Vite 8 (SPA)                      |
| **Language**      | TypeScript 5.8                               |
| **Styling**       | Tailwind CSS v4 + tw-animate-css             |
| **Animations**    | Motion (React) + Custom CSS                  |
| **Icons**         | Lucide React                                 |
| **UI Library**    | shadcn/ui (Radix primitives)                 |
| **AI Chat**       | Vercel AI SDK (`ai` + `@ai-sdk/react`)       |
| **Form**          | react-hook-form + @hookform/resolvers        |
| **Build**         | Vite 8                                       |
| **Linting**       | ESLint 9 + Prettier                          |
| **Package**       | npm                                          |

---

## Project Architecture

```
React + Vite (SPA)
├── Vite 8 — Build tool + dev server
├── React 19 — UI framework
├── Tailwind CSS v4 — Styling (@tailwindcss/vite)
├── react-dom/client — Client-side rendering (src/main.tsx)
└── Static output — dist/ (hostable on any static host)
```

The application is a **frontend-only single-page portfolio**. All sections render on the root route via `src/App.tsx`. The chatbot and contact form call the `/api/chat` and `/api/contact` endpoints respectively; these are **expected to be provided by an external backend or the deployment platform** — no server code lives in this repository.

---

## Folder Structure

```
index.html            # HTML entry point (meta tags, fonts, #root mount)
src/
├── assets/           # Static images (profile, projects, certificates)
├── components/
│   ├── layout/       # Navbar, Footer
│   ├── sections/     # Hero, About, Timeline, Skills, Process, Projects,
│   │                 # Recognition, Certificates, Contact
│   ├── chatbot.tsx   # AI assistant widget (client-side)
│   └── ui/           # shadcn/ui components + custom Section wrapper
├── data/
│   └── portfolio.ts  # All portfolio content data
├── hooks/
│   └── use-mobile.tsx# Mobile detection hook
├── lib/
│   └── utils.ts      # cn() Tailwind class merge utility
├── App.tsx           # Root component (composes all sections)
├── main.tsx          # React entry point (createRoot)
├── vite-env.d.ts     # Vite client type references
└── styles.css        # Global styles, Tailwind, theme, utilities
```

---

## Installation

### Prerequisites

- **Node.js** 20+ ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- **npm**

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

## Build Instructions

```sh
npm run build
```

The production build is written to `dist/` and consists of static HTML, CSS, and JavaScript — deployable to any static host.

---

## Deployment

### Deploy to Vercel

1. Push the repository to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Set the **build command** to `npm run build` and the **output directory** to `dist`.
4. Deploy — Vercel serves the static SPA.

> **Note:** The contact form (`/api/contact`) and chatbot (`/api/chat`) call backend endpoints. If you host those APIs elsewhere, configure a rewrite/proxy from `/api/*` to your backend in your hosting platform.

---

## Environment Variables

The frontend build requires **no environment variables**. The `.env.example` file documents variables used by the external backend:

| Variable       | Description                                    |
| -------------- | ---------------------------------------------- |
| `RESEND_API_KEY` | Resend API key for the contact form backend  |
| `CONTACT_EMAIL`  | Recipient email for contact form submissions |

---

## Dependencies Overview

### Core

- `react` / `react-dom` — v19.2
- `vite` — v8 build tool and dev server

### UI & Styling

- `tailwindcss` — v4 (utility-first CSS)
- `motion` — Animation library
- `lucide-react` — Icon library
- `@radix-ui/*` — Accessible UI primitives (via shadcn/ui)
- `class-variance-authority` / `clsx` / `tailwind-merge` — Class utilities

### AI Chat

- `ai` / `@ai-sdk/react` — Vercel AI SDK (client-side)

---

## Project Structure Explanation

- **`src/data/portfolio.ts`** — Central data file. Edit this to update all portfolio content (name, bio, skills, projects, etc.).
- **`src/components/sections/`** — One component per page section. Each reads from `portfolio.ts`.
- **`src/components/ui/section.tsx`** — Reusable section wrapper with consistent heading/styling patterns.
- **`src/App.tsx`** — Root component that composes every section, plus the preloader, custom cursor, and chatbot.
- **`src/main.tsx`** — Mounts the React app into `#root` and imports the global stylesheet.
- **`index.html`** — HTML entry point containing all `<head>` metadata (SEO, Open Graph, Twitter cards) and the Google Fonts stylesheets.

---

## Future Improvements

- [ ] Backend for the contact form and chatbot (`/api/contact`, `/api/chat`)
- [ ] Replace placeholder links with actual GitHub/social profiles
- [ ] Resume/CV download endpoint
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

Built with [React](https://react.dev) + [Vite](https://vite.dev) and [Tailwind CSS](https://tailwindcss.com).
