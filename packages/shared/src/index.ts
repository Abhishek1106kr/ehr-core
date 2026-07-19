// Shared enums and DTO types used by both apps/api and apps/web.
// Kept hand-written (rather than generated from Prisma) so apps/web never
// depends on @prisma/client or database internals.

export type UserRole = "ADMIN" | "DOCTOR" | "RECEPTIONIST" | "NURSE" | "AUDITOR";

export type Gender = "MALE" | "FEMALE" | "OTHER" | "UNSPECIFIED";

export type VerificationStatus = "UNVERIFIED" | "PENDING" | "VERIFIED" | "FAILED";

export type InsuranceVerificationStatus =
  | "NOT_CHECKED"
  | "PENDING"
  | "ACTIVE"
  | "INACTIVE"
  | "DENIED";

export type AppointmentStatus =
  | "REQUESTED"
  | "CONFIRMED"
  | "RESCHEDULED"
  | "CANCELLED"
  | "COMPLETED"
  | "NO_SHOW";

export type IntegrationMode = "FHIR_REST" | "BROWSER_AUTOMATION";

export type WorkflowType =
  | "REGISTRATION"
  | "IDENTITY_VERIFICATION"
  | "APPOINTMENT_BOOKING"
  | "APPOINTMENT_RESCHEDULE"
  | "APPOINTMENT_CANCELLATION"
  | "INSURANCE_VERIFICATION"
  | "PATIENT_LOOKUP";

export type JobStatus =
  | "PENDING"
  | "RUNNING"
  | "SUCCESS"
  | "FAILED"
  | "RETRYING"
  | "DEAD_LETTER";

export interface Patient {
  id: string;
  organizationId: string;
  mrn: string;
  name: string;
  dob: string | null;
  gender: Gender;
  phone: string | null;
  email: string | null;
  address: string | null;
  preferredLanguage: string;
  emergencyContact: { name: string; phone: string; relation: string } | null;
  aadhaarMasked: string | null;
  verificationStatus: VerificationStatus;
  verificationScore: number | null;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Doctor {
  id: string;
  userId: string | null;
  name: string;
  specialty: string;
  departmentId: string | null;
  organizationId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  startsAt: string;
  endsAt: string;
  status: AppointmentStatus;
  reason: string | null;
  isUrgent: boolean;
  integrationMode: IntegrationMode | null;
  createdAt: string;
  updatedAt: string;
  cancelledAt: string | null;
  cancelReason: string | null;
}

export interface Insurance {
  id: string;
  patientId: string;
  provider: string;
  policyNumberMasked: string;
  groupNumber: string | null;
  status: InsuranceVerificationStatus;
  lastVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AutomationJob {
  id: string;
  type: WorkflowType;
  status: JobStatus;
  integrationMode: IntegrationMode;
  appointmentId: string | null;
  attempt: number;
  maxAttempts: number;
  correlationId: string;
  startedAt: string | null;
  finishedAt: string | null;
  durationMs: number | null;
  createdAt: string;
}

export interface WorkflowStep {
  id: string;
  jobId: string;
  name: string;
  status: JobStatus;
  attempt: number;
  screenshotUrl: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  durationMs: number | null;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorId: string | null;
  actorLabel: string;
  action: string;
  entityType: string;
  entityId: string;
  before: unknown;
  after: unknown;
  durationMs: number | null;
  correlationId: string;
  traceId: string;
  error: string | null;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId: string | null;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

// Role → permission map used by both the API's RBAC middleware and the web
// app's UI gating (hide/disable actions the current role can't perform).
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  ADMIN: ["*"],
  DOCTOR: [
    "patients:read",
    "appointments:read",
    "appointments:write",
    "insurance:read",
  ],
  RECEPTIONIST: [
    "patients:read",
    "patients:write",
    "appointments:read",
    "appointments:write",
    "insurance:read",
    "insurance:write",
  ],
  NURSE: ["patients:read", "appointments:read", "insurance:read"],
  AUDITOR: ["audit:read", "monitoring:read"],
};

export function hasPermission(role: UserRole, permission: string): boolean {
  const perms = ROLE_PERMISSIONS[role] ?? [];
  return perms.includes("*") || perms.includes(permission);
}
