import { Router } from "express";
import { requireAuth, requirePermission } from "../middleware/auth";
import {
  listFhirResourcesHandler,
  getFhirResourceHandler,
  syncFhirResourcesHandler,
} from "../controllers/fhir.controller";

export const fhirRouter = Router();

fhirRouter.use(requireAuth);

fhirRouter.post("/sync", requirePermission("monitoring:read"), syncFhirResourcesHandler);
fhirRouter.get("/:resourceType", requirePermission("monitoring:read"), listFhirResourcesHandler);
fhirRouter.get("/resource/:id", requirePermission("monitoring:read"), getFhirResourceHandler);
