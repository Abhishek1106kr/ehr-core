"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useAutomationJob } from "@/lib/queries/automation-jobs";
import { apiAssetUrl } from "@/lib/api-client";

export default function AutomationJobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: job, isLoading } = useAutomationJob(id);

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2 gap-1.5">
        <Link href="/automation">
          <ArrowLeft className="h-4 w-4" />
          Back to Automation
        </Link>
      </Button>

      {isLoading || !job ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <>
          <PageHeader
            title={job.type.replaceAll("_", " ")}
            description={`Correlation ID ${job.correlationId} · ${job.integrationMode.replaceAll("_", " ")}`}
            actions={<StatusBadge status={job.status} />}
          />

          {job.error && (
            <Card className="mb-4 border-destructive/40 bg-destructive/5">
              <CardContent className="p-4 text-sm text-destructive">
                <strong>Error:</strong> {job.error}
              </CardContent>
            </Card>
          )}

          <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Stat label="Attempt" value={`${job.attempt} / ${job.maxAttempts}`} />
            <Stat label="Duration" value={job.durationMs != null ? `${job.durationMs} ms` : "—"} />
            <Stat
              label="Started"
              value={job.startedAt ? format(new Date(job.startedAt), "MMM d, HH:mm:ss") : "—"}
            />
            <Stat
              label="Finished"
              value={job.finishedAt ? format(new Date(job.finishedAt), "MMM d, HH:mm:ss") : "—"}
            />
          </div>

          <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Execution timeline</h2>
          <ol className="space-y-3">
            {job.steps.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No steps recorded yet — waiting for the worker to pick this job up.
              </p>
            )}
            {job.steps.map((step) => (
              <li key={step.id}>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium capitalize">
                          {step.name.replaceAll("_", " ")}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          attempt {step.attempt}
                        </span>
                      </div>
                      <StatusBadge status={step.status} />
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      {step.startedAt && (
                        <span>{format(new Date(step.startedAt), "HH:mm:ss")}</span>
                      )}
                      {step.durationMs != null && <span>{step.durationMs} ms</span>}
                    </div>
                    {step.screenshotUrl && (
                      // eslint-disable-next-line @next/next/no-img-element -- screenshots are dynamically captured at runtime, not build-time assets
                      <img
                        src={apiAssetUrl(step.screenshotUrl)}
                        alt={`Screenshot of ${step.name} step`}
                        className="mt-3 max-w-md rounded-md border border-border"
                      />
                    )}
                  </CardContent>
                </Card>
              </li>
            ))}
          </ol>
        </>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-medium tabular-nums">{value}</p>
    </div>
  );
}
