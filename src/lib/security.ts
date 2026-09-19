import { z } from "zod";

// 1. Strict Zod Schema for API Request Validation
export const AnalyzeRequestSchema = z.object({
  case_id: z.string().max(50).optional(),
  notice_text: z.string().max(50000, "Notice text exceeds safe limit of 50,000 characters").optional(),
  agreement_text: z.string().max(50000, "Agreement text exceeds safe limit of 50,000 characters").optional(),
  jurisdiction: z.enum(["DL", "KA", "MH", "UP", "TN", "OTHER"]).default("DL"),
  language: z.enum(["en", "hi", "ta", "bn"]).default("en"),
});

// 2. Prompt Injection & Adversarial Jailbreak Patterns
const ADVERSARIAL_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+instructions/i,
  /system\s+prompt/i,
  /you\s+are\s+now\s+(in\s+)?(dan|jailbroken|unrestricted)/i,
  /developer\s+mode/i,
  /override\s+(all\s+)?(rules|guidelines|safety)/i,
  /print\s+(your\s+)?(instructions|source\s+code|api\s+key)/i,
  /act\s+as\s+a\s+hacker/i,
];

export interface SecurityCheckResult {
  safe: boolean;
  sanitizedNotice: string;
  sanitizedAgreement: string;
  threatDetected?: string;
  piiRedactedCount: number;
}

// 3. Indian PII Sanitization (Aadhaar, PAN, Phone, Email)
export function sanitizeAndInspectInput(
  notice: string = "",
  agreement: string = ""
): SecurityCheckResult {
  let piiCount = 0;

  // Regex patterns for Indian PII
  const AADHAAR_REGEX = /\b[2-9]{1}[0-9]{3}[-\s]?[0-9]{4}[-\s]?[0-9]{4}\b/g;
  const PAN_REGEX = /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/g;
  const PHONE_REGEX = /\b(\+91[\-\s]?)?[6789]\d{9}\b/g;

  // Mask PII helper
  const maskPii = (text: string) => {
    return text
      .replace(AADHAAR_REGEX, () => {
        piiCount++;
        return "[AADHAAR REDACTED]";
      })
      .replace(PAN_REGEX, () => {
        piiCount++;
        return "[PAN REDACTED]";
      })
      .replace(PHONE_REGEX, () => {
        piiCount++;
        return "[PHONE REDACTED]";
      });
  };

  const combined = `${notice} ${agreement}`;

  // Check for adversarial prompt injection
  for (const pattern of ADVERSARIAL_PATTERNS) {
    if (pattern.test(combined)) {
      return {
        safe: false,
        sanitizedNotice: "",
        sanitizedAgreement: "",
        threatDetected: "Potential prompt injection or safety bypass detected in document text.",
        piiRedactedCount: 0,
      };
    }
  }

  return {
    safe: true,
    sanitizedNotice: maskPii(notice),
    sanitizedAgreement: maskPii(agreement),
    piiRedactedCount: piiCount,
  };
}
