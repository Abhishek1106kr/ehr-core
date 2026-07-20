import type { Request, Response } from "express";
import { z } from "zod";
import { asyncHandler } from "../lib/asyncHandler";
import { enqueueWorkflow } from "../services/workflowEngine.service";

const bookAppointmentWorkflowSchema = z.object({
  organizationId: z.string().uuid(),
  patientId: z.string().uuid(),
  doctorId: z.string().uuid(),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date(),
  reason: z.string().max(500).optional(),
  isUrgent: z.boolean().default(false),
  integrationMode: z.enum(["FHIR_REST", "BROWSER_AUTOMATION"]).optional(),
});

export const enqueueAppointmentBookingHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const input = bookAppointmentWorkflowSchema.parse(req.body);

    const job = await enqueueWorkflow({
      type: "APPOINTMENT_BOOKING",
      organizationId: input.organizationId,
      integrationMode: input.integrationMode,
      correlationId: req.correlationId,
      payload: {
        patientId: input.patientId,
        doctorId: input.doctorId,
        startsAt: input.startsAt.toISOString(),
        endsAt: input.endsAt.toISOString(),
        reason: input.reason,
        isUrgent: input.isUrgent,
      },
    });

    res.status(202).json(job);
  },
);

const verifyInsuranceWorkflowSchema = z.object({
  organizationId: z.string().uuid(),
  insuranceId: z.string().uuid(),
  integrationMode: z.enum(["FHIR_REST", "BROWSER_AUTOMATION"]).optional(),
});

export const enqueueInsuranceVerificationHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const input = verifyInsuranceWorkflowSchema.parse(req.body);

    const job = await enqueueWorkflow({
      type: "INSURANCE_VERIFICATION",
      organizationId: input.organizationId,
      integrationMode: input.integrationMode,
      correlationId: req.correlationId,
      payload: { insuranceId: input.insuranceId },
    });

    res.status(202).json(job);
  },
);
