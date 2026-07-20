import Link from "next/link";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  BookOpen,
  Users,
  Calendar,
  ShieldCheck,
  Database,
  ScrollText,
  Activity,
} from "lucide-react";

export default function UserGuidePage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background font-sans text-foreground">
      <LandingNavbar />

      <main className="flex-1 py-12">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/docs"
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <ArrowLeft className="h-3 w-3" /> Back to Docs
          </Link>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            User Operations Guide
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Complete guide for healthcare operations staff managing registration, scheduling, FHIR
            synchronization, and workflow monitoring.
          </p>

          <div className="mt-8 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  1. Smart Patient Intake & Verification
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-2 leading-relaxed">
                <p>
                  Navigate to <code className="rounded bg-muted px-1 py-0.5">/patients</code> to
                  register new patients. Enter demographic information including MRN, legal name,
                  date of birth, preferred language, and Aadhaar/National ID.
                </p>
                <p>
                  The system automatically calculates a{" "}
                  <span className="font-semibold text-foreground">Verification Score</span> and
                  assigns a status badge (<code className="text-emerald-500">VERIFIED</code>,{" "}
                  <code className="text-amber-500">PENDING</code>, or{" "}
                  <code className="text-rose-500">FAILED</code>).
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  2. Appointment Scheduling & Integration Routing
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-2 leading-relaxed">
                <p>
                  Navigate to <code className="rounded bg-muted px-1 py-0.5">/appointments</code> to
                  view provider schedules. Every booking evaluates the organization&apos;s
                  integration mode:
                </p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>
                    <span className="font-semibold text-foreground">FHIR REST Mode</span>: Direct
                    REST API update producing a spec-compliant FHIR R4 Appointment resource.
                  </li>
                  <li>
                    <span className="font-semibold text-foreground">Browser Automation Mode</span>:
                    Enqueues a Playwright Chromium job that navigates the legacy hospital portal
                    DOM.
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  3. Real-Time Insurance Eligibility Check
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-2 leading-relaxed">
                <p>
                  On <code className="rounded bg-muted px-1 py-0.5">/insurance</code>, view active
                  patient insurance policies. Click{" "}
                  <span className="font-semibold text-foreground">
                    &quot;Verify Eligibility&quot;
                  </span>{" "}
                  to run an EDI 270/271 status query returning policy active state, deductible
                  balance, and co-pay requirements.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  4. FHIR R4 Resource Explorer & Sync
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-2 leading-relaxed">
                <p>
                  Visit <code className="rounded bg-muted px-1 py-0.5">/fhir</code> to inspect
                  standard FHIR R4 JSON payloads for <code className="font-mono">Patient</code>,{" "}
                  <code className="font-mono">Practitioner</code>,{" "}
                  <code className="font-mono">Appointment</code>, and{" "}
                  <code className="font-mono">Coverage</code>. Use the{" "}
                  <span className="font-semibold text-foreground">
                    &quot;Sync from Database&quot;
                  </span>{" "}
                  button to batch-generate FHIR resources.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ScrollText className="h-5 w-5 text-primary" />
                  5. Compliance Audit Logs
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-2 leading-relaxed">
                <p>
                  Navigate to <code className="rounded bg-muted px-1 py-0.5">/audit-logs</code> to
                  view the append-only HIPAA/ABDM audit record. Expand any row to inspect pre and
                  post state change JSON snapshots along with W3C trace IDs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
