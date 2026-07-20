import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api-client";
import type { AuditLogEntry } from "@openehr-bridge/shared";

export interface DashboardSummary {
  todaysAppointments: number;
  pendingInsuranceVerifications: number;
  automationSuccessRatePct: number;
  failedWorkflows: number;
  averageResponseTimeMs: number;
  activeDoctors: number;
  jobStatusBreakdown: { status: string; count: number }[];
  recentActivity: AuditLogEntry[];
}

export function useDashboardSummary(organizationId?: string) {
  return useQuery({
    queryKey: ["dashboard", "summary", organizationId],
    queryFn: () =>
      apiRequest<DashboardSummary>("/dashboard/summary", { params: { organizationId } }),
    refetchInterval: 30_000,
  });
}
