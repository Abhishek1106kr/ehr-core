/**
 * AI Safety & Security Service
 * Implements prompt injection detection, PII sanitization, and confidence threshold checks.
 */

export interface PromptSafetyResult {
  isSafe: boolean;
  score: number; // 0.0 to 1.0 (1.0 = completely safe)
  detectedThreats: string[];
  sanitizedText: string;
}

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous\s+)?instructions/i,
  /disregard\s+(above|previous)\s+rules/i,
  /you\s+are\s+now\s+a\s+system\s+administrator/i,
  /system\s*:\s*override/i,
  /bypass\s+security\s+filter/i,
  /<script[\s\S]*?>[\s\S]*?<\/script>/i,
  /DROP\s+TABLE/i,
  /SELECT\s+.*?\s+FROM\s+users/i,
];

const PII_PATTERNS = [
  { name: "AADHAAR", regex: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, mask: "XXXX-XXXX-XXXX" },
  { name: "SSN", regex: /\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/g, mask: "XXX-XX-XXXX" },
  { name: "CREDIT_CARD", regex: /\b(?:\d[ -]*?){13,16}\b/g, mask: "XXXX-XXXX-XXXX-XXXX" },
];

/** Evaluates raw user input text for prompt injection risks and masks sensitive PII. */
export function analyzePromptSafety(text: string): PromptSafetyResult {
  const threats: string[] = [];

  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(text)) {
      threats.push(`Potential prompt injection detected: matching pattern ${pattern.source}`);
    }
  }

  let sanitizedText = text;
  for (const pii of PII_PATTERNS) {
    sanitizedText = sanitizedText.replace(pii.regex, pii.mask);
  }

  const isSafe = threats.length === 0;
  const score = isSafe ? 1.0 : Math.max(0.0, 1.0 - threats.length * 0.4);

  return {
    isSafe,
    score,
    detectedThreats: threats,
    sanitizedText,
  };
}

/** Verifies that an AI model decision meets minimum confidence threshold before executing actions. */
export function verifyConfidenceThreshold(
  score: number | null | undefined,
  minThreshold = 0.85,
): boolean {
  if (score === null || score === undefined) return false;
  return score >= minThreshold;
}
