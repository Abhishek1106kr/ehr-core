/** PII masking helpers. Raw values (full Aadhaar, full policy numbers) are
 * never persisted — only the masked form is stored, so there is nothing
 * sensitive to leak even if the database is compromised. */

export function maskAadhaar(aadhaar: string): string {
  const digits = aadhaar.replace(/\D/g, "");
  const last4 = digits.slice(-4);
  return `XXXX-XXXX-${last4}`;
}

export function maskPolicyNumber(policyNumber: string): string {
  const last4 = policyNumber.slice(-4);
  return `${"X".repeat(Math.max(policyNumber.length - 4, 4))}${last4}`;
}

export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 4) return "XXXX";
  return `XXX-XXX-${digits.slice(-4)}`;
}
