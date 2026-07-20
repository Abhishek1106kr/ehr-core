"use client";

import { Activity, Gauge, TimerReset, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { AutomationJobsTable } from "@/components/shared/automation-jobs-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardSummary } from "@/lib/queries/dashboard";
import { useOrganizationId } from "@/hooks/use-organization";

export default function MonitoringPage() {
  const organizationId = useOrganizationId();
  const { data, isLoading } = useDashboardSummary(organizationId);

  return (
    <div>
      <PageHeader
        title="Monitoring"
        description="System health: latency, failures, retries, and throughput across every integration path."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-lg" />)
        ) : (
          <>
            <StatCard
              label="Automation Success Rate"
              value={`${data?.automationSuccessRatePct ?? 100}%`}
              icon={Gauge}
              tone="success"
            />
            <StatCard
              label="Avg Response Time"
              value={`${data?.averageResponseTimeMs ?? 0} ms`}
              icon={TimerReset}
            />
            <StatCard
              label="Failed Workflows"
              value={data?.failedWorkflows ?? 0}
              icon={AlertTriangle}
              tone={data?.failedWorkflows ? "destructive" : "default"}
            />
            <StatCard
              label="Total Jobs Tracked"
              value={data?.jobStatusBreakdown.reduce((s, j) => s + j.count, 0) ?? 0}
              icon={Activity}
            />
          </>
        )}
      </div>

      <AutomationJobsTable emptyHint="Latency, retries, and failure metrics will populate once workflows start executing." />
    </div>
  );
}
