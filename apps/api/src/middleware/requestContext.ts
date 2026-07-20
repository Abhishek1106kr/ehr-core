import { randomUUID } from "crypto";
import type { NextFunction, Request, Response } from "express";

// Every request gets a traceId (unique per HTTP call) and a correlationId
// (propagated from the client if provided, e.g. so a multi-step workflow
// kicked off by one user action can be traced end-to-end across retries).
declare module "express-serve-static-core" {
  interface Request {
    traceId: string;
    correlationId: string;
  }
}

export function requestContext(req: Request, res: Response, next: NextFunction) {
  req.traceId = randomUUID();
  req.correlationId = (req.headers["x-correlation-id"] as string) || randomUUID();
  res.setHeader("x-trace-id", req.traceId);
  res.setHeader("x-correlation-id", req.correlationId);
  next();
}
