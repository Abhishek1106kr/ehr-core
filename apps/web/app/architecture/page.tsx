import Link from "next/link";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Layers,
  Database,
  MousePointerClick,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  Server,
  Workflow,
} from "lucide-react";

export default function ArchitecturePage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background font-sans text-foreground">
      <LandingNavbar />

      <main className="flex-1 py-12">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Link
                  href="/docs"
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  <ArrowLeft className="h-3 w-3" /> Back to Docs
                </Link>
              </div>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                System Architecture & Design Blueprint
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                High-Level Design (HLD), Low-Level Design (LLD), and sequence flows for OpenEHR
                Bridge.
              </p>
            </div>

            <Button asChild size="sm" className="gap-2">
              <Link href="/dashboard">
                Launch Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Section 1: HLD Overview */}
          <div className="mt-10 space-y-8">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Architecture Overview</Badge>
                </div>
                <CardTitle className="text-xl">High Level Architecture (HLD)</CardTitle>
                <CardDescription>
                  Decoupled multi-tier architecture isolating HTTP client requests from background
                  queue workers.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-xl border border-border bg-card p-6 font-mono text-xs shadow-sm">
                  <div className="grid gap-4 md:grid-cols-3 text-center">
                    <div className="rounded-lg bg-blue-500/10 p-4 text-blue-600 dark:text-blue-400">
                      <p className="font-bold">Client / Ingestion Layer</p>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        Next.js App / AI Agents / Voice & OCR
                      </p>
                    </div>
                    <div className="rounded-lg bg-purple-500/10 p-4 text-purple-600 dark:text-purple-400">
                      <p className="font-bold">API Gateway & Strategy Router</p>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        Express API / JWT Auth / CircuitBreakers
                      </p>
                    </div>
                    <div className="rounded-lg bg-emerald-500/10 p-4 text-emerald-600 dark:text-emerald-400">
                      <p className="font-bold">Execution Engine Layer</p>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        BullMQ Redis Queue / Playwright Worker
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-border p-4">
                    <h3 className="text-sm font-semibold flex items-center gap-2 text-primary">
                      <Database className="h-4 w-4" />
                      FHIR R4 Adapter Strategy
                    </h3>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                      Converts domain entities (`Patient`, `Doctor`, `Appointment`, `Insurance`)
                      into spec-compliant HL7 FHIR R4 JSON payloads (`Patient`, `Practitioner`,
                      `Appointment`, `Coverage`).
                    </p>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <h3 className="text-sm font-semibold flex items-center gap-2 text-primary">
                      <MousePointerClick className="h-4 w-4" />
                      Playwright Browser Driver
                    </h3>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                      Drives headless Chromium to navigate legacy web EHR portals
                      (`/legacy-portal`), logging step durations and saving PNG screenshot audit
                      trails.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 2: Sequence Flows */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Workflow Execution Sequence</CardTitle>
                <CardDescription>
                  Step-by-step event progression from client trigger to final audit logging.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="space-y-2 border-l-2 border-primary/40 pl-4">
                  <p className="font-semibold text-foreground">1. Workflow Initiation</p>
                  <p className="text-muted-foreground">
                    Client posts request to `/api/v1/workflows/run` carrying workflow type and
                    parameters.
                  </p>
                </div>
                <div className="space-y-2 border-l-2 border-primary/40 pl-4">
                  <p className="font-semibold text-foreground">
                    2. Mode Resolution (`chooseIntegrationMode`)
                  </p>
                  <p className="text-muted-foreground">
                    Engine evaluates organization config rows to select `FHIR_REST` or
                    `BROWSER_AUTOMATION`.
                  </p>
                </div>
                <div className="space-y-2 border-l-2 border-primary/40 pl-4">
                  <p className="font-semibold text-foreground">3. Queue Enqueue & Step Logging</p>
                  <p className="text-muted-foreground">
                    Enqueues job into BullMQ Redis Queue and initializes `AutomationJob` +
                    `WorkflowStep` rows.
                  </p>
                </div>
                <div className="space-y-2 border-l-2 border-primary/40 pl-4">
                  <p className="font-semibold text-foreground">4. Execution & Automatic Retry</p>
                  <p className="text-muted-foreground">
                    Worker executes Playwright DOM script. On transient failure, exponential backoff
                    retries up to 3 times.
                  </p>
                </div>
                <div className="space-y-2 border-l-2 border-primary/40 pl-4">
                  <p className="font-semibold text-foreground">
                    5. Screenshot Capture & Audit Verification
                  </p>
                  <p className="text-muted-foreground">
                    Saves step screenshots to storage and writes append-only `AuditLog` entry with
                    correlation context.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
