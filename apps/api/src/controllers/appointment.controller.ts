import type { Request, Response } from "express";
import { asyncHandler } from "../lib/asyncHandler";
import { paginationSchema } from "../lib/pagination";
import { recordAuditLog } from "../services/auditLog.service";
import {
  createAppointmentSchema,
  rescheduleAppointmentSchema,
  cancelAppointmentSchema,
  listAppointments,
  getAppointment,
  createAppointment,
  rescheduleAppointment,
  cancelAppointment,
} from "../services/appointment.service";

export const listAppointmentsHandler = asyncHandler(async (req: Request, res: Response) => {
  const pagination = paginationSchema.parse(req.query);
  const { doctorId, patientId, status, from, to } = req.query;
  const result = await listAppointments({
    ...pagination,
    doctorId: doctorId as string | undefined,
    patientId: patientId as string | undefined,
    status: status as string | undefined,
    from: from ? new Date(from as string) : undefined,
    to: to ? new Date(to as string) : undefined,
  });
  res.json(result);
});

export const getAppointmentHandler = asyncHandler(async (req: Request, res: Response) => {
  res.json(await getAppointment(req.params.id));
});

export const createAppointmentHandler = asyncHandler(async (req: Request, res: Response) => {
  const start = Date.now();
  const input = createAppointmentSchema.parse(req.body);
  const appointment = await createAppointment(input);

  await recordAuditLog({
    actorId: req.user?.sub,
    actorLabel: req.user?.email ?? "system",
    action: "appointment.booked",
    entityType: "Appointment",
    entityId: appointment.id,
    after: appointment,
    durationMs: Date.now() - start,
    correlationId: req.correlationId,
    traceId: req.traceId,
  });

  res.status(201).json(appointment);
});

export const rescheduleAppointmentHandler = asyncHandler(async (req: Request, res: Response) => {
  const start = Date.now();
  const before = await getAppointment(req.params.id);
  const input = rescheduleAppointmentSchema.parse(req.body);
  const appointment = await rescheduleAppointment(req.params.id, input);

  await recordAuditLog({
    actorId: req.user?.sub,
    actorLabel: req.user?.email ?? "system",
    action: "appointment.rescheduled",
    entityType: "Appointment",
    entityId: appointment.id,
    before,
    after: appointment,
    durationMs: Date.now() - start,
    correlationId: req.correlationId,
    traceId: req.traceId,
  });

  res.json(appointment);
});

export const cancelAppointmentHandler = asyncHandler(async (req: Request, res: Response) => {
  const start = Date.now();
  const before = await getAppointment(req.params.id);
  const input = cancelAppointmentSchema.parse(req.body);
  const appointment = await cancelAppointment(req.params.id, input);

  await recordAuditLog({
    actorId: req.user?.sub,
    actorLabel: req.user?.email ?? "system",
    action: "appointment.cancelled",
    entityType: "Appointment",
    entityId: appointment.id,
    before,
    after: appointment,
    durationMs: Date.now() - start,
    correlationId: req.correlationId,
    traceId: req.traceId,
  });

  res.json(appointment);
});
