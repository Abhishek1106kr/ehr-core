import type { IntegrationMode, WorkflowType } from "@openehr-bridge/shared";

/** Payload shapes accepted by the workflow queue, keyed by WorkflowType. */
export interface AppointmentBookingPayload {
  patientId: string;
  doctorId: string;
  startsAt: string;
  endsAt: string;
  reason?: string;
  isUrgent?: boolean;
}

export interface InsuranceVerificationPayload {
  insuranceId: string;
}

export interface PatientLookupPayload {
  organizationId: string;
  search: string;
}

export type WorkflowPayload =
  AppointmentBookingPayload | InsuranceVerificationPayload | PatientLookupPayload;

export interface WorkflowJobData {
  automationJobId: string;
  type: WorkflowType;
  integrationMode: IntegrationMode;
  correlationId: string;
  payload: WorkflowPayload;
}

export interface StepResult {
  name: string;
  screenshotUrl?: string;
  logs?: string;
}
