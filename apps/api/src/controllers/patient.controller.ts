import type { Request, Response } from "express";
import { asyncHandler } from "../lib/asyncHandler";
import { paginationSchema } from "../lib/pagination";
import { recordAuditLog } from "../services/auditLog.service";
import {
  createPatientSchema,
  updatePatientSchema,
  listPatients,
  getPatient,
  createPatient,
  updatePatient,
  softDeletePatient,
} from "../services/patient.service";

export const listPatientsHandler = asyncHandler(async (req: Request, res: Response) => {
  const query = paginationSchema.parse(req.query);
  const organizationId = req.query.organizationId as string;
  const result = await listPatients(organizationId, query);
  res.json(result);
});

export const getPatientHandler = asyncHandler(async (req: Request, res: Response) => {
  const patient = await getPatient(req.params.id);
  res.json(patient);
});

export const createPatientHandler = asyncHandler(async (req: Request, res: Response) => {
  const start = Date.now();
  const input = createPatientSchema.parse(req.body);
  const patient = await createPatient(input);

  await recordAuditLog({
    actorId: req.user?.sub,
    actorLabel: req.user?.email ?? "system",
    action: "patient.created",
    entityType: "Patient",
    entityId: patient.id,
    after: patient,
    durationMs: Date.now() - start,
    correlationId: req.correlationId,
    traceId: req.traceId,
  });

  res.status(201).json(patient);
});

export const updatePatientHandler = asyncHandler(async (req: Request, res: Response) => {
  const start = Date.now();
  const before = await getPatient(req.params.id);
  const input = updatePatientSchema.parse(req.body);
  const patient = await updatePatient(req.params.id, input);

  await recordAuditLog({
    actorId: req.user?.sub,
    actorLabel: req.user?.email ?? "system",
    action: "patient.updated",
    entityType: "Patient",
    entityId: patient.id,
    before,
    after: patient,
    durationMs: Date.now() - start,
    correlationId: req.correlationId,
    traceId: req.traceId,
  });

  res.json(patient);
});

export const deletePatientHandler = asyncHandler(async (req: Request, res: Response) => {
  const start = Date.now();
  const before = await getPatient(req.params.id);
  const patient = await softDeletePatient(req.params.id);

  await recordAuditLog({
    actorId: req.user?.sub,
    actorLabel: req.user?.email ?? "system",
    action: "patient.deleted",
    entityType: "Patient",
    entityId: patient.id,
    before,
    durationMs: Date.now() - start,
    correlationId: req.correlationId,
    traceId: req.traceId,
  });

  res.status(204).send();
});
