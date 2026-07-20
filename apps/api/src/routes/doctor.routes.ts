import { Router } from "express";
import { requireAuth, requirePermission } from "../middleware/auth";
import {
  listDoctorsHandler,
  findAvailableDoctorsHandler,
  getDoctorHandler,
  createDoctorHandler,
  updateDoctorHandler,
  deactivateDoctorHandler,
} from "../controllers/doctor.controller";

export const doctorRouter = Router();

doctorRouter.use(requireAuth);

doctorRouter.get("/", requirePermission("patients:read"), listDoctorsHandler);
doctorRouter.get("/available", requirePermission("patients:read"), findAvailableDoctorsHandler);
doctorRouter.get("/:id", requirePermission("patients:read"), getDoctorHandler);
doctorRouter.post("/", requirePermission("patients:write"), createDoctorHandler);
doctorRouter.patch("/:id", requirePermission("patients:write"), updateDoctorHandler);
doctorRouter.delete("/:id", requirePermission("patients:write"), deactivateDoctorHandler);
