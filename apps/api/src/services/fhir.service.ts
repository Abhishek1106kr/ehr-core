import { prisma } from "../lib/prisma";
import { NotFoundError, ValidationError } from "../lib/errors";
import type { Doctor, Patient, Appointment, Insurance } from "@prisma/client";

export const SUPPORTED_FHIR_RESOURCE_TYPES = [
  "Patient",
  "Practitioner",
  "Appointment",
  "Coverage",
  "Organization",
  "Encounter",
  "Observation",
  "Condition",
  "Medication",
  "DiagnosticReport",
] as const;

export type FhirResourceType = (typeof SUPPORTED_FHIR_RESOURCE_TYPES)[number];

/** Maps our domain models to minimal, spec-shaped FHIR R4 resources. Only
 * the fields needed to demonstrate the adapter pattern are populated —
 * this is a mock, not a certified FHIR server. */

function toFhirPatient(p: Patient) {
  return {
    resourceType: "Patient",
    id: p.id,
    identifier: [{ system: "urn:openehr-bridge:mrn", value: p.mrn }],
    name: [{ text: p.name }],
    gender: p.gender.toLowerCase(),
    birthDate: p.dob ? p.dob.toISOString().slice(0, 10) : undefined,
    telecom: [
      ...(p.phone ? [{ system: "phone", value: p.phone }] : []),
      ...(p.email ? [{ system: "email", value: p.email }] : []),
    ],
    address: p.address ? [{ text: p.address }] : undefined,
    communication: [{ language: { text: p.preferredLanguage } }],
  };
}

function toFhirPractitioner(d: Doctor) {
  return {
    resourceType: "Practitioner",
    id: d.id,
    name: [{ text: d.name }],
    qualification: [{ code: { text: d.specialty } }],
    active: d.isActive,
  };
}

function toFhirAppointment(a: Appointment) {
  return {
    resourceType: "Appointment",
    id: a.id,
    status: mapAppointmentStatus(a.status),
    start: a.startsAt.toISOString(),
    end: a.endsAt.toISOString(),
    participant: [
      { actor: { reference: `Patient/${a.patientId}` }, status: "accepted" },
      { actor: { reference: `Practitioner/${a.doctorId}` }, status: "accepted" },
    ],
    ...(a.reason && { reasonCode: [{ text: a.reason }] }),
  };
}

function toFhirCoverage(i: Insurance) {
  return {
    resourceType: "Coverage",
    id: i.id,
    status: i.status === "ACTIVE" ? "active" : "cancelled",
    beneficiary: { reference: `Patient/${i.patientId}` },
    payor: [{ display: i.provider }],
    identifier: [{ value: i.policyNumberMasked }],
  };
}

function mapAppointmentStatus(status: string): string {
  switch (status) {
    case "REQUESTED":
      return "proposed";
    case "CONFIRMED":
    case "RESCHEDULED":
      return "booked";
    case "CANCELLED":
      return "cancelled";
    case "COMPLETED":
      return "fulfilled";
    case "NO_SHOW":
      return "noshow";
    default:
      return "proposed";
  }
}

/** Validates essential FHIR R4 attribute structures before database storage. */
export function validateFhirResourcePayload(resourceType: string, data: any): void {
  if (!data || typeof data !== "object") {
    throw new ValidationError(`Invalid FHIR ${resourceType} payload: expected an object`);
  }
  if (data.resourceType !== resourceType) {
    throw new ValidationError(
      `FHIR resourceType mismatch: expected "${resourceType}", got "${data.resourceType}"`,
    );
  }
  if (!data.id) {
    throw new ValidationError(`FHIR ${resourceType} payload missing required field "id"`);
  }
}

/** Upserts (or version-bumps) the FhirResource row backing one domain record. */
async function upsertFhirResource(
  resourceType: FhirResourceType,
  fhirId: string,
  data: unknown,
  patientId?: string,
) {
  validateFhirResourcePayload(resourceType, data);
  const existing = await prisma.fhirResource.findUnique({ where: { fhirId } });
  return prisma.fhirResource.upsert({
    where: { fhirId },
    create: { resourceType, fhirId, data: data as never, patientId, version: 1 },
    update: { data: data as never, patientId, version: (existing?.version ?? 0) + 1 },
  });
}

/**
 * Regenerates FHIR resources for every Patient, Doctor (as Practitioner),
 * Appointment, and Insurance (as Coverage) record in the organization.
 * Represents what a real FHIR adapter would do incrementally on write;
 * done as a batch sync here since Phase 2 doesn't yet hook resource
 * generation into every domain mutation.
 */
export async function syncFhirResources(organizationId: string) {
  const [patients, doctors, appointments, insurance] = await Promise.all([
    prisma.patient.findMany({ where: { organizationId, deletedAt: null } }),
    prisma.doctor.findMany({ where: { organizationId } }),
    prisma.appointment.findMany({ where: { doctor: { organizationId } } }),
    prisma.insurance.findMany({ where: { patient: { organizationId } } }),
  ]);

  const results = await Promise.all([
    ...patients.map((p) =>
      upsertFhirResource("Patient", `Patient/${p.id}`, toFhirPatient(p), p.id),
    ),
    ...doctors.map((d) =>
      upsertFhirResource("Practitioner", `Practitioner/${d.id}`, toFhirPractitioner(d)),
    ),
    ...appointments.map((a) =>
      upsertFhirResource("Appointment", `Appointment/${a.id}`, toFhirAppointment(a), a.patientId),
    ),
    ...insurance.map((i) =>
      upsertFhirResource("Coverage", `Coverage/${i.id}`, toFhirCoverage(i), i.patientId),
    ),
  ]);

  return {
    synced: results.length,
    breakdown: {
      Patient: patients.length,
      Practitioner: doctors.length,
      Appointment: appointments.length,
      Coverage: insurance.length,
    },
  };
}

/** Upserts a single Appointment's FHIR resource — called by the FHIR-path booking executor. */
export async function syncAppointmentResource(appointment: Appointment) {
  return upsertFhirResource(
    "Appointment",
    `Appointment/${appointment.id}`,
    toFhirAppointment(appointment),
    appointment.patientId,
  );
}

export async function listFhirResources(resourceType: string, page: number, pageSize: number) {
  if (!SUPPORTED_FHIR_RESOURCE_TYPES.includes(resourceType as FhirResourceType)) {
    throw new ValidationError(`Unsupported FHIR resource type "${resourceType}"`);
  }

  const where = { resourceType };
  const [items, total] = await Promise.all([
    prisma.fhirResource.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.fhirResource.count({ where }),
  ]);

  return { items, total, page, pageSize };
}

export async function getFhirResource(id: string) {
  const resource = await prisma.fhirResource.findUnique({ where: { id } });
  if (!resource) throw new NotFoundError("FhirResource", id);
  return resource;
}
