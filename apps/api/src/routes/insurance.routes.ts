import { Router } from "express";
import { requireAuth, requirePermission } from "../middleware/auth";
import {
  listInsuranceHandler,
  createInsuranceHandler,
  verifyInsuranceHandler,
} from "../controllers/insurance.controller";

export const insuranceRouter = Router();

insuranceRouter.use(requireAuth);

insuranceRouter.get("/", requirePermission("insurance:read"), listInsuranceHandler);
insuranceRouter.post("/", requirePermission("insurance:write"), createInsuranceHandler);
insuranceRouter.post("/:id/verify", requirePermission("insurance:write"), verifyInsuranceHandler);
