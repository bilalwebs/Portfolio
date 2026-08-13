# syntax=docker/dockerfile:1

# -----------------------------------------------------------------------------
# Bilal Portfolio — Backend
# Future Docker deployment (current target is Vercel serverless, not Docker).
#
# The build context MUST be the repository root because the backend build
# reads the portfolio snapshot source at `frontend/src/data/portfolio.ts`:
#
#   docker build -f backend/Dockerfile .
#   (or `docker compose up --build` from backend/, see docker-compose.yml)
# -----------------------------------------------------------------------------

# --- Build stage -------------------------------------------------------------
FROM node:20-alpine AS build
WORKDIR /repo

# Install dependencies first (better layer caching).
COPY backend/package.json backend/package-lock.json ./backend/
WORKDIR /repo/backend
RUN npm ci

# Copy the rest of the repository (node_modules/dist are excluded via
# the root .dockerignore).
WORKDIR /repo
COPY . .

# Generate the Prisma client + portfolio snapshot, then compile TypeScript.
# `prebuild` (sync:portfolio) and `build` (prisma generate + tsc) run here.
WORKDIR /repo/backend
RUN npm run build

# Remove dev dependencies so the runtime image ships production deps only.
RUN npm prune --omit=dev

# --- Runtime stage ------------------------------------------------------------
FROM node:20-alpine AS runtime

# openssl keeps the image ready for Prisma engine operations if ever needed.
# The `node` user/group already exists in the node:alpine base image.
RUN apk add --no-cache openssl \
  && mkdir -p /app \
  && chown -R node:node /app

ENV NODE_ENV=production
WORKDIR /app

COPY --from=build --chown=node:node /repo/backend/package.json ./
COPY --from=build --chown=node:node /repo/backend/node_modules ./node_modules
COPY --from=build --chown=node:node /repo/backend/dist ./dist

USER node
EXPOSE 4000

CMD ["node", "dist/server.js"]
