import { z } from "zod";
import { prisma } from "../lib/prisma";
import { ConflictError, NotFoundError, ValidationError } from "../lib/errors";
import type { PaginationQuery } from "../lib/pagination";

export const createAppointmentSchema = z.object({
  patientId: z.string().uuid(),
  doctorId: z.string().uuid(),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date(),
  reason: z.string().max(500).optional(),
  isUrgent: z.boolean().default(false),
  integrationMode: z.enum(["FHIR_REST", "BROWSER_AUTOMATION"]).optional(),
  // Supplied by the caller (or the workflow engine on retry) so that a retried
  // "book appointment" step never creates a duplicate booking.
  idempotencyKey: z.string().min(1),
});

export const rescheduleAppointmentSchema = z.object({
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date(),
});

export const cancelAppointmentSchema = z.object({
  cancelReason: z.string().max(500).optional(),
});

interface ListAppointmentsFilter extends PaginationQuery {
  doctorId?: string;
  patientId?: string;
  status?: string;
  from?: Date;
  to?: Date;
}

export async function listAppointments(filter: ListAppointmentsFilter) {
  const where = {
    ...(filter.doctorId && { doctorId: filter.doctorId }),
    ...(filter.patientId && { patientId: filter.patientId }),
    ...(filter.status && { status: filter.status as never }),
    ...((filter.from || filter.to) && {
      startsAt: {
        ...(filter.from && { gte: filter.from }),
        ...(filter.to && { lte: filter.to }),
      },
    }),
  };

  const [items, total] = await Promise.all([
    prisma.appointment.findMany({
      where,
      include: { patient: true, doctor: true },
      orderBy: { startsAt: "asc" },
      skip: (filter.page - 1) * filter.pageSize,
      take: filter.pageSize,
    }),
    prisma.appointment.count({ where }),
  ]);

  return { items, total, page: filter.page, pageSize: filter.pageSize };
}

export async function getAppointment(id: string) {
  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: { patient: true, doctor: true },
  });
  if (!appointment) throw new NotFoundError("Appointment", id);
  return appointment;
}

async function assertNoDoctorConflict(
  doctorId: string,
  startsAt: Date,
  endsAt: Date,
  excludeAppointmentId?: string,
) {
  const overlap = await prisma.appointment.findFirst({
    where: {
      doctorId,
      status: { in: ["REQUESTED", "CONFIRMED", "RESCHEDULED"] },
      ...(excludeAppointmentId && { id: { not: excludeAppointmentId } }),
      startsAt: { lt: endsAt },
      endsAt: { gt: startsAt },
    },
  });
  if (overlap) {
    throw new ConflictError("This doctor already has an appointment in that time slot", {
      conflictingAppointmentId: overlap.id,
    });
  }
}

/**
 * Idempotent booking: if a caller (or a retried workflow step) submits the
 * same idempotencyKey twice, the existing appointment is returned rather
 * than creating a duplicate — this is what makes automation retries safe.
 */
export async function createAppointment(input: z.infer<typeof createAppointmentSchema>) {
  if (input.endsAt <= input.startsAt) {
    throw new ValidationError("endsAt must be after startsAt");
  }

  const existing = await prisma.appointment.findUnique({
    where: { idempotencyKey: input.idempotencyKey },
  });
  if (existing) return existing;

  await assertNoDoctorConflict(input.doctorId, input.startsAt, input.endsAt);

  return prisma.appointment.create({
    data: { ...input, status: "CONFIRMED" },
    include: { patient: true, doctor: true },
  });
}

export async function rescheduleAppointment(
  id: string,
  input: z.infer<typeof rescheduleAppointmentSchema>,
) {
  const appointment = await getAppointment(id);
  if (["CANCELLED", "COMPLETED"].includes(appointment.status)) {
    throw new ConflictError(`Cannot reschedule an appointment with status ${appointment.status}`);
  }
  if (input.endsAt <= input.startsAt) {
    throw new ValidationError("endsAt must be after startsAt");
  }

  await assertNoDoctorConflict(appointment.doctorId, input.startsAt, input.endsAt, id);

  return prisma.appointment.update({
    where: { id },
    data: { ...input, status: "RESCHEDULED" },
    include: { patient: true, doctor: true },
  });
}

export async function cancelAppointment(
  id: string,
  input: z.infer<typeof cancelAppointmentSchema>,
) {
  const appointment = await getAppointment(id);
  if (appointment.status === "CANCELLED") return appointment; // idempotent no-op

  return prisma.appointment.update({
    where: { id },
    data: { status: "CANCELLED", cancelledAt: new Date(), cancelReason: input.cancelReason },
    include: { patient: true, doctor: true },
  });
}
