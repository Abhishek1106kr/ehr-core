import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { asyncHandler } from "../lib/asyncHandler";
import { prisma } from "../lib/prisma";
import { UnauthorizedError } from "../lib/errors";
import { signAuthToken, authCookieOptions, AUTH_COOKIE_NAME } from "../middleware/auth";
import { recordAuditLog } from "../services/auditLog.service";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const loginHandler = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = loginSchema.parse(req.body);

  const user = await prisma.user.findUnique({ where: { email } });
  const valid = user && (await bcrypt.compare(password, user.passwordHash));

  if (!user || !valid || !user.isActive) {
    await recordAuditLog({
      actorLabel: email,
      action: "auth.login_failed",
      entityType: "User",
      entityId: user?.id ?? "unknown",
      correlationId: req.correlationId,
      traceId: req.traceId,
      error: "Invalid credentials",
    });
    throw new UnauthorizedError("Invalid email or password");
  }

  const token = signAuthToken({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    organizationId: user.organizationId,
  });

  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

  res.cookie(AUTH_COOKIE_NAME, token, authCookieOptions());

  await recordAuditLog({
    actorId: user.id,
    actorLabel: user.email,
    action: "auth.login",
    entityType: "User",
    entityId: user.id,
    correlationId: req.correlationId,
    traceId: req.traceId,
  });

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      organizationId: user.organizationId,
    },
  });
});

export const logoutHandler = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie(AUTH_COOKIE_NAME);
  if (req.user) {
    await recordAuditLog({
      actorId: req.user.sub,
      actorLabel: req.user.email,
      action: "auth.logout",
      entityType: "User",
      entityId: req.user.sub,
      correlationId: req.correlationId,
      traceId: req.traceId,
    });
  }
  res.status(204).send();
});

export const meHandler = asyncHandler(async (req: Request, res: Response) => {
  res.json({ user: req.user });
});
