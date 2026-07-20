import Link from "next/link";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Server, Code2, ExternalLink } from "lucide-react";

export default function ApiReferencePage() {
  const endpoints = [
    {
      method: "POST",
      path: "/api/v1/auth/login",
      desc: "Authenticates user and returns JWT session cookie + token.",
    },
    {
      method: "GET",
      path: "/api/v1/auth/me",
      desc: "Returns current authenticated user payload.",
    },
    {
      method: "GET",
      path: "/api/v1/patients",
      desc: "Lists patients with search, pagination, and MRN filter.",
    },
    {
      method: "POST",
      path: "/api/v1/patients",
      desc: "Creates a new patient record with identity verification.",
    },
    {
      method: "GET",
      path: "/api/v1/appointments",
      desc: "Lists clinical appointments for the organization.",
    },
    {
      method: "POST",
      path: "/api/v1/appointments",
      desc: "Schedules a new appointment with idempotency protection.",
    },
    {
      method: "GET",
      path: "/api/v1/insurance",
      desc: "Lists patient insurance policies.",
    },
    {
      method: "POST",
      path: "/api/v1/insurance/:id/verify",
      desc: "Executes real-time EDI 270/271 insurance eligibility check.",
    },
    {
      method: "GET",
      path: "/api/v1/fhir/:type",
      desc: "Lists FHIR R4 JSON resources (Patient, Practitioner, Appointment, Coverage).",
    },
    {
      method: "POST",
      path: "/api/v1/fhir/sync",
      desc: "Triggers batch generation of FHIR R4 JSON resources.",
    },
    {
      method: "POST",
      path: "/api/v1/workflows/run",
      desc: "Enqueues an automated workflow (FHIR REST or Playwright browser mode).",
    },
    {
      method: "GET",
      path: "/api/v1/automation-jobs",
      desc: "Lists automation jobs and step status breakdown.",
    },
    {
      method: "POST",
      path: "/api/v1/consent",
      desc: "Creates patient data sharing consent record (HIPAA / ABDM).",
    },
    {
      method: "GET",
      path: "/api/v1/metrics",
      desc: "Returns operational telemetry metrics (uptime, memory, DB, queue stats).",
    },
    {
      method: "GET",
      path: "/health",
      desc: "Returns HTTP 200 health probe and server timestamp.",
    },
  ];

  return (
    <div className="flex min-h-dvh flex-col bg-background font-sans text-foreground">
      <LandingNavbar />

      <main className="flex-1 py-12">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/docs"
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <ArrowLeft className="h-3 w-3" /> Back to Docs
              </Link>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                REST API Reference
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Endpoints, authentication parameters, FHIR resources, and operational probes.
              </p>
            </div>

            <a
              href="http://localhost:4000/api/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90"
            >
              Interactive Swagger Docs
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="mt-8 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">
                  Authentication & Authorization
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-2">
                <p>
                  All REST API endpoints require an active session authenticated via the{" "}
                  <code className="rounded bg-muted px-1 py-0.5 font-mono">openehr_session</code>{" "}
                  HTTP-only cookie or a standard{" "}
                  <code className="rounded bg-muted px-1 py-0.5 font-mono">
                    Authorization: Bearer &lt;token&gt;
                  </code>{" "}
                  header.
                </p>
              </CardContent>
            </Card>

            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="border-b border-border bg-muted/30 px-4 py-3 text-xs font-semibold text-foreground">
                API Endpoint Specifications
              </div>
              <div className="divide-y divide-border">
                {endpoints.map((ep, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-2 text-xs"
                  >
                    <div className="flex items-center gap-3 font-mono">
                      <Badge
                        variant={
                          ep.method === "GET"
                            ? "secondary"
                            : ep.method === "POST"
                              ? "default"
                              : "outline"
                        }
                        className="text-[10px] w-14 justify-center"
                      >
                        {ep.method}
                      </Badge>
                      <span className="font-semibold text-foreground">{ep.path}</span>
                    </div>
                    <span className="text-muted-foreground">{ep.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
