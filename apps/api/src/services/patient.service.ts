import { z } from "zod";
import { prisma } from "../lib/prisma";
import { NotFoundError } from "../lib/errors";
import { maskAadhaar } from "../lib/mask";
import type { PaginationQuery } from "../lib/pagination";

export const createPatientSchema = z.object({
  organizationId: z.string().uuid(),
  name: z.string().min(1).max(200),
  dob: z.coerce.date().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER", "UNSPECIFIED"]).default("UNSPECIFIED"),
  phone: z.string().min(6).max(20).optional(),
  email: z.string().email().optional(),
  address: z.string().max(500).optional(),
  preferredLanguage: z.string().default("en"),
  emergencyContact: z
    .object({ name: z.string(), phone: z.string(), relation: z.string() })
    .optional(),
  aadhaar: z.string().optional(), // raw value, masked before persisting, never stored raw
});

export const updatePatientSchema = createPatientSchema.partial().omit({ organizationId: true });

async function generateMrn(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.patient.count();
  return `MRN-${year}-${String(count + 1).padStart(6, "0")}`;
}

export async function listPatients(organizationId: string, query: PaginationQuery) {
  const where = {
    organizationId,
    deletedAt: null,
    ...(query.search && {
      OR: [
        { name: { contains: query.search, mode: "insensitive" as const } },
        { mrn: { contains: query.search, mode: "insensitive" as const } },
        { phone: { contains: query.search } },
        { email: { contains: query.search, mode: "insensitive" as const } },
      ],
    }),
  };

  const [items, total] = await Promise.all([
    prisma.patient.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
    }),
    prisma.patient.count({ where }),
  ]);

  return { items, total, page: query.page, pageSize: query.pageSize };
}

export async function getPatient(id: string) {
  const patient = await prisma.patient.findFirst({ where: { id, deletedAt: null } });
  if (!patient) throw new NotFoundError("Patient", id);
  return patient;
}

export async function createPatient(input: z.infer<typeof createPatientSchema>) {
  const { aadhaar, ...rest } = input;
  const mrn = await generateMrn();
  return prisma.patient.create({
    data: {
      ...rest,
      mrn,
      aadhaarMasked: aadhaar ? maskAadhaar(aadhaar) : undefined,
    },
  });
}

export async function updatePatient(id: string, input: z.infer<typeof updatePatientSchema>) {
  await getPatient(id);
  const { aadhaar, ...rest } = input;
  return prisma.patient.update({
    where: { id },
    data: {
      ...rest,
      ...(aadhaar && { aadhaarMasked: maskAadhaar(aadhaar) }),
    },
  });
}

export async function softDeletePatient(id: string) {
  await getPatient(id);
  return prisma.patient.update({ where: { id }, data: { deletedAt: new Date() } });
}
