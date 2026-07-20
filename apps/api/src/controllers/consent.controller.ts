import type { Request, Response } from "express";
import { z } from "zod";
import { asyncHandler } from "../lib/asyncHandler";
import {
  createConsentRecord,
  revokeConsentRecord,
  getConsentRecord,
  listConsentRecordsForPatient,
} from "../services/consent.service";

const createConsentSchema = z.object({
  patientId: z.string().uuid(),
  purpose: z.string().min(1),
  scopes: z.array(z.string()).min(1),
  expiresInDays: z.number().int().positive().optional(),
});

export const createConsentHandler = asyncHandler(async (req: Request, res: Response) => {
  const body = createConsentSchema.parse(req.body);
  const consent = await createConsentRecord({ ...body, createdIp: req.ip });
  res.status(201).json(consent);
});

export const revokeConsentHandler = asyncHandler(async (req: Request, res: Response) => {
  const consent = await revokeConsentRecord(req.params.id);
  res.json(consent);
});

export const getConsentHandler = asyncHandler(async (req: Request, res: Response) => {
  const consent = await getConsentRecord(req.params.id);
  res.json(consent);
});

export const listPatientConsentHandler = asyncHandler(async (req: Request, res: Response) => {
  const consents = await listConsentRecordsForPatient(req.params.patientId);
  res.json({ items: consents });
});
