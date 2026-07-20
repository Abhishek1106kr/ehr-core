import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api-client";
import type { Appointment, Doctor, Paginated, Patient } from "@openehr-bridge/shared";

export type AppointmentWithRelations = Appointment & { patient: Patient; doctor: Doctor };

export function useAppointments(params: {
  doctorId?: string;
  patientId?: string;
  status?: string;
  page?: number;
}) {
  return useQuery({
    queryKey: ["appointments", params],
    queryFn: () => apiRequest<Paginated<AppointmentWithRelations>>("/appointments", { params }),
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      patientId: string;
      doctorId: string;
      startsAt: string;
      endsAt: string;
      reason?: string;
      isUrgent?: boolean;
      idempotencyKey: string;
    }) => apiRequest<Appointment>("/appointments", { method: "POST", body: input }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["appointments"] }),
  });
}

export function useCancelAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, cancelReason }: { id: string; cancelReason?: string }) =>
      apiRequest<Appointment>(`/appointments/${id}/cancel`, {
        method: "PATCH",
        body: { cancelReason },
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["appointments"] }),
  });
}

export function useRescheduleAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, startsAt, endsAt }: { id: string; startsAt: string; endsAt: string }) =>
      apiRequest<Appointment>(`/appointments/${id}/reschedule`, {
        method: "PATCH",
        body: { startsAt, endsAt },
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["appointments"] }),
  });
}
