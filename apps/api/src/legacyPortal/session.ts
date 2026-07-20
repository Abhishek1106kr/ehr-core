import { randomUUID } from "crypto";

/**
 * The simulated legacy portal represents a hospital system with no modern
 * auth story of its own — a single shared staff login, session tracked
 * in-memory (this "system" has been running on one on-prem box since 2004).
 * Real deployments would never do this; it is deliberately primitive to
 * make the browser-automation fallback path feel authentic.
 */
const sessions = new Map<string, { createdAt: number }>();

export const LEGACY_PORTAL_COOKIE = "legacy_session";
export const LEGACY_PORTAL_USERNAME = "frontdesk";
export const LEGACY_PORTAL_PASSWORD = "legacy123";
const SESSION_TTL_MS = 30 * 60 * 1000;

export function createSession(): string {
  const token = randomUUID();
  sessions.set(token, { createdAt: Date.now() });
  return token;
}

export function isValidSession(token: string | undefined): boolean {
  if (!token) return false;
  const session = sessions.get(token);
  if (!session) return false;
  if (Date.now() - session.createdAt > SESSION_TTL_MS) {
    sessions.delete(token);
    return false;
  }
  return true;
}
