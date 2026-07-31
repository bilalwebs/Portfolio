import { app } from "./app.js";
import { env } from "./config/env.js";

const server = app.listen(env.PORT, env.HOST, () => {
  console.log(
    `[server] running in ${env.NODE_ENV} mode on http://${env.HOST}:${env.PORT}`,
  );
  console.log(`[server] endpoints: GET /health, POST /api/contact, POST /api/chat`);
});

// --- Graceful shutdown ---
const SHUTDOWN_TIMEOUT_MS = 10_000;

const shutdown = (signal: NodeJS.Signals): void => {
  console.log(`[server] ${signal} received, shutting down gracefully...`);

  const forceExit = setTimeout(() => {
    console.error("[server] graceful shutdown timed out, forcing exit");
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS);
  forceExit.unref();

  server.close((error) => {
    if (error) {
      console.error("[server] error during shutdown", error);
      process.exit(1);
    }
    console.log("[server] all connections closed, exiting");
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
