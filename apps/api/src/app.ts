import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env";
import { logger } from "./lib/logger";
import { swaggerSpec } from "./lib/swagger";
import { requestContext } from "./middleware/requestContext";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

import { authRouter } from "./routes/auth.routes";
import { patientRouter } from "./routes/patient.routes";
import { doctorRouter } from "./routes/doctor.routes";
import { appointmentRouter } from "./routes/appointment.routes";
import { insuranceRouter } from "./routes/insurance.routes";
import { auditLogRouter } from "./routes/auditLog.routes";
import { organizationRouter } from "./routes/organization.routes";
import { automationJobRouter } from "./routes/automationJob.routes";
import { dashboardRouter } from "./routes/dashboard.routes";
import { fhirRouter } from "./routes/fhir.routes";
import { workflowRouter } from "./routes/workflow.routes";
import { legacyPortalRouter } from "./legacyPortal/legacyPortal.routes";
import { consentRouter } from "./routes/consent.routes";
import { collectSystemMetrics } from "./services/metrics.service";
import path from "node:path";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(
    cors({
      origin: env.WEB_ORIGIN,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(requestContext);
  app.use(
    pinoHttp({
      logger,
      genReqId: (req) => (req as express.Request).traceId,
      customLogLevel: (_req, res) => (res.statusCode >= 500 ? "error" : "info"),
    }),
  );

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "openehr-bridge-api", timestamp: new Date().toISOString() });
  });

  app.get("/api/v1/metrics", async (_req, res) => {
    const metrics = await collectSystemMetrics();
    res.json(metrics);
  });

  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/patients", patientRouter);
  app.use("/api/v1/doctors", doctorRouter);
  app.use("/api/v1/appointments", appointmentRouter);
  app.use("/api/v1/insurance", insuranceRouter);
  app.use("/api/v1/audit-logs", auditLogRouter);
  app.use("/api/v1/organizations", organizationRouter);
  app.use("/api/v1/automation-jobs", automationJobRouter);
  app.use("/api/v1/dashboard", dashboardRouter);
  app.use("/api/v1/fhir", fhirRouter);
  app.use("/api/v1/workflows", workflowRouter);
  app.use("/api/v1/consent", consentRouter);

  // Simulated legacy hospital portal — driven by Playwright, not our auth.
  app.use("/legacy-portal", legacyPortalRouter);

  // Screenshots captured by the browser-automation engine.
  app.use("/storage", express.static(path.join(__dirname, "..", "storage")));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
