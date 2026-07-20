import { createApp } from "./app";
import { env } from "./config/env";
import { logger } from "./lib/logger";

const app = createApp();

const server = app.listen(env.PORT, "0.0.0.0", () => {
  logger.info(`OpenEHR Bridge API listening on 0.0.0.0:${env.PORT}`);
  logger.info(`Swagger docs available at http://0.0.0.0:${env.PORT}/api/docs`);
});

function shutdown(signal: string) {
  logger.info(`Received ${signal}, shutting down gracefully`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
