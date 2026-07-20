import { Router } from "express";
import { requireAuth, requirePermission } from "../middleware/auth";
import {
  enqueueAppointmentBookingHandler,
  enqueueInsuranceVerificationHandler,
} from "../controllers/workflow.controller";

export const workflowRouter = Router();

workflowRouter.use(requireAuth);

workflowRouter.post(
  "/appointment-booking",
  requirePermission("appointments:write"),
  enqueueAppointmentBookingHandler,
);
workflowRouter.post(
  "/insurance-verification",
  requirePermission("insurance:write"),
  enqueueInsuranceVerificationHandler,
);
