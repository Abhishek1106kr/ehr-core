import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api-client";
import type { Doctor, Paginated } from "@openehr-bridge/shared";

export function useDoctors(params: { organizationId?: string; search?: string }) {
  return useQuery({
    queryKey: ["doctors", params],
    queryFn: () => apiRequest<Paginated<Doctor>>("/doctors", { params }),
    enabled: Boolean(params.organizationId),
  });
}
