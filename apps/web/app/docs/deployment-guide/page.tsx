import Link from "next/link";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Rocket, CheckCircle2, Server, Key, AlertTriangle } from "lucide-react";

export default function DeploymentGuidePage() {
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
          <div className="mt-3 flex items-center gap-2">
            <Badge variant="outline">Production Guide</Badge>
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-0">
              Railway Ready
            </Badge>
          </div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Railway & Cloud Deployment Guide
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Complete deployment instructions for Railway, multi-stage Docker builds, PostgreSQL,
            Redis, and environment variables.
          </p>

          <div className="mt-8 space-y-6">
            {/* Railway Config Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-primary" />
                  1. Deploying to Railway (One-Click / CLI)
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-3 leading-relaxed">
                <p>
                  OpenEHR Bridge includes a pre-configured{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">
                    railway.json
                  </code>{" "}
                  configuration file at the repository root.
                </p>
                <div className="font-mono bg-muted p-4 rounded-lg text-foreground space-y-2">
                  <p className="text-muted-foreground"># Install Railway CLI and log in</p>
                  <p>npm i -g @railway/cli && railway login</p>
                  <p className="text-muted-foreground pt-2"># Link repository and deploy</p>
                  <p>railway link && railway up</p>
                </div>
              </CardContent>
            </Card>

            {/* Environment Variables Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Key className="h-5 w-5 text-primary" />
                  2. Required Production Environment Variables
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-3">
                <div className="rounded-lg border border-border overflow-hidden">
                  <div className="bg-muted/40 px-4 py-2 font-semibold text-foreground grid grid-cols-3">
                    <span>Variable Name</span>
                    <span>Sample / Recommended</span>
                    <span>Description</span>
                  </div>
                  <div className="divide-y divide-border font-mono text-[11px]">
                    <div className="p-3 grid grid-cols-3">
                      <span className="font-bold text-primary">NODE_ENV</span>
                      <span>production</span>
                      <span className="font-sans text-muted-foreground">
                        Sets Node runtime to production mode.
                      </span>
                    </div>
                    <div className="p-3 grid grid-cols-3">
                      <span className="font-bold text-primary">PORT</span>
                      <span>4000</span>
                      <span className="font-sans text-muted-foreground">
                        Express API listening port.
                      </span>
                    </div>
                    <div className="p-3 grid grid-cols-3">
                      <span className="font-bold text-primary">DATABASE_URL</span>
                      <span>postgresql://...</span>
                      <span className="font-sans text-muted-foreground">
                        Railway Managed PostgreSQL connection string.
                      </span>
                    </div>
                    <div className="p-3 grid grid-cols-3">
                      <span className="font-bold text-primary">REDIS_URL</span>
                      <span>redis://...</span>
                      <span className="font-sans text-muted-foreground">
                        Railway Managed Redis instance URL for BullMQ.
                      </span>
                    </div>
                    <div className="p-3 grid grid-cols-3">
                      <span className="font-bold text-primary">JWT_SECRET</span>
                      <span>&lt;min-32-chars-secret&gt;</span>
                      <span className="font-sans text-muted-foreground">
                        Cryptographic secret for signing JWT tokens.
                      </span>
                    </div>
                    <div className="p-3 grid grid-cols-3">
                      <span className="font-bold text-primary">COOKIE_SECURE</span>
                      <span>true</span>
                      <span className="font-sans text-muted-foreground">
                        Enforces TLS/HTTPS for session cookies.
                      </span>
                    </div>
                    <div className="p-3 grid grid-cols-3">
                      <span className="font-bold text-primary">WEB_ORIGIN</span>
                      <span>https://app.yourdomain.com</span>
                      <span className="font-sans text-muted-foreground">
                        Allowed CORS client origin for cookies.
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Health Probes & Troubleshooting */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Server className="h-5 w-5 text-primary" />
                  3. Health Checks & Railway Readiness Probes
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-3 leading-relaxed">
                <p>
                  Configure Railway&apos;s Health Check Path to{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">
                    /health
                  </code>{" "}
                  on port <code className="font-mono text-foreground">4000</code>.
                </p>
                <div className="bg-muted p-3 rounded-lg font-mono text-foreground">
                  GET /health -&gt; 200 OK &#123; &quot;status&quot;: &quot;ok&quot;,
                  &quot;service&quot;: &quot;openehr-bridge-api&quot; &#125;
                </div>
                <div className="flex items-start gap-2 text-amber-600 dark:text-amber-400 bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>
                    Note: Ensure <code className="font-mono">npx prisma db push</code> or migrations
                    run before starting the Express container.
                  </span>
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
