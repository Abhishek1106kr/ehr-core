import { Router } from "express";
import { requireAuth, requirePermission } from "../middleware/auth";
import {
  listAppointmentsHandler,
  getAppointmentHandler,
  createAppointmentHandler,
  rescheduleAppointmentHandler,
  cancelAppointmentHandler,
} from "../controllers/appointment.controller";

export const appointmentRouter = Router();

appointmentRouter.use(requireAuth);

appointmentRouter.get("/", requirePermission("appointments:read"), listAppointmentsHandler);
appointmentRouter.get("/:id", requirePermission("appointments:read"), getAppointmentHandler);
appointmentRouter.post("/", requirePermission("appointments:write"), createAppointmentHandler);
appointmentRouter.patch(
  "/:id/reschedule",
  requirePermission("appointments:write"),
  rescheduleAppointmentHandler,
);
appointmentRouter.patch(
  "/:id/cancel",
  requirePermission("appointments:write"),
  cancelAppointmentHandler,
);
