import { prisma } from "../lib/prisma";
import { logger } from "../lib/logger";

export interface StepOutcome {
  screenshotUrl?: string;
  logs?: string;
}

/**
 * Wraps a single workflow step (e.g. "login", "search_patient") with
 * WorkflowStep bookkeeping: creates the row as RUNNING, then flips it to
 * SUCCESS or FAILED with duration, logs, and (for browser-automation steps)
 * a screenshot — so the timeline UI can render step-by-step progress
 * without the executor needing to know about persistence at all.
 */
export async function runStep<T extends StepOutcome>(
  jobId: string,
  attempt: number,
  name: string,
  fn: () => Promise<T>,
): Promise<T> {
  const step = await prisma.workflowStep.create({
    data: { jobId, name, status: "RUNNING", attempt, startedAt: new Date() },
  });

  const start = Date.now();
  try {
    const result = await fn();
    await prisma.workflowStep.update({
      where: { id: step.id },
      data: {
        status: "SUCCESS",
        finishedAt: new Date(),
        durationMs: Date.now() - start,
        screenshotUrl: result.screenshotUrl,
        logs: result.logs,
      },
    });
    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await prisma.workflowStep.update({
      where: { id: step.id },
      data: {
        status: "FAILED",
        finishedAt: new Date(),
        durationMs: Date.now() - start,
        logs: message,
      },
    });
    logger.warn({ jobId, step: name, err: message }, "Workflow step failed");
    throw err;
  }
}
