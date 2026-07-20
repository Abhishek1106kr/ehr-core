import { prisma } from "../lib/prisma";
import { NotFoundError } from "../lib/errors";
import type { PaginationQuery } from "../lib/pagination";

interface ListJobsFilter extends PaginationQuery {
  status?: string;
  type?: string;
  integrationMode?: string;
}

export async function listAutomationJobs(filter: ListJobsFilter) {
  const where = {
    ...(filter.status && { status: filter.status as never }),
    ...(filter.type && { type: filter.type as never }),
    ...(filter.integrationMode && { integrationMode: filter.integrationMode as never }),
  };

  const [items, total] = await Promise.all([
    prisma.automationJob.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (filter.page - 1) * filter.pageSize,
      take: filter.pageSize,
    }),
    prisma.automationJob.count({ where }),
  ]);

  return { items, total, page: filter.page, pageSize: filter.pageSize };
}

export async function getAutomationJob(id: string) {
  const job = await prisma.automationJob.findUnique({
    where: { id },
    include: { steps: { orderBy: { createdAt: "asc" } } },
  });
  if (!job) throw new NotFoundError("AutomationJob", id);
  return job;
}
