import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { UnauthorizedError, ForbiddenError } from "../lib/errors";
import { hasPermission, type UserRole } from "@openehr-bridge/shared";

export interface AuthTokenPayload {
  sub: string; // user id
  email: string;
  name: string;
  role: UserRole;
  organizationId: string | null;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: AuthTokenPayload;
  }
}

const AUTH_COOKIE = "openehr_session";

export function signAuthToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
}

export function authCookieOptions() {
  return {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: "lax" as const,
    path: "/",
    maxAge: env.SESSION_IDLE_TIMEOUT_MINUTES * 60 * 1000,
  };
}

export const AUTH_COOKIE_NAME = AUTH_COOKIE;

/** Requires a valid session; rejects with 401 otherwise. */
export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const bearer = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.slice(7)
    : undefined;
  const token = req.cookies?.[AUTH_COOKIE] ?? bearer;

  if (!token) {
    return next(new UnauthorizedError());
  }

  try {
    req.user = jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;
    next();
  } catch {
    next(new UnauthorizedError("Session expired or invalid. Please sign in again."));
  }
}

/** Requires the authenticated user's role to carry `permission` (e.g. "patients:write"). */
export function requirePermission(permission: string) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError());
    }
    if (!hasPermission(req.user.role, permission)) {
      return next(new ForbiddenError(`Role "${req.user.role}" lacks permission "${permission}"`));
    }
    next();
  };
}
