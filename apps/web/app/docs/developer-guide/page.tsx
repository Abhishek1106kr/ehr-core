import Link from "next/link";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Code2, FolderTree, Terminal, Cpu } from "lucide-react";

export default function DeveloperGuidePage() {
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
            Developer Setup & Architecture Guide
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Monorepo directory structure, local development environment,
            database migrations, and job worker execution.
          </p>

          <div className="mt-8 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FolderTree className="h-5 w-5 text-primary" />
                  Monorepo Directory Structure
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs font-mono bg-muted/30 p-4 rounded-lg leading-relaxed">
                <pre>{`openehr-bridge/
├── apps/
│   ├── api/                  # Express REST API, Prisma ORM, BullMQ Worker, Playwright
│   │   ├── prisma/           # schema.prisma & seed.ts
│   │   ├── src/
│   │   │   ├── controllers/  # Express REST Handlers
│   │   │   ├── jobs/         # BullMQ Workers & Playwright Executors
│   │   │   ├── legacyPortal/ # 2006 HTML Legacy Portal Simulator
│   │   │   ├── middleware/   # JWT, RBAC, CSRF, Pino, TraceID Context
│   │   │   └── services/     # Domain Services, FHIR, AI Safety, CircuitBreaker
│   └── web/                  # Next.js 16 (Turbopack) Dashboard & Landing Page
│       ├── app/              # App Router Pages (Dashboard, FHIR, Automation, Docs)
│       ├── components/       # Shadcn UI, Layouts, Landing Components
│       └── lib/              # API Client & React Query Hooks
├── packages/
│   └── shared/               # Shared TypeScript DTOs, Enums, & Permissions
├── docker-compose.yml        # PostgreSQL 16 + Redis 7 Infrastructure
└── railway.json              # Railway Deployment Configuration`}</pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Terminal className="h-5 w-5 text-primary" />
                  Local Environment Setup
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-4">
                <div className="space-y-2 font-mono">
                  <p className="text-muted-foreground">
                    # 1. Install workspace dependencies
                  </p>
                  <p className="bg-muted p-2 rounded text-foreground">
                    npm install
                  </p>
                </div>
                <div className="space-y-2 font-mono">
                  <p className="text-muted-foreground">
                    # 2. Launch Postgres & Redis docker containers
                  </p>
                  <p className="bg-muted p-2 rounded text-foreground">
                    docker compose up -d
                  </p>
                </div>
                <div className="space-y-2 font-mono">
                  <p className="text-muted-foreground">
                    # 3. Synchronize database schema & seed demo users
                  </p>
                  <p className="bg-muted p-2 rounded text-foreground">
                    npm run db:push --workspace=apps/api && npm run db:seed
                    --workspace=apps/api
                  </p>
                </div>
                <div className="space-y-2 font-mono">
                  <p className="text-muted-foreground">
                    # 4. Install Playwright browser binaries
                  </p>
                  <p className="bg-muted p-2 rounded text-foreground">
                    npx playwright install chromium
                  </p>
                </div>
                <div className="space-y-2 font-mono">
                  <p className="text-muted-foreground">
                    # 5. Start dev server and background worker
                  </p>
                  <p className="bg-muted p-2 rounded text-foreground">
                    npm run dev
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-primary" />
                  Extending Provider Adapters
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground leading-relaxed space-y-2">
                <p>
                  To add a new integration adapter (e.g., Epic SMART-on-FHIR or
                  Cerner Ignite), implement a new service class conforming to
                  the adapter pattern in{" "}
                  <code className="rounded bg-muted px-1 py-0.5">
                    apps/api/src/services/
                  </code>{" "}
                  and register it in{" "}
                  <code className="rounded bg-muted px-1 py-0.5">
                    workflowEngine.service.ts
                  </code>
                  .
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
