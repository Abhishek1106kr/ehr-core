import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api-client";
import type { AutomationJob, IntegrationMode } from "@openehr-bridge/shared";

export interface BookAppointmentWorkflowInput {
  organizationId: string;
  patientId: string;
  doctorId: string;
  startsAt: string;
  endsAt: string;
  reason?: string;
  isUrgent?: boolean;
  integrationMode?: IntegrationMode;
}

export function useEnqueueAppointmentBookingWorkflow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: BookAppointmentWorkflowInput) =>
      apiRequest<AutomationJob>("/workflows/appointment-booking", { method: "POST", body: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["automation-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export interface VerifyInsuranceWorkflowInput {
  organizationId: string;
  insuranceId: string;
  integrationMode?: IntegrationMode;
}

export function useEnqueueInsuranceVerificationWorkflow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: VerifyInsuranceWorkflowInput) =>
      apiRequest<AutomationJob>("/workflows/insurance-verification", {
        method: "POST",
        body: input,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["automation-jobs"] });
    },
  });
}
