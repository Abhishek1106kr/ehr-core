import type { Request, Response } from "express";
import { asyncHandler } from "../lib/asyncHandler";
import { paginationSchema } from "../lib/pagination";
import { recordAuditLog } from "../services/auditLog.service";
import { syncFhirResources, listFhirResources, getFhirResource } from "../services/fhir.service";

export const listFhirResourcesHandler = asyncHandler(async (req: Request, res: Response) => {
  const { page, pageSize } = paginationSchema.parse(req.query);
  const result = await listFhirResources(req.params.resourceType, page, pageSize);
  res.json(result);
});

export const getFhirResourceHandler = asyncHandler(async (req: Request, res: Response) => {
  res.json(await getFhirResource(req.params.id));
});

export const syncFhirResourcesHandler = asyncHandler(async (req: Request, res: Response) => {
  const start = Date.now();
  const organizationId = req.body?.organizationId as string;
  const result = await syncFhirResources(organizationId);

  await recordAuditLog({
    actorId: req.user?.sub,
    actorLabel: req.user?.email ?? "system",
    action: "fhir.synced",
    entityType: "Organization",
    entityId: organizationId,
    after: result,
    durationMs: Date.now() - start,
    correlationId: req.correlationId,
    traceId: req.traceId,
  });

  res.json(result);
});
