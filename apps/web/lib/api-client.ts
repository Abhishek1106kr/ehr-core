import type { ApiError } from "@openehr-bridge/shared";

/**
 * The frontend makes requests to /api/v1/* (Next.js API routes).
 * These routes proxy to the actual backend (NEXT_PUBLIC_API_URL).
 */
const API_BASE = "/api/v1";

export class ApiRequestError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
}

/**
 * All requests carry the session cookie (credentials: "include") — the
 * dashboard is a first-party SPA-style client of this API, not a public
 * consumer, so cookie auth (rather than bearer tokens in JS-readable
 * storage) is the safer default here.
 */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const base =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const url = new URL(`${API_BASE}${path}`, base);

  if (options.params) {
    for (const [key, value] of Object.entries(options.params)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }

  let res: Response;
  try {
    res = await fetch(url.toString(), {
      method: options.method ?? "GET",
      credentials: "include",
      headers: options.body ? { "Content-Type": "application/json" } : undefined,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
  } catch (err) {
    throw new ApiRequestError(
      503,
      "SERVICE_UNAVAILABLE",
      `Unable to connect to API server. Please ensure the backend dev server is running.`,
    );
  }

  if (res.status === 204) return undefined as T;

  const contentType = res.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json") ? await res.json() : undefined;

  if (!res.ok) {
    const err = payload as ApiError | undefined;
    throw new ApiRequestError(
      res.status,
      err?.error?.code ?? "UNKNOWN_ERROR",
      err?.error?.message ?? `Request failed with status ${res.status}`,
      err?.error?.details,
    );
  }

  return payload as T;
}

/** Resolves an API-relative asset path (e.g. a captured screenshot) to a full URL. */
export function apiAssetUrl(assetPath: string): string {
  const base =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return new URL(`${API_BASE}${assetPath}`, base).toString();
}
