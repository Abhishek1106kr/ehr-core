import Link from "next/link";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GithubIcon } from "@/components/landing/github-icon";
import {
  ArrowRight,
  Bot,
  Database,
  MousePointerClick,
  ShieldCheck,
  Mic,
  FileText,
  ScrollText,
  Activity,
  Layers,
  Workflow,
  Sparkles,
  BookOpen,
  Monitor,
  Rocket,
  CheckCircle2,
  Server,
  Code2,
  ExternalLink,
  Zap,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background font-sans text-foreground">
      {/* Sticky Responsive Header */}
      <LandingNavbar />

      <main className="flex-1">
        {/* ======================================================================== */}
        {/* HERO SECTION */}
        {/* ======================================================================== */}
        <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-primary/5 via-background to-background py-20 lg:py-28">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center">
              {/* Eyebrow Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary shadow-xs">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Open-Source Enterprise Healthcare Architecture</span>
              </div>

              {/* Headline */}
              <h1 className="mt-6 max-w-4xl text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-[1.15]">
                Bridge AI Agents with <span className="text-primary">FHIR R4 Standards</span> &
                Legacy EHR Portals
              </h1>

              {/* Subtitle / Pitch */}
              <p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed sm:text-xl">
                OpenEHR Bridge provides a unified abstraction layer that connects modern AI
                workflows directly to healthcare infrastructure — supporting both modern FHIR R4
                APIs and legacy web EHRs via automated browser execution.
              </p>

              {/* Primary & Secondary CTAs */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Button size="lg" asChild className="gap-2 px-6 shadow-md">
                  <Link href="/dashboard">
                    Launch Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="gap-2 px-6">
                  <Link href="/docs">
                    <BookOpen className="h-4 w-4" />
                    View Documentation
                  </Link>
                </Button>
                <Button size="lg" variant="secondary" asChild className="gap-2 px-6">
                  <a
                    href="https://github.com/Abhishek1106kr/ehr-core"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <GithubIcon className="h-4 w-4" />
                    GitHub Repo
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  asChild
                  className="gap-2 px-6 text-muted-foreground"
                >
                  <Link href="/automation">
                    <Zap className="h-4 w-4 text-amber-500" />
                    Live Demo Workflows
                  </Link>
                </Button>
              </div>

              {/* Trust Metrics Bar */}
              <div className="mt-12 grid w-full max-w-3xl grid-cols-2 gap-4 rounded-xl border border-border bg-card/60 p-4 shadow-sm backdrop-blur-xs sm:grid-cols-4">
                <div className="p-2">
                  <p className="text-2xl font-bold text-foreground">100%</p>
                  <p className="text-xs text-muted-foreground">FHIR R4 Compliant</p>
                </div>
                <div className="p-2">
                  <p className="text-2xl font-bold text-foreground">Playwright</p>
                  <p className="text-xs text-muted-foreground">Legacy EHR Fallback</p>
                </div>
                <div className="p-2">
                  <p className="text-2xl font-bold text-foreground">BullMQ</p>
                  <p className="text-xs text-muted-foreground">Redis Queue Engine</p>
                </div>
                <div className="p-2">
                  <p className="text-2xl font-bold text-foreground">HIPAA/ABDM</p>
                  <p className="text-xs text-muted-foreground">Audit & Consent Trace</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================================== */}
        {/* FEATURES SECTION */}
        {/* ======================================================================== */}
        <section id="features" className="py-20 border-b border-border/40">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <Badge variant="outline" className="mb-3">
                Core System Capabilities
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Enterprise Integration Modules
              </h2>
              <p className="mt-4 text-base text-muted-foreground">
                Engineered for maximum reliability and interoperability across modern APIs and
                legacy hospital software.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Card 1 */}
              <Card className="flex flex-col justify-between transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <Bot className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">AI Workflow Engine</CardTitle>
                  <CardDescription>
                    Orchestrates autonomous clinical intake, patient lookup, and appointment
                    booking.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">Technical Highlights:</span> Zod
                  schema parsing, structured action dispatch, BullMQ job queues, exponential
                  retries.
                </CardContent>
              </Card>

              {/* Card 2 */}
              <Card className="flex flex-col justify-between transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Database className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">FHIR R4 Integration</CardTitle>
                  <CardDescription>
                    Bidirectional converter mapping domain entities to HL7 FHIR R4 JSON resources.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">Technical Highlights:</span> Maps
                  Patient, Practitioner, Appointment, Coverage resources with spec validation.
                </CardContent>
              </Card>

              {/* Card 3 */}
              <Card className="flex flex-col justify-between transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <MousePointerClick className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">Legacy Browser Automation</CardTitle>
                  <CardDescription>
                    Headless Playwright Chromium driver interacting with dated HTML EHR portals.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">Technical Highlights:</span>{" "}
                  Step-by-step visual screenshot audit trail, DOM selector recovery, transient retry
                  simulation.
                </CardContent>
              </Card>

              {/* Card 4 */}
              <Card className="flex flex-col justify-between transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">Insurance Verification</CardTitle>
                  <CardDescription>
                    Real-time eligibility verification checking member status, copay, and deductible
                    details.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">Technical Highlights:</span>{" "}
                  Automated clearinghouse integration, EDI 270/271 status checks, coverage breakdown
                  caching.
                </CardContent>
              </Card>

              {/* Card 5 */}
              <Card className="flex flex-col justify-between transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
                    <Mic className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">AI Voice Intake</CardTitle>
                  <CardDescription>
                    Conversational audio intake processing transcribing speech to structured JSON
                    records.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">Technical Highlights:</span>{" "}
                  Multimodal speech-to-text pipeline, entity extraction, prompt safety validation.
                </CardContent>
              </Card>

              {/* Card 6 */}
              <Card className="flex flex-col justify-between transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                    <FileText className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">OCR Document Parsing</CardTitle>
                  <CardDescription>
                    Automated document OCR extracting patient IDs, insurance cards, and medical
                    histories.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">Technical Highlights:</span> Image
                  pre-processing, structured data extraction, PII masking algorithms.
                </CardContent>
              </Card>

              {/* Card 7 */}
              <Card className="flex flex-col justify-between transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <ScrollText className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">HIPAA / ABDM Audit Logs</CardTitle>
                  <CardDescription>
                    Append-only audit trail logging actor ID, entity states, timestamps, and trace
                    context.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">Technical Highlights:</span> State
                  change snapshots (before/after), correlation ID propagation, immutable storage.
                </CardContent>
              </Card>

              {/* Card 8 */}
              <Card className="flex flex-col justify-between transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
                    <Activity className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">Real-Time Monitoring</CardTitle>
                  <CardDescription>
                    Operational dashboard tracking job status, response latencies, and active
                    providers.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">Technical Highlights:</span>{" "}
                  Prometheus metrics endpoint (`/api/v1/metrics`), Pino structured logging, health
                  checks.
                </CardContent>
              </Card>

              {/* Card 9 */}
              <Card className="flex flex-col justify-between transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400">
                    <Layers className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">Integration Strategy Router</CardTitle>
                  <CardDescription>
                    Dynamic switcher routing calls between FHIR REST APIs or Playwright browser
                    engines.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">Technical Highlights:</span>{" "}
                  `chooseIntegrationMode()` evaluation, organizational override rules, resilient
                  circuit breakers.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* ======================================================================== */}
        {/* WORKFLOW SECTION */}
        {/* ======================================================================== */}
        <section id="workflow" className="py-20 bg-muted/20 border-b border-border/40">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <Badge variant="outline" className="mb-3">
                End-to-End Orchestration
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                How OpenEHR Bridge Works
              </h2>
              <p className="mt-4 text-base text-muted-foreground">
                Follow an automated healthcare workflow from patient intake to audit logging.
              </p>
            </div>

            {/* Visual Workflow Steps */}
            <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  step: "01",
                  title: "Patient Intake",
                  desc: "Voice recording, OCR document scan, or web form submission.",
                  icon: Mic,
                },
                {
                  step: "02",
                  title: "AI Parsing & Safety",
                  desc: "Structured entity extraction with prompt injection defense & PII masking.",
                  icon: Bot,
                },
                {
                  step: "03",
                  title: "Identity Verification",
                  desc: "Aadhaar / National ID validation & confidence score calculation.",
                  icon: ShieldCheck,
                },
                {
                  step: "04",
                  title: "FHIR Mapping",
                  desc: "Conversion of domain model into HL7 FHIR R4 JSON Patient resource.",
                  icon: Database,
                },
                {
                  step: "05",
                  title: "Insurance Check",
                  desc: "Real-time eligibility check for member coverage status & co-pay.",
                  icon: FileText,
                },
                {
                  step: "06",
                  title: "Booking Execution",
                  desc: "Automated dispatch via FHIR REST API or Playwright browser driver.",
                  icon: MousePointerClick,
                },
                {
                  step: "07",
                  title: "Notification",
                  desc: "SMS / email confirmation with idempotency key tracking.",
                  icon: CheckCircle2,
                },
                {
                  step: "08",
                  title: "Audit & Dashboard",
                  desc: "Append-only audit log entry and real-time dashboard update.",
                  icon: ScrollText,
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="relative flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-xs transition-transform hover:-translate-y-1"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black text-primary/40">{item.step}</span>
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="mt-3 text-base font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ======================================================================== */}
        {/* ARCHITECTURE PREVIEW SECTION */}
        {/* ======================================================================== */}
        <section className="py-20 border-b border-border/40">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <Badge variant="outline" className="mb-3">
                  System Architecture
                </Badge>
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Built for Enterprise Resilience & Scalability
                </h2>
                <p className="mt-4 text-base text-muted-foreground leading-relaxed">
                  OpenEHR Bridge isolates background job execution from HTTP web traffic using
                  BullMQ queues, stateful circuit breakers, and spec-compliant FHIR R4 resource
                  mappers.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button asChild className="gap-2">
                    <Link href="/architecture">
                      <Layers className="h-4 w-4" />
                      View Architecture Diagram
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="gap-2">
                    <Link href="/docs/developer-guide">
                      <Code2 className="h-4 w-4" />
                      Developer Architecture Guide
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Architecture Graphic Mockup */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-md">
                <div className="flex items-center gap-2 border-b border-border pb-4">
                  <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 font-mono text-xs text-muted-foreground">
                    High-Level Topology
                  </span>
                </div>
                <div className="mt-6 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                    <span className="font-semibold text-primary">Client Layer</span>
                    <span className="text-muted-foreground">Next.js App / AI Agents / REST</span>
                  </div>
                  <div className="text-center text-muted-foreground">↓ HTTP / REST Gateway</div>
                  <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                    <span className="font-semibold text-primary">Express API & Middleware</span>
                    <span className="text-muted-foreground">
                      JWT / RBAC / Pino / CircuitBreaker
                    </span>
                  </div>
                  <div className="text-center text-muted-foreground">↓ Strategy Router</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-emerald-500/10 p-3 text-center text-emerald-600 dark:text-emerald-400 font-semibold">
                      FHIR R4 Adapter
                    </div>
                    <div className="rounded-lg bg-amber-500/10 p-3 text-center text-amber-600 dark:text-amber-400 font-semibold">
                      Playwright Queue
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================================== */}
        {/* SCREENSHOTS GALLERY PREVIEW */}
        {/* ======================================================================== */}
        <section className="py-20 bg-muted/20 border-b border-border/40">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
              <div>
                <Badge variant="outline" className="mb-3">
                  Visual Interface Gallery
                </Badge>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">
                  Operations & Monitoring Dashboards
                </h2>
              </div>
              <Button variant="outline" asChild className="gap-2">
                <Link href="/screenshots">
                  <Monitor className="h-4 w-4" />
                  View All Screenshots
                </Link>
              </Button>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Operations Dashboard",
                  desc: "Real-time metrics, appointment breakdown, and workflow status summary.",
                  href: "/dashboard",
                },
                {
                  title: "Automation Engine Timeline",
                  desc: "Step-by-step workflow monitoring with live Playwright screenshot evidence.",
                  href: "/automation",
                },
                {
                  title: "FHIR R4 Resource Explorer",
                  desc: "JSON inspector for synced Patient, Practitioner, and Appointment resources.",
                  href: "/fhir",
                },
                {
                  title: "Audit Logging System",
                  desc: "Append-only HIPAA & ABDM compliant audit trail with state snapshots.",
                  href: "/audit-logs",
                },
                {
                  title: "Browser Automation Fallback",
                  desc: "Live Playwright execution logs targeting legacy 2006 hospital portal.",
                  href: "/browser-automation",
                },
                {
                  title: "System Monitoring & Metrics",
                  desc: "Response latency analytics, active provider status, and health metrics.",
                  href: "/monitoring",
                },
              ].map((card, i) => (
                <Card
                  key={i}
                  className="group overflow-hidden transition-all hover:border-primary/50 hover:shadow-md"
                >
                  <div className="aspect-video w-full bg-card p-4 border-b border-border flex flex-col justify-center items-center text-center">
                    <Monitor className="h-8 w-8 text-primary/40 group-hover:text-primary transition-colors" />
                    <span className="mt-2 text-xs font-semibold text-muted-foreground">
                      {card.title}
                    </span>
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">{card.title}</CardTitle>
                    <CardDescription className="text-xs">{card.desc}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ======================================================================== */}
        {/* DOCUMENTATION & TECH STACK SECTION */}
        {/* ======================================================================== */}
        <section className="py-20 border-b border-border/40">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <Badge variant="outline" className="mb-3">
                Developer Documentation & Stack
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Comprehensive Technical Guides
              </h2>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Link href="/docs" className="group">
                <Card className="h-full transition-all group-hover:border-primary">
                  <CardHeader>
                    <BookOpen className="h-6 w-6 text-primary" />
                    <CardTitle className="text-base mt-2">Platform Overview</CardTitle>
                    <CardDescription className="text-xs">
                      Problem statement, core architecture, and design goals.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
              <Link href="/docs/developer-guide" className="group">
                <Card className="h-full transition-all group-hover:border-primary">
                  <CardHeader>
                    <Code2 className="h-6 w-6 text-primary" />
                    <CardTitle className="text-base mt-2">Developer Guide</CardTitle>
                    <CardDescription className="text-xs">
                      Monorepo setup, environment variables, local testing.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
              <Link href="/docs/api-reference" className="group">
                <Card className="h-full transition-all group-hover:border-primary">
                  <CardHeader>
                    <Server className="h-6 w-6 text-primary" />
                    <CardTitle className="text-base mt-2">API Reference</CardTitle>
                    <CardDescription className="text-xs">
                      REST endpoints, Swagger OpenAPI specs, and examples.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
              <Link href="/docs/deployment-guide" className="group">
                <Card className="h-full transition-all group-hover:border-primary">
                  <CardHeader>
                    <Rocket className="h-6 w-6 text-primary" />
                    <CardTitle className="text-base mt-2">Railway Deployment</CardTitle>
                    <CardDescription className="text-xs">
                      Step-by-step production deployment & environment guide.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </div>

            {/* Tech Stack Grid */}
            <div className="mt-16 rounded-xl border border-border bg-card p-6 shadow-xs">
              <h3 className="text-lg font-bold text-foreground">Technology Stack</h3>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-4 text-xs">
                <div>
                  <p className="font-semibold text-primary">Frontend</p>
                  <p className="mt-1 text-muted-foreground">
                    Next.js 16 (Turbopack), React 19, Tailwind CSS v4, Shadcn UI, TanStack Query
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-primary">Backend & Database</p>
                  <p className="mt-1 text-muted-foreground">
                    Node.js, Express, TypeScript, Prisma ORM, PostgreSQL 16, Redis 7
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-primary">Automation & Queues</p>
                  <p className="mt-1 text-muted-foreground">
                    BullMQ, Playwright (Headless Chromium), Resilient Circuit Breakers
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-primary">Standards & Security</p>
                  <p className="mt-1 text-muted-foreground">
                    HL7 FHIR R4, JWT Auth, Double-submit CSRF, Pino JSON Logging, Docker
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Enterprise Footer */}
      <LandingFooter />
    </div>
  );
}
