import { randomUUID } from "crypto";
import { prisma } from "../lib/prisma";
import { workflowQueue } from "../jobs/queue";
import type { WorkflowJobData, WorkflowPayload } from "../jobs/types";
import type { IntegrationMode, WorkflowType } from "@openehr-bridge/shared";

/**
 * Picks the integration path for a workflow: prefer a FHIR REST integration
 * if the organization has one enabled, otherwise fall back to browser
 * automation. This is the "Integration Engine" switch described in the
 * project brief — callers can still force a mode (used by the demo trigger
 * in the UI so both paths are easy to showcase).
 */
export async function chooseIntegrationMode(
  organizationId: string,
  forced?: IntegrationMode,
): Promise<IntegrationMode> {
  if (forced) return forced;

  const fhirIntegration = await prisma.integration.findFirst({
    where: { organizationId, mode: "FHIR_REST", isEnabled: true },
  });

  return fhirIntegration ? "FHIR_REST" : "BROWSER_AUTOMATION";
}

export interface EnqueueWorkflowInput {
  type: WorkflowType;
  organizationId: string;
  payload: WorkflowPayload;
  integrationMode?: IntegrationMode;
  idempotencyKey?: string;
  correlationId?: string;
  appointmentId?: string;
}

/**
 * Creates the AutomationJob row (source of truth for the UI timeline) and
 * enqueues the actual work on BullMQ. The job's own id doubles as the
 * idempotency key passed to BullMQ, so re-submitting the same
 * idempotencyKey returns the existing job instead of enqueuing a duplicate.
 */
export async function enqueueWorkflow(input: EnqueueWorkflowInput) {
  const idempotencyKey = input.idempotencyKey ?? randomUUID();

  const existing = await prisma.automationJob.findUnique({ where: { idempotencyKey } });
  if (existing) return existing;

  const integrationMode = await chooseIntegrationMode(input.organizationId, input.integrationMode);
  const correlationId = input.correlationId ?? randomUUID();

  const job = await prisma.automationJob.create({
    data: {
      type: input.type,
      status: "PENDING",
      integrationMode,
      appointmentId: input.appointmentId,
      input: input.payload as never,
      idempotencyKey,
      correlationId,
      maxAttempts: 3,
    },
  });

  const jobData: WorkflowJobData = {
    automationJobId: job.id,
    type: input.type,
    integrationMode,
    correlationId,
    payload: input.payload,
  };

  await workflowQueue.add(input.type, jobData, {
    jobId: job.id,
  });

  return job;
}
