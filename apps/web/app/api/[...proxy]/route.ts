/**
 * API proxy: All /api/* requests from the browser are forwarded to the backend.
 * This allows the frontend to reach the private backend at ehr-core.railway.internal
 * since the Next.js server (not the browser) makes the actual request.
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function GET(request: Request, { params }: { params: Promise<{ proxy: string[] }> }) {
  return proxyRequest(request, params, "GET");
}

export async function POST(request: Request, { params }: { params: Promise<{ proxy: string[] }> }) {
  return proxyRequest(request, params, "POST");
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ proxy: string[] }> },
) {
  return proxyRequest(request, params, "PATCH");
}

export async function PUT(request: Request, { params }: { params: Promise<{ proxy: string[] }> }) {
  return proxyRequest(request, params, "PUT");
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ proxy: string[] }> },
) {
  return proxyRequest(request, params, "DELETE");
}

async function proxyRequest(
  request: Request,
  params: Promise<{ proxy: string[] }>,
  method: string,
) {
  try {
    const reqUrl = new URL(request.url);
    const path = reqUrl.pathname;
    const url = new URL(path, BACKEND_URL);

    // Forward query params
    const { searchParams } = new URL(request.url);
    searchParams.forEach((value, key) => {
      url.searchParams.set(key, value);
    });

    // Create a new Headers object from the request headers
    const proxyHeaders = new Headers(request.headers);
    // Remove host header to avoid conflicts
    proxyHeaders.delete("host");

    // Build request options
    const options: RequestInit = {
      method,
      headers: proxyHeaders,
      // Forward cookies and credentials
      credentials: "include",
    };

    // Forward body for POST/PUT/PATCH
    if (["POST", "PUT", "PATCH"].includes(method)) {
      options.body = await request.text();
    }

    // Make the request to the backend
    const response = await fetch(url.toString(), options);

    // Forward the response
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return new Response(
      JSON.stringify({
        error: {
          code: "PROXY_ERROR",
          message: "Failed to reach backend",
        },
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
