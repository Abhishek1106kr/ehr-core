import { Router } from "express";
import { requireAuth, requirePermission } from "../middleware/auth";
import {
  listAutomationJobsHandler,
  getAutomationJobHandler,
} from "../controllers/automationJob.controller";

export const automationJobRouter = Router();

automationJobRouter.use(requireAuth);
automationJobRouter.get("/", requirePermission("monitoring:read"), listAutomationJobsHandler);
automationJobRouter.get("/:id", requirePermission("monitoring:read"), getAutomationJobHandler);
