import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api-client";
import type { Paginated } from "@openehr-bridge/shared";

export const FHIR_RESOURCE_TYPES = [
  "Patient",
  "Practitioner",
  "Appointment",
  "Coverage",
  "Organization",
  "Encounter",
  "Observation",
  "Condition",
  "Medication",
  "DiagnosticReport",
] as const;

export interface FhirResourceRow {
  id: string;
  resourceType: string;
  fhirId: string;
  version: number;
  data: Record<string, unknown>;
  updatedAt: string;
}

export function useFhirResources(resourceType: string) {
  return useQuery({
    queryKey: ["fhir", resourceType],
    queryFn: () => apiRequest<Paginated<FhirResourceRow>>(`/fhir/${resourceType}`),
  });
}

export function useSyncFhirResources() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (organizationId: string) =>
      apiRequest<{ synced: number; breakdown: Record<string, number> }>("/fhir/sync", {
        method: "POST",
        body: { organizationId },
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["fhir"] }),
  });
}
