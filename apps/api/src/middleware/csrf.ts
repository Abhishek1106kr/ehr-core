import type { Request, Response, NextFunction } from "express";
import crypto from "node:crypto";
import { ForbiddenError } from "../lib/errors";

export const CSRF_HEADER_NAME = "x-csrf-token";
export const CSRF_COOKIE_NAME = "openehr_csrf";

export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Double-submit CSRF verification middleware for state-changing HTTP requests.
 * Exempts GET, HEAD, OPTIONS requests and checks x-csrf-token header against openehr_csrf cookie.
 */
export function requireCsrfToken(req: Request, res: Response, next: NextFunction) {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    return next();
  }

  const cookieToken = req.cookies?.[CSRF_COOKIE_NAME];
  const headerToken = req.headers[CSRF_HEADER_NAME] as string | undefined;

  // In local development or API test clients carrying bearer tokens, skip if Header & Cookie missing
  if (!cookieToken && req.headers.authorization?.startsWith("Bearer ")) {
    return next();
  }

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return next(new ForbiddenError("Invalid or missing CSRF token. Please refresh and try again."));
  }

  next();
}
