import IORedis from "ioredis";
import { env } from "../config/env";
import { logger } from "./logger";

// BullMQ requires maxRetriesPerRequest: null on the connection it's given —
// it manages its own retry/backoff semantics on top of a raw connection.
export const redisConnection = new IORedis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

// Without a listener, ioredis connection errors become unhandled 'error'
// events that crash the process — log instead, so a temporarily-down Redis
// degrades workflow enqueueing without taking down the whole API.
redisConnection.on("error", (err) => {
  logger.warn({ err: err.message }, "Redis connection error");
});
