import { Router } from "express";
import { requireAuth, requirePermission } from "../middleware/auth";
import { getDashboardSummaryHandler } from "../controllers/dashboard.controller";

export const dashboardRouter = Router();

dashboardRouter.use(requireAuth);
dashboardRouter.get("/summary", requirePermission("monitoring:read"), getDashboardSummaryHandler);
