import assert from "node:assert";

async function testApi() {
  console.log("▶ Running Layer 3 API Verification Tests on http://localhost:3000/api/analyze...\n");

  // Test 1: Case 1 Loan Recall
  const res1 = await fetch("http://localhost:3000/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ case_id: "case_1_loan" }),
  });
  assert.strictEqual(res1.status, 200, "Case 1 API must return 200 OK");
  const json1 = await res1.json();
  assert.strictEqual(json1.is_refusal, false, "Case 1 must not be a refusal");
  assert.strictEqual(json1.data.case_id, "case_1_loan");
  assert.strictEqual(json1.data.claims.length, 5, "Case 1 must return 5 claims");
  assert.strictEqual(json1.data.deadline_analysis.statutory_response_days_allowed, 15, "Case 1 NI Act response window must be 15 days");
  console.log("✔ Test 1 (Case 1: Loan Recall API) PASSED");

  // Test 2: Case 2 Rent & Eviction
  const res2 = await fetch("http://localhost:3000/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ case_id: "case_2_rent" }),
  });
  assert.strictEqual(res2.status, 200, "Case 2 API must return 200 OK");
  const json2 = await res2.json();
  assert.strictEqual(json2.is_refusal, false, "Case 2 must not be a refusal");
  assert.strictEqual(json2.data.case_id, "case_2_rent");
  assert.strictEqual(json2.data.domain, "rent");
  assert.strictEqual(json2.data.deadline_analysis.statutory_response_days_allowed, 30, "Case 2 TPA response window must be 30 days");
  assert.ok(json2.data.claims.some(c => c.statute_pack_id === "TENANCY-EVICTION-WINDOW-004"), "Case 2 must cite TENANCY-EVICTION-WINDOW-004");
  console.log("✔ Test 2 (Case 2: Rent Eviction API) PASSED");

  // Test 3: Case 3 Responsible AI Refusal Gate
  const res3 = await fetch("http://localhost:3000/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ case_id: "case_3_refusal" }),
  });
  assert.strictEqual(res3.status, 200, "Case 3 API must return 200 OK");
  const json3 = await res3.json();
  assert.strictEqual(json3.is_refusal, true, "Case 3 must trigger refusal gate");
  assert.ok(json3.refusal_reason.includes("custody") || json3.refusal_reason.includes("Responsible AI"), "Refusal reason must be present");
  assert.ok(json3.helpline_routing.length >= 3, "Must route to at least 3 emergency helplines");
  assert.ok(json3.helpline_routing.some(h => h.number === "15100"), "Must include NALSA 15100");
  console.log("✔ Test 3 (Case 3: Responsible AI Refusal API) PASSED");

  console.log("\n🎉 ALL API REGRESSION TESTS PASSED!");
}

testApi().catch(err => {
  console.error("❌ API Verification Failed:", err);
  process.exit(1);
});
