import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api-client";

export interface OrganizationDetail {
  id: string;
  name: string;
  slug: string;
  timezone: string;
  address: string | null;
  phone: string | null;
  languages: string[];
  departments: { id: string; name: string }[];
}

export function useOrganization(id: string | undefined) {
  return useQuery({
    queryKey: ["organization", id],
    queryFn: () => apiRequest<OrganizationDetail>(`/organizations/${id}`),
    enabled: Boolean(id),
  });
}

export function useUpdateOrganization(id: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Partial<Pick<OrganizationDetail, "name" | "address" | "phone">>) =>
      apiRequest<OrganizationDetail>(`/organizations/${id}`, { method: "PATCH", body: input }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["organization", id] }),
  });
}
