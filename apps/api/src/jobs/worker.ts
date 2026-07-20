import "../config/env";
import { Worker, type Job } from "bullmq";
import { redisConnection } from "../lib/redis";
import { prisma } from "../lib/prisma";
import { logger } from "../lib/logger";
import { recordAuditLog } from "../services/auditLog.service";
import { WORKFLOW_QUEUE_NAME } from "./queue";
import { executeAppointmentBooking } from "./executors/appointmentBooking.executor";
import { executeInsuranceVerification } from "./executors/insuranceVerification.executor";
import { executePatientLookup } from "./executors/patientLookup.executor";
import type { WorkflowJobData } from "./types";

async function process(job: Job<WorkflowJobData>) {
  const data = job.data;
  const attempt = job.attemptsMade + 1;

  await prisma.automationJob.update({
    where: { id: data.automationJobId },
    data: { status: "RUNNING", attempt, startedAt: new Date() },
  });

  const start = Date.now();
  try {
    let output: unknown;
    switch (data.type) {
      case "APPOINTMENT_BOOKING":
        output = await executeAppointmentBooking(data, attempt);
        break;
      case "INSURANCE_VERIFICATION":
        output = await executeInsuranceVerification(data, attempt);
        break;
      case "PATIENT_LOOKUP":
        output = await executePatientLookup(data, attempt);
        break;
      default:
        throw new Error(`No executor registered for workflow type "${data.type}"`);
    }

    const durationMs = Date.now() - start;
    await prisma.automationJob.update({
      where: { id: data.automationJobId },
      data: { status: "SUCCESS", output: output as never, finishedAt: new Date(), durationMs },
    });

    await recordAuditLog({
      actorLabel: "Automation Engine",
      action: `workflow.${data.type.toLowerCase()}.completed`,
      entityType: "AutomationJob",
      entityId: data.automationJobId,
      after: output,
      durationMs,
      correlationId: data.correlationId,
      traceId: data.correlationId,
    });

    return output;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const willRetry = attempt < job.opts.attempts!;

    await prisma.automationJob.update({
      where: { id: data.automationJobId },
      data: {
        status: willRetry ? "RETRYING" : "FAILED",
        error: message,
        durationMs: Date.now() - start,
        ...(!willRetry && { finishedAt: new Date() }),
      },
    });

    throw err;
  }
}

export function startWorker() {
  const worker = new Worker<WorkflowJobData>(WORKFLOW_QUEUE_NAME, process, {
    connection: redisConnection,
    concurrency: 4,
  });

  worker.on("completed", (job) => {
    logger.info({ jobId: job.id, type: job.data.type }, "Workflow job completed");
  });

  worker.on("failed", async (job, err) => {
    if (!job) return;
    logger.error({ jobId: job.id, type: job.data.type, err: err.message }, "Workflow job failed");

    // Final failure (all attempts exhausted) — move to the dead-letter state.
    if (job.attemptsMade >= (job.opts.attempts ?? 1)) {
      await prisma.automationJob
        .update({
          where: { id: job.data.automationJobId },
          data: { status: "DEAD_LETTER", finishedAt: new Date() },
        })
        .catch((updateErr) =>
          logger.error({ updateErr }, "Failed to mark automation job as dead-lettered"),
        );
    }
  });

  logger.info("Workflow worker started, listening on queue: %s", WORKFLOW_QUEUE_NAME);
  return worker;
}

if (require.main === module) {
  startWorker();
}
