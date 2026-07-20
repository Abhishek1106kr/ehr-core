import { z } from "zod";
import { prisma } from "../lib/prisma";
import { NotFoundError } from "../lib/errors";
import { maskPolicyNumber } from "../lib/mask";

export const createInsuranceSchema = z.object({
  patientId: z.string().uuid(),
  provider: z.string().min(1).max(200),
  policyNumber: z.string().min(4), // raw value, masked before persisting
  groupNumber: z.string().optional(),
});

export async function listInsuranceForPatient(patientId: string) {
  return prisma.insurance.findMany({ where: { patientId }, orderBy: { createdAt: "desc" } });
}

export async function getInsurance(id: string) {
  const insurance = await prisma.insurance.findUnique({ where: { id } });
  if (!insurance) throw new NotFoundError("Insurance", id);
  return insurance;
}

export async function createInsurance(input: z.infer<typeof createInsuranceSchema>) {
  return prisma.insurance.create({
    data: {
      patientId: input.patientId,
      provider: input.provider,
      policyNumberMasked: maskPolicyNumber(input.policyNumber),
      groupNumber: input.groupNumber,
    },
  });
}

/**
 * Simulated insurance verification. A real integration would call the
 * payer's eligibility API (or drive it via browser automation); here we
 * deterministically derive a plausible outcome so demos are repeatable.
 */
export async function verifyInsurance(id: string) {
  const insurance = await getInsurance(id);
  await prisma.insurance.update({ where: { id }, data: { status: "PENDING" } });

  const isActive =
    insurance.policyNumberMasked.charCodeAt(insurance.policyNumberMasked.length - 1) % 5 !== 0;

  return prisma.insurance.update({
    where: { id },
    data: {
      status: isActive ? "ACTIVE" : "DENIED",
      lastVerifiedAt: new Date(),
      coverageDetails: isActive
        ? { copay: 20, deductible: 500, planType: "PPO" }
        : { reason: "Coverage lapsed or not found" },
    },
  });
}
