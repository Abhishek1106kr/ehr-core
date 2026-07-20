import { Router } from "express";
import { requireAuth, requirePermission } from "../middleware/auth";
import {
  createConsentHandler,
  revokeConsentHandler,
  getConsentHandler,
  listPatientConsentHandler,
} from "../controllers/consent.controller";

export const consentRouter = Router();

consentRouter.use(requireAuth);

consentRouter.post("/", requirePermission("patients:write"), createConsentHandler);
consentRouter.get("/:id", requirePermission("patients:read"), getConsentHandler);
consentRouter.post("/:id/revoke", requirePermission("patients:write"), revokeConsentHandler);
consentRouter.get(
  "/patient/:patientId",
  requirePermission("patients:read"),
  listPatientConsentHandler,
);
