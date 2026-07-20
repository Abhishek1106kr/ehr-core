import { prisma } from "../../lib/prisma";
import { randomUUID } from "crypto";
import { createAppointment } from "../../services/appointment.service";
import { syncAppointmentResource } from "../../services/fhir.service";
import { runBrowserBookingAutomation } from "../playwrightBooking";
import { runStep } from "../stepRunner";
import type { AppointmentBookingPayload, WorkflowJobData } from "../types";

/**
 * Books an appointment through whichever integration path the job was
 * routed to. Both paths converge on the same `createAppointment` call so
 * the resulting record is identical either way — only how it got there
 * (and what audit trail it leaves) differs.
 */
export async function executeAppointmentBooking(job: WorkflowJobData, attempt: number) {
  const payload = job.payload as AppointmentBookingPayload;

  if (job.integrationMode === "FHIR_REST") {
    await runStep(job.automationJobId, attempt, "validate_request", async () => {
      const [patient, doctor] = await Promise.all([
        prisma.patient.findUnique({ where: { id: payload.patientId } }),
        prisma.doctor.findUnique({ where: { id: payload.doctorId } }),
      ]);
      if (!patient) throw new Error(`Patient ${payload.patientId} not found`);
      if (!doctor) throw new Error(`Doctor ${payload.doctorId} not found`);
      return { logs: `Validated patient ${patient.mrn} and doctor ${doctor.name}` };
    });

    const appointment = await createAppointment({
      patientId: payload.patientId,
      doctorId: payload.doctorId,
      startsAt: new Date(payload.startsAt),
      endsAt: new Date(payload.endsAt),
      reason: payload.reason,
      isUrgent: payload.isUrgent ?? false,
      integrationMode: "FHIR_REST",
      idempotencyKey: `${job.automationJobId}-book`,
    });

    await runStep(job.automationJobId, attempt, "create_fhir_resource", async () => {
      await syncAppointmentResource(appointment);
      return { logs: `FHIR Appointment/${appointment.id} created` };
    });

    await runStep(job.automationJobId, attempt, "confirm_booking", async () => ({
      logs: `Appointment ${appointment.id} confirmed via FHIR REST`,
    }));

    return { appointmentId: appointment.id };
  }

  // Browser automation path: fetch the MRN the legacy portal search needs,
  // then let Playwright do the rest against the simulated portal.
  const patient = await prisma.patient.findUnique({ where: { id: payload.patientId } });
  if (!patient) throw new Error(`Patient ${payload.patientId} not found`);

  const result = await runBrowserBookingAutomation(job.automationJobId, attempt, {
    ...payload,
    patientMrn: patient.mrn,
  });

  return { appointmentId: result.appointmentId };
}

export function newIdempotencyKey() {
  return randomUUID();
}
