import type { Request, Response } from "express";
import { z } from "zod";
import { asyncHandler } from "../lib/asyncHandler";
import { queryAuditLogs } from "../services/auditLog.service";

const auditQuerySchema = z.object({
  entityType: z.string().optional(),
  entityId: z.string().optional(),
  action: z.string().optional(),
  actorId: z.string().optional(),
  correlationId: z.string().optional(),
  search: z.string().optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(50),
});

export const listAuditLogsHandler = asyncHandler(async (req: Request, res: Response) => {
  const query = auditQuerySchema.parse(req.query);
  res.json(await queryAuditLogs(query));
});
