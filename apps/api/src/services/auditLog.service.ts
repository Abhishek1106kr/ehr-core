import { prisma } from "../lib/prisma";
import { logger } from "../lib/logger";

export interface RecordAuditLogInput {
  actorId?: string | null;
  actorLabel: string;
  action: string;
  entityType: string;
  entityId: string;
  before?: unknown;
  after?: unknown;
  durationMs?: number;
  prompt?: string;
  response?: string;
  error?: string;
  correlationId: string;
  traceId: string;
}

/**
 * Audit logging must never break the request it's observing: failures here
 * are logged and swallowed rather than propagated, since losing an audit
 * entry is preferable to failing a patient-facing operation because of it.
 */
export async function recordAuditLog(input: RecordAuditLogInput): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: input.actorId ?? null,
        actorLabel: input.actorLabel,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        before: input.before as never,
        after: input.after as never,
        durationMs: input.durationMs,
        prompt: input.prompt,
        response: input.response,
        error: input.error,
        correlationId: input.correlationId,
        traceId: input.traceId,
      },
    });
  } catch (err) {
    logger.error({ err, action: input.action }, "Failed to record audit log entry");
  }
}

export interface AuditLogQuery {
  entityType?: string;
  entityId?: string;
  action?: string;
  actorId?: string;
  correlationId?: string;
  from?: Date;
  to?: Date;
  search?: string;
  page: number;
  pageSize: number;
}

export async function queryAuditLogs(query: AuditLogQuery) {
  const where = {
    ...(query.entityType && { entityType: query.entityType }),
    ...(query.entityId && { entityId: query.entityId }),
    ...(query.action && { action: { contains: query.action } }),
    ...(query.actorId && { actorId: query.actorId }),
    ...(query.correlationId && { correlationId: query.correlationId }),
    ...((query.from || query.to) && {
      timestamp: {
        ...(query.from && { gte: query.from }),
        ...(query.to && { lte: query.to }),
      },
    }),
    ...(query.search && {
      OR: [
        { action: { contains: query.search, mode: "insensitive" as const } },
        { actorLabel: { contains: query.search, mode: "insensitive" as const } },
        { entityType: { contains: query.search, mode: "insensitive" as const } },
      ],
    }),
  };

  const [items, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { timestamp: "desc" },
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
    }),
    prisma.auditLog.count({ where }),
  ]);

  return { items, total, page: query.page, pageSize: query.pageSize };
}
