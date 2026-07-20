import { Router } from "express";
import { requireAuth, requirePermission } from "../middleware/auth";
import {
  getOrganizationHandler,
  updateOrganizationHandler,
} from "../controllers/organization.controller";

export const organizationRouter = Router();

organizationRouter.use(requireAuth);

organizationRouter.get("/:id", getOrganizationHandler);
organizationRouter.patch("/:id", requirePermission("*"), updateOrganizationHandler);
