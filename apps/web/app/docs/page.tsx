import Link from "next/link";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Code2,
  Server,
  Rocket,
  Layers,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export default function DocsOverviewPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background font-sans text-foreground">
      <LandingNavbar />

      <main className="flex-1 py-12">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div>
            <Badge variant="outline" className="mb-3">
              Documentation Hub
            </Badge>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              OpenEHR Bridge Technical Documentation
            </h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
              Complete architectural specs, developer guides, REST API
              reference, and production deployment checklists.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="flex flex-col justify-between transition-all hover:border-primary/50">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <BookOpen className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">User Guide</CardTitle>
                <CardDescription>
                  Step-by-step instructions for patient intake, scheduling,
                  insurance checks, and monitoring.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full gap-1.5"
                >
                  <Link href="/docs/user-guide">
                    Read User Guide
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="flex flex-col justify-between transition-all hover:border-primary/50">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Code2 className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">Developer Guide</CardTitle>
                <CardDescription>
                  Monorepo architecture, Prisma schemas, BullMQ queue engines,
                  and Playwright drivers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full gap-1.5"
                >
                  <Link href="/docs/developer-guide">
                    Read Developer Guide
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="flex flex-col justify-between transition-all hover:border-primary/50">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <Server className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">API Reference</CardTitle>
                <CardDescription>
                  REST endpoints, FHIR R4 resources, auth endpoints, metrics,
                  and Swagger OpenAPI specs.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full gap-1.5"
                >
                  <Link href="/docs/api-reference">
                    View API Reference
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="flex flex-col justify-between transition-all hover:border-primary/50">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Layers className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">
                  High Level Architecture
                </CardTitle>
                <CardDescription>
                  HLD diagrams, LLD component breakdown, and end-to-end
                  integration data flows.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full gap-1.5"
                >
                  <Link href="/architecture">
                    Explore Architecture
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="flex flex-col justify-between transition-all hover:border-primary/50">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
                  <Rocket className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">
                  Railway Deployment Guide
                </CardTitle>
                <CardDescription>
                  Step-by-step production deployment instructions for Railway,
                  Docker, and environment configs.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full gap-1.5"
                >
                  <Link href="/docs/deployment-guide">
                    Deployment Guide
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
