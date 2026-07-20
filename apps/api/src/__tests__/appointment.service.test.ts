import { describe, it, expect } from "vitest";
import {
  createAppointmentSchema,
  rescheduleAppointmentSchema,
} from "../services/appointment.service";

describe("appointment schemas", () => {
  it("requires an idempotency key on create", () => {
    const result = createAppointmentSchema.safeParse({
      patientId: "11111111-1111-1111-1111-111111111111",
      doctorId: "22222222-2222-2222-2222-222222222222",
      startsAt: "2026-08-01T09:00:00.000Z",
      endsAt: "2026-08-01T09:30:00.000Z",
    });
    expect(result.success).toBe(false);
  });

  it("accepts a well-formed booking request", () => {
    const result = createAppointmentSchema.safeParse({
      patientId: "11111111-1111-1111-1111-111111111111",
      doctorId: "22222222-2222-2222-2222-222222222222",
      startsAt: "2026-08-01T09:00:00.000Z",
      endsAt: "2026-08-01T09:30:00.000Z",
      idempotencyKey: "book-appt-abc123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects reschedule payloads missing endsAt", () => {
    const result = rescheduleAppointmentSchema.safeParse({
      startsAt: "2026-08-01T09:00:00.000Z",
    });
    expect(result.success).toBe(false);
  });
});
