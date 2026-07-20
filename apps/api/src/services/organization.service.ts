import { z } from "zod";
import { prisma } from "../lib/prisma";
import { NotFoundError } from "../lib/errors";

export const updateOrganizationSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  timezone: z.string().optional(),
  address: z.string().max(500).optional(),
  phone: z.string().optional(),
  languages: z.array(z.string()).optional(),
  workingHours: z.record(z.array(z.object({ start: z.string(), end: z.string() }))).optional(),
  holidays: z.array(z.object({ date: z.string(), label: z.string() })).optional(),
});

export async function getOrganization(id: string) {
  const org = await prisma.organization.findUnique({
    where: { id },
    include: { departments: true },
  });
  if (!org) throw new NotFoundError("Organization", id);
  return org;
}

export async function updateOrganization(
  id: string,
  input: z.infer<typeof updateOrganizationSchema>,
) {
  await getOrganization(id);
  return prisma.organization.update({ where: { id }, data: input });
}
