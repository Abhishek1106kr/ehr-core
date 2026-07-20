"use client";

import {
  CalendarCheck2,
  ShieldAlert,
  Gauge,
  TimerReset,
  AlertTriangle,
  Stethoscope,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardSummary } from "@/lib/queries/dashboard";
import { useOrganizationId } from "@/hooks/use-organization";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { EmptyState } from "@/components/shared/empty-state";
import { Activity } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function DashboardPage() {
  const organizationId = useOrganizationId();
  const { data, isLoading } = useDashboardSummary(organizationId);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Real-time view of today's operations across registration, appointments, and automation."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-lg" />)
        ) : (
          <>
            <StatCard
              label="Today's Appointments"
              value={data?.todaysAppointments ?? 0}
              icon={CalendarCheck2}
            />
            <StatCard
              label="Pending Insurance Checks"
              value={data?.pendingInsuranceVerifications ?? 0}
              icon={ShieldAlert}
              tone="warning"
            />
            <StatCard
              label="Automation Success Rate"
              value={`${data?.automationSuccessRatePct ?? 100}%`}
              icon={Gauge}
              tone="success"
            />
            <StatCard
              label="Failed Workflows"
              value={data?.failedWorkflows ?? 0}
              icon={AlertTriangle}
              tone={data?.failedWorkflows ? "destructive" : "default"}
            />
            <StatCard
              label="Avg Response Time"
              value={`${data?.averageResponseTimeMs ?? 0} ms`}
              icon={TimerReset}
            />
            <StatCard label="Active Doctors" value={data?.activeDoctors ?? 0} icon={Stethoscope} />
          </>
        )}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Workflow Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : data?.jobStatusBreakdown.length ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data.jobStatusBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                  <XAxis
                    dataKey="status"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12 }}
                    allowDecimals={false}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="count" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState
                icon={Activity}
                title="No automation jobs yet"
                description="Once workflows start running (Phase 2), their status breakdown will appear here."
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)
            ) : data?.recentActivity.length ? (
              data.recentActivity.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start justify-between gap-2 border-b border-border pb-2 last:border-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {log.action.replaceAll(".", " ")}
                    </p>
                    <p className="text-xs text-muted-foreground">{log.actorLabel}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                  </span>
                </div>
              ))
            ) : (
              <EmptyState icon={Activity} title="No recent activity" />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
