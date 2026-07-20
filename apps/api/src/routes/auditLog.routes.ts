import { Router } from "express";
import { requireAuth, requirePermission } from "../middleware/auth";
import { listAuditLogsHandler } from "../controllers/auditLog.controller";

export const auditLogRouter = Router();

auditLogRouter.use(requireAuth);
auditLogRouter.get("/", requirePermission("audit:read"), listAuditLogsHandler);
