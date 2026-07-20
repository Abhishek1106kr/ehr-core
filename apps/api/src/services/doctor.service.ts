import { z } from "zod";
import { prisma } from "../lib/prisma";
import { NotFoundError } from "../lib/errors";
import type { PaginationQuery } from "../lib/pagination";

export const createDoctorSchema = z.object({
  organizationId: z.string().uuid(),
  name: z.string().min(1).max(200),
  specialty: z.string().min(1).max(100),
  departmentId: z.string().uuid().optional(),
  workingHours: z.record(z.array(z.object({ start: z.string(), end: z.string() }))).optional(),
});

export const updateDoctorSchema = createDoctorSchema.partial().omit({ organizationId: true });

export async function listDoctors(organizationId: string, query: PaginationQuery) {
  const where = {
    organizationId,
    isActive: true,
    ...(query.search && {
      OR: [
        { name: { contains: query.search, mode: "insensitive" as const } },
        { specialty: { contains: query.search, mode: "insensitive" as const } },
      ],
    }),
  };

  const [items, total] = await Promise.all([
    prisma.doctor.findMany({
      where,
      orderBy: { name: "asc" },
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
    }),
    prisma.doctor.count({ where }),
  ]);

  return { items, total, page: query.page, pageSize: query.pageSize };
}

export async function findAvailableDoctors(organizationId: string, specialty?: string) {
  return prisma.doctor.findMany({
    where: { organizationId, isActive: true, ...(specialty && { specialty }) },
    orderBy: { name: "asc" },
  });
}

export async function getDoctor(id: string) {
  const doctor = await prisma.doctor.findUnique({ where: { id } });
  if (!doctor) throw new NotFoundError("Doctor", id);
  return doctor;
}

export async function createDoctor(input: z.infer<typeof createDoctorSchema>) {
  return prisma.doctor.create({ data: input });
}

export async function updateDoctor(id: string, input: z.infer<typeof updateDoctorSchema>) {
  await getDoctor(id);
  return prisma.doctor.update({ where: { id }, data: input });
}

export async function deactivateDoctor(id: string) {
  await getDoctor(id);
  return prisma.doctor.update({ where: { id }, data: { isActive: false } });
}
