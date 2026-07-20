import Link from "next/link";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Monitor,
  ArrowLeft,
  ExternalLink,
  Activity,
  ScrollText,
  Database,
  MousePointerClick,
  Workflow,
  Users,
  Calendar,
} from "lucide-react";

export default function ScreenshotsPage() {
  const screenshots = [
    {
      title: "Operations Dashboard",
      route: "/dashboard",
      category: "Operations",
      icon: Activity,
      desc: "Real-time metrics overview displaying today's appointments, pending insurance checks, automation success rate %, failed workflows, average response latency, and active doctors.",
      highlights: ["Metric Cards", "Workflow Status Breakdown Chart", "Recent Activity Feed"],
    },
    {
      title: "Automation Engine Timeline",
      route: "/automation",
      category: "Automation",
      icon: Workflow,
      desc: "Live job monitoring queue displaying pending, running, retrying, and dead-letter automation jobs with exponential backoff status.",
      highlights: ["Run Demo Workflow Trigger", "Real-Time Polling", "Step Duration Analytics"],
    },
    {
      title: "FHIR R4 Resource Explorer",
      route: "/fhir",
      category: "Standards",
      icon: Database,
      desc: "Spec-compliant FHIR R4 JSON resource inspector supporting Patient, Practitioner, Appointment, and Coverage resources with batch sync triggers.",
      highlights: ["JSON Syntax Highlighter", "Resource Filtering", "Batch FHIR Sync Button"],
    },
    {
      title: "Browser Automation Fallback",
      route: "/browser-automation",
      category: "Legacy EHR",
      icon: MousePointerClick,
      desc: "Playwright Chromium execution log inspector showing step screenshots, DOM selector actions, and 2006 legacy hospital portal interactions.",
      highlights: ["Visual Screenshot Preview", "Step Logs", "40% Transient Retry Simulation"],
    },
    {
      title: "Audit Logging System",
      route: "/audit-logs",
      category: "Compliance",
      icon: ScrollText,
      desc: "HIPAA and ABDM compliant append-only audit trail logging actor ID, action taxonomy, entity type, pre/post state JSON snapshots, and W3C trace IDs.",
      highlights: ["State Snapshots (Before/After)", "Trace ID Linking", "Action Filtering"],
    },
    {
      title: "Monitoring & System Telemetry",
      route: "/monitoring",
      category: "Observability",
      icon: Activity,
      desc: "Operational health status dashboard monitoring API latency, active user connections, BullMQ queue stats, and system memory RSS.",
      highlights: ["/api/v1/metrics Endpoint", "System Health Probes", "Queue Latency Metrics"],
    },
    {
      title: "Patient Directory",
      route: "/patients",
      category: "Clinical Directory",
      icon: Users,
      desc: "Comprehensive patient directory displaying MRN numbers, identity verification status (Aadhaar/SSN), verification scores, and emergency contacts.",
      highlights: ["Smart Patient Intake", "Verification Badges", "Language Preference Filters"],
    },
    {
      title: "Appointment Management",
      route: "/appointments",
      category: "Scheduling",
      icon: Calendar,
      desc: "Clinical schedule manager tracking requested, confirmed, rescheduled, and cancelled appointments with integration mode tags (FHIR REST vs Browser Automation).",
      highlights: ["Integration Mode Badges", "Provider Schedules", "Idempotent Booking"],
    },
  ];

  return (
    <div className="flex min-h-dvh flex-col bg-background font-sans text-foreground">
      <LandingNavbar />

      <main className="flex-1 py-12">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div>
            <Link
              href="/"
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <ArrowLeft className="h-3 w-3" /> Back to Home
            </Link>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Visual Screenshots & Interface Gallery
            </h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
              Explore the user interfaces, dashboards, monitoring timeline, and compliance tools
              built into OpenEHR Bridge.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {screenshots.map((item, index) => (
              <Card
                key={index}
                className="group flex flex-col justify-between overflow-hidden transition-all hover:border-primary/50 hover:shadow-md"
              >
                <div>
                  <div className="aspect-video w-full border-b border-border bg-card p-6 flex flex-col items-center justify-center text-center">
                    <item.icon className="h-10 w-10 text-primary/40 group-hover:text-primary transition-colors" />
                    <span className="mt-2 text-xs font-semibold text-foreground">{item.title}</span>
                    <Badge variant="secondary" className="mt-2 text-[10px]">
                      {item.category}
                    </Badge>
                  </div>
                  <CardHeader className="p-5">
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription className="text-xs leading-relaxed">
                      {item.desc}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-5 pb-5 text-xs">
                    <p className="font-semibold text-foreground mb-1.5">Key Technical Features:</p>
                    <ul className="space-y-1 text-muted-foreground">
                      {item.highlights.map((h, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </div>

                <div className="border-t border-border p-4 bg-muted/20">
                  <Button asChild variant="outline" size="sm" className="w-full gap-1.5">
                    <Link href={item.route}>
                      Open Interactive Screen
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
