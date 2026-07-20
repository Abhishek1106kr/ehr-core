import { prisma } from "../lib/prisma";
import { NotFoundError, ValidationError } from "../lib/errors";
import crypto from "node:crypto";

export interface CreateConsentInput {
  patientId: string;
  purpose: string;
  scopes: string[];
  expiresInDays?: number;
  createdIp?: string;
}

export async function createConsentRecord(input: CreateConsentInput) {
  const patient = await prisma.patient.findUnique({ where: { id: input.patientId } });
  if (!patient) throw new NotFoundError("Patient", input.patientId);

  const grantedAt = new Date();
  const expiresAt = input.expiresInDays
    ? new Date(grantedAt.getTime() + input.expiresInDays * 24 * 60 * 60 * 1000)
    : null;

  const signatureRaw = `${input.patientId}:${input.purpose}:${input.scopes.sort().join(",")}:${grantedAt.toISOString()}`;
  const signatureHash = crypto.createHash("sha256").update(signatureRaw).digest("hex");

  return prisma.consentRecord.create({
    data: {
      patientId: input.patientId,
      purpose: input.purpose,
      scopes: input.scopes,
      status: "GRANTED",
      grantedAt,
      expiresAt,
      signatureHash,
      createdIp: input.createdIp ?? "127.0.0.1",
    },
  });
}

export async function revokeConsentRecord(consentId: string) {
  const consent = await prisma.consentRecord.findUnique({ where: { id: consentId } });
  if (!consent) throw new NotFoundError("ConsentRecord", consentId);

  return prisma.consentRecord.update({
    where: { id: consentId },
    data: { status: "REVOKED", revokedAt: new Date() },
  });
}

export async function getConsentRecord(consentId: string) {
  const consent = await prisma.consentRecord.findUnique({
    where: { id: consentId },
    include: { patient: { select: { id: true, name: true, mrn: true } } },
  });
  if (!consent) throw new NotFoundError("ConsentRecord", consentId);
  return consent;
}

export async function listConsentRecordsForPatient(patientId: string) {
  return prisma.consentRecord.findMany({
    where: { patientId },
    orderBy: { createdAt: "desc" },
  });
}

export async function verifyPatientConsent(
  patientId: string,
  requiredScope: string,
): Promise<boolean> {
  const activeConsents = await prisma.consentRecord.findMany({
    where: {
      patientId,
      status: "GRANTED",
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    },
  });

  return activeConsents.some(
    (consent: { scopes: string[] }) =>
      consent.scopes.includes("*") || consent.scopes.includes(requiredScope),
  );
}
