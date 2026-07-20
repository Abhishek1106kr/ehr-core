import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api-client";
import type { AutomationJob, Paginated, WorkflowStep } from "@openehr-bridge/shared";

export function useAutomationJobs(params: {
  status?: string;
  type?: string;
  integrationMode?: string;
}) {
  return useQuery({
    queryKey: ["automation-jobs", params],
    queryFn: () => apiRequest<Paginated<AutomationJob>>("/automation-jobs", { params }),
    refetchInterval: 15_000,
  });
}

export type AutomationJobDetail = AutomationJob & { steps: WorkflowStep[]; error: string | null };

export function useAutomationJob(id: string | undefined) {
  return useQuery({
    queryKey: ["automation-jobs", id],
    queryFn: () => apiRequest<AutomationJobDetail>(`/automation-jobs/${id}`),
    enabled: Boolean(id),
    // Poll while the job is still moving so the timeline updates live.
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === "SUCCESS" || status === "FAILED" || status === "DEAD_LETTER" ? false : 2000;
    },
  });
}
