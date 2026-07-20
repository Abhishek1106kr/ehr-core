import { Queue } from "bullmq";
import { redisConnection } from "../lib/redis";
import type { WorkflowJobData } from "./types";

export const WORKFLOW_QUEUE_NAME = "workflow-engine";

export const workflowQueue = new Queue<WorkflowJobData>(WORKFLOW_QUEUE_NAME, {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 2000 },
    removeOnComplete: { age: 24 * 60 * 60, count: 500 },
    removeOnFail: false, // keep failed jobs visible for the dead-letter view
  },
});
