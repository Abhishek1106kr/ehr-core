import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api-client";
import type { AuditLogEntry, Paginated } from "@openehr-bridge/shared";

export function useAuditLogs(params: { search?: string; page?: number }) {
  return useQuery({
    queryKey: ["audit-logs", params],
    queryFn: () => apiRequest<Paginated<AuditLogEntry>>("/audit-logs", { params }),
  });
}
