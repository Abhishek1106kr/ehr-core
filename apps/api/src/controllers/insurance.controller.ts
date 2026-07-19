import type { Request, Response } from "express";
import { asyncHandler } from "../lib/asyncHandler";
import { recordAuditLog } from "../services/auditLog.service";
import {
  createInsuranceSchema,
  listInsuranceForPatient,
  getInsurance,
  createInsurance,
  verifyInsurance,
} from "../services/insurance.service";

export const listInsuranceHandler = asyncHandler(async (req: Request, res: Response) => {
  const patientId = req.query.patientId as string;
  res.json(await listInsuranceForPatient(patientId));
});

export const createInsuranceHandler = asyncHandler(async (req: Request, res: Response) => {
  const start = Date.now();
  const input = createInsuranceSchema.parse(req.body);
  const insurance = await createInsurance(input);

  await recordAuditLog({
    actorId: req.user?.sub,
    actorLabel: req.user?.email ?? "system",
    action: "insurance.created",
    entityType: "Insurance",
    entityId: insurance.id,
    after: insurance,
    durationMs: Date.now() - start,
    correlationId: req.correlationId,
    traceId: req.traceId,
  });

  res.status(201).json(insurance);
});

export const verifyInsuranceHandler = asyncHandler(async (req: Request, res: Response) => {
  const start = Date.now();
  const before = await getInsurance(req.params.id);
  const insurance = await verifyInsurance(req.params.id);

  await recordAuditLog({
    actorId: req.user?.sub,
    actorLabel: req.user?.email ?? "system",
    action: "insurance.verified",
    entityType: "Insurance",
    entityId: insurance.id,
    before,
    after: insurance,
    durationMs: Date.now() - start,
    correlationId: req.correlationId,
    traceId: req.traceId,
  });

  res.json(insurance);
});
