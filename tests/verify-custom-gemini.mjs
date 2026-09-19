import assert from "node:assert";

async function testCustomAnalysis() {
  console.log("▶ Testing Custom Document Analysis & Token Telemetry on /api/analyze...\n");

  const customPayload = {
    notice_text: "You are hereby served notice under Section 420 of the Indian Penal Code for default in payment of Rs. 3,50,000/-. Failure to repay within 7 days will attract immediate criminal arrest by the police.",
    agreement_text: "Clause 12: All disputes between borrower and lender shall be subject to civil remedies under the Arbitration Act or competent civil courts in New Delhi.",
    jurisdiction: "DL",
    language: "en"
  };

  // Run 1: First live analysis call
  const start1 = Date.now();
  const res1 = await fetch("http://localhost:3000/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(customPayload),
  });
  assert.strictEqual(res1.status, 200, "Must return 200 OK");
  const json1 = await res1.json();
  assert.strictEqual(json1.is_refusal, false, "Must not be a refusal");
  assert.ok(json1.data.claims.length >= 1, "Must extract at least 1 claim");
  assert.ok(json1.data.telemetry, "Must attach execution telemetry");
  assert.strictEqual(json1.data.telemetry.cacheHit, false, "Run 1 must be a cache miss (new document)");
  assert.ok(json1.data.telemetry.totalTokens > 0, "Must report total token count");
  console.log(`✔ Run 1 (Fresh Analysis): Extracted ${json1.data.claims.length} claims, ${json1.data.telemetry.totalTokens} tokens in ${Date.now() - start1}ms`);

  // Run 2: Exact duplicate call (Testing Zero-Quota Document Hash Cache)
  const start2 = Date.now();
  const res2 = await fetch("http://localhost:3000/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(customPayload),
  });
  assert.strictEqual(res2.status, 200, "Must return 200 OK");
  const json2 = await res2.json();
  assert.strictEqual(json2.data.telemetry.cacheHit, true, "Run 2 must be an instant CACHE HIT");
  console.log(`✔ Run 2 (SHA-256 Cache Hit): Instant retrieval in ${Date.now() - start2}ms (Cost: $0.00, 0 API quota burned)`);

  console.log("\n🎉 ALL CUSTOM GEMINI & TELEMETRY TESTS PASSED!");
}

testCustomAnalysis().catch(err => {
  console.error("❌ Custom Gemini verification failed:", err);
  process.exit(1);
});
