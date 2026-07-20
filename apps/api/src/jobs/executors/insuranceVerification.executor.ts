import { verifyInsurance } from "../../services/insurance.service";
import { runStep } from "../stepRunner";
import type { InsuranceVerificationPayload, WorkflowJobData } from "../types";

/**
 * Insurance eligibility checks are always modeled as a FHIR-shaped
 * Coverage lookup in this demo, regardless of integrationMode — real payer
 * eligibility APIs are typically REST/X12, not something a browser
 * automation fallback would realistically front for.
 */
export async function executeInsuranceVerification(job: WorkflowJobData, attempt: number) {
  const payload = job.payload as InsuranceVerificationPayload;
  let status = "";

  await runStep(job.automationJobId, attempt, "check_eligibility", async () => {
    const result = await verifyInsurance(payload.insuranceId);
    status = result.status;
    return { logs: `Coverage status: ${result.status}` };
  });

  return { insuranceId: payload.insuranceId, status };
}
