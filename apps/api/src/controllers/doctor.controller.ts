import type { Request, Response } from "express";
import { asyncHandler } from "../lib/asyncHandler";
import { paginationSchema } from "../lib/pagination";
import { recordAuditLog } from "../services/auditLog.service";
import {
  createDoctorSchema,
  updateDoctorSchema,
  listDoctors,
  findAvailableDoctors,
  getDoctor,
  createDoctor,
  updateDoctor,
  deactivateDoctor,
} from "../services/doctor.service";

export const listDoctorsHandler = asyncHandler(async (req: Request, res: Response) => {
  const query = paginationSchema.parse(req.query);
  const organizationId = req.query.organizationId as string;
  res.json(await listDoctors(organizationId, query));
});

export const findAvailableDoctorsHandler = asyncHandler(async (req: Request, res: Response) => {
  const organizationId = req.query.organizationId as string;
  const specialty = req.query.specialty as string | undefined;
  res.json(await findAvailableDoctors(organizationId, specialty));
});

export const getDoctorHandler = asyncHandler(async (req: Request, res: Response) => {
  res.json(await getDoctor(req.params.id));
});

export const createDoctorHandler = asyncHandler(async (req: Request, res: Response) => {
  const start = Date.now();
  const input = createDoctorSchema.parse(req.body);
  const doctor = await createDoctor(input);

  await recordAuditLog({
    actorId: req.user?.sub,
    actorLabel: req.user?.email ?? "system",
    action: "doctor.created",
    entityType: "Doctor",
    entityId: doctor.id,
    after: doctor,
    durationMs: Date.now() - start,
    correlationId: req.correlationId,
    traceId: req.traceId,
  });

  res.status(201).json(doctor);
});

export const updateDoctorHandler = asyncHandler(async (req: Request, res: Response) => {
  const start = Date.now();
  const before = await getDoctor(req.params.id);
  const input = updateDoctorSchema.parse(req.body);
  const doctor = await updateDoctor(req.params.id, input);

  await recordAuditLog({
    actorId: req.user?.sub,
    actorLabel: req.user?.email ?? "system",
    action: "doctor.updated",
    entityType: "Doctor",
    entityId: doctor.id,
    before,
    after: doctor,
    durationMs: Date.now() - start,
    correlationId: req.correlationId,
    traceId: req.traceId,
  });

  res.json(doctor);
});

export const deactivateDoctorHandler = asyncHandler(async (req: Request, res: Response) => {
  const start = Date.now();
  const before = await getDoctor(req.params.id);
  const doctor = await deactivateDoctor(req.params.id);

  await recordAuditLog({
    actorId: req.user?.sub,
    actorLabel: req.user?.email ?? "system",
    action: "doctor.deactivated",
    entityType: "Doctor",
    entityId: doctor.id,
    before,
    after: doctor,
    durationMs: Date.now() - start,
    correlationId: req.correlationId,
    traceId: req.traceId,
  });

  res.json(doctor);
});
