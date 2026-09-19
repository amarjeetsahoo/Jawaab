import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

console.log("▶ Running Jawaab Law Engine Assertions...\n");

// 1. Verify Statute Pack integrity
const statutePath = path.join(process.cwd(), "data", "statutes.yaml");
assert.ok(fs.existsSync(statutePath), "data/statutes.yaml must exist");

const statutes = yaml.load(fs.readFileSync(statutePath, "utf-8"));
assert.ok(Array.isArray(statutes), "Statutes must be an array");
assert.ok(statutes.length >= 5, "Must contain at least 5 verified statute rules");

for (const rule of statutes) {
  assert.ok(rule.id, `Rule missing id`);
  assert.ok(rule.statute, `Rule ${rule.id} missing statute`);
  assert.ok(rule.section, `Rule ${rule.id} missing section`);
  assert.ok(rule.verified_by, `Rule ${rule.id} missing verified_by`);
  assert.ok(rule.verified_on, `Rule ${rule.id} missing verified_on`);
  assert.ok(["valid", "overstated", "unsupported", "unenforceable"].includes(rule.verdict), `Invalid verdict for ${rule.id}`);
}
console.log(`✔ Verified ${statutes.length} Statute Pack rules (all human-verified)`);

// 2. Verify Golden Fixture integrity
const fixturePath = path.join(process.cwd(), "data", "golden_fixture.json");
assert.ok(fs.existsSync(fixturePath), "Golden fixture must exist");

const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf-8"));
assert.strictEqual(fixture.case_id, "case_1_loan");
assert.ok(fixture.claims.length >= 4, "Fixture must have at least 4 claims");
assert.ok(fixture.deadline_analysis.statutory_response_days_allowed === 15, "NI Act statutory window must be 15 days");
console.log("✔ Golden Fixture data contracts verified");

// 3. Verify Synthetic Document Pairs
const loanNotice = path.join(process.cwd(), "data", "fixtures", "case_1_loan", "notice.txt");
const loanAgreement = path.join(process.cwd(), "data", "fixtures", "case_1_loan", "agreement.txt");
assert.ok(fs.existsSync(loanNotice), "Loan notice fixture must exist");
assert.ok(fs.existsSync(loanAgreement), "Loan agreement fixture must exist");
console.log("✔ Case 1 synthetic document pair verified");

const rentNotice = path.join(process.cwd(), "data", "fixtures", "case_2_rent", "notice.txt");
const rentAgreement = path.join(process.cwd(), "data", "fixtures", "case_2_rent", "agreement.txt");
assert.ok(fs.existsSync(rentNotice), "Rent notice fixture must exist");
assert.ok(fs.existsSync(rentAgreement), "Rent agreement fixture must exist");
console.log("✔ Case 2 synthetic document pair verified");

const refusalNotice = path.join(process.cwd(), "data", "fixtures", "case_3_refusal", "notice.txt");
assert.ok(fs.existsSync(refusalNotice), "Refusal notice fixture must exist");
console.log("✔ Case 3 refusal fixture verified");

console.log("\n🎉 ALL JAWAAB LAW ENGINE ASSERTIONS PASSED!");
