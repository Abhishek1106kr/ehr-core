import type { Request, Response } from "express";
import { asyncHandler } from "../lib/asyncHandler";
import { recordAuditLog } from "../services/auditLog.service";
import {
  updateOrganizationSchema,
  getOrganization,
  updateOrganization,
} from "../services/organization.service";

export const getOrganizationHandler = asyncHandler(async (req: Request, res: Response) => {
  res.json(await getOrganization(req.params.id));
});

export const updateOrganizationHandler = asyncHandler(async (req: Request, res: Response) => {
  const start = Date.now();
  const before = await getOrganization(req.params.id);
  const input = updateOrganizationSchema.parse(req.body);
  const org = await updateOrganization(req.params.id, input);

  await recordAuditLog({
    actorId: req.user?.sub,
    actorLabel: req.user?.email ?? "system",
    action: "organization.updated",
    entityType: "Organization",
    entityId: org.id,
    before,
    after: org,
    durationMs: Date.now() - start,
    correlationId: req.correlationId,
    traceId: req.traceId,
  });

  res.json(org);
});
