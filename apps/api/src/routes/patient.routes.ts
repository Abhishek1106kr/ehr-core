import { Router } from "express";
import { requireAuth, requirePermission } from "../middleware/auth";
import {
  listPatientsHandler,
  getPatientHandler,
  createPatientHandler,
  updatePatientHandler,
  deletePatientHandler,
} from "../controllers/patient.controller";

export const patientRouter = Router();

patientRouter.use(requireAuth);

/**
 * @openapi
 * /patients:
 *   get:
 *     summary: List patients (paginated, searchable by name/MRN/phone/email)
 *     tags: [Patients]
 */
patientRouter.get("/", requirePermission("patients:read"), listPatientsHandler);
patientRouter.get("/:id", requirePermission("patients:read"), getPatientHandler);
patientRouter.post("/", requirePermission("patients:write"), createPatientHandler);
patientRouter.patch("/:id", requirePermission("patients:write"), updatePatientHandler);
patientRouter.delete("/:id", requirePermission("patients:write"), deletePatientHandler);
