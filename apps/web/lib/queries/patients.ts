import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api-client";
import type { Paginated, Patient } from "@openehr-bridge/shared";

export function usePatients(params: { organizationId?: string; search?: string; page?: number }) {
  return useQuery({
    queryKey: ["patients", params],
    queryFn: () =>
      apiRequest<Paginated<Patient>>("/patients", {
        params: { organizationId: params.organizationId, search: params.search, page: params.page },
      }),
    enabled: Boolean(params.organizationId),
  });
}

export function usePatient(id: string | undefined) {
  return useQuery({
    queryKey: ["patients", id],
    queryFn: () => apiRequest<Patient>(`/patients/${id}`),
    enabled: Boolean(id),
  });
}

export function useCreatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Partial<Patient> & { organizationId: string; name: string }) =>
      apiRequest<Patient>("/patients", { method: "POST", body: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });
}
