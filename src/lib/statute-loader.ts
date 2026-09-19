import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { StatuteRule } from "@/types";

let cachedRules: StatuteRule[] | null = null;

export function getStatutePack(): StatuteRule[] {
  if (cachedRules) {
    return cachedRules;
  }

  const filePath = path.join(process.cwd(), "data", "statutes.yaml");
  if (!fs.existsSync(filePath)) {
    throw new Error(`Statute Pack not found at path: ${filePath}`);
  }

  const rawContent = fs.readFileSync(filePath, "utf8");
  const parsed = yaml.load(rawContent) as StatuteRule[];

  if (!Array.isArray(parsed)) {
    throw new Error("Invalid Statute Pack format: expected an array of rules.");
  }

  // Engineering safety constraint: loader throws if verified_by or verified_on is absent
  for (const rule of parsed) {
    if (!rule.verified_by || !rule.verified_on) {
      throw new Error(
        `FATAL: Statute Rule '${rule.id}' lacks human verification metadata (verified_by/verified_on). Unverified legal citations are forbidden.`
      );
    }
  }

  cachedRules = parsed;
  return cachedRules;
}

export function findRuleById(ruleId: string): StatuteRule | undefined {
  const pack = getStatutePack();
  return pack.find((r) => r.id === ruleId);
}

export function findRuleByClaimType(claimType: string): StatuteRule | undefined {
  const pack = getStatutePack();
  return pack.find((r) => r.claim_type === claimType);
}
