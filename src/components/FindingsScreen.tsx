"use client";

import React, { useState, useRef } from "react";
import { AnalysisResult, ClaimVerdict } from "@/types";
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileCheck2,
  Scale,
  ArrowRight,
  Sparkles,
  BookOpen,
  SplitSquareVertical,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { DocumentViewer } from "@/components/DocumentViewer";
import { SvgConnector } from "@/components/SvgConnector";

interface FindingsScreenProps {
  data: AnalysisResult;
  onProceedToAct: () => void;
  onReset: () => void;
}

// Sample fallback text fixtures for realistic visual rendering
const LOAN_NOTICE_SAMPLE = `LEGAL NOTICE UNDER SECTION 138 NEGOTIABLE INSTRUMENTS ACT & SECTION 420 IPC
SPEED POST WITH ACK DUE / EMAIL

Dated: 12th September 2026

To,
Mr. Rajesh Kumar Verma
Sector 62, Noida, Gautam Buddha Nagar, UP - 201301.

Subject: Formal Demand Notice for Immediate Repayment of Outstanding Loan Facility & Dishonour of Cheque No. 492011.

1. That you availed a personal unsecured loan facility under Loan Agreement No. AFC/PL/2025/88219 dated 14th January 2025 for a principal sum of Rs. 4,50,000/-.

2. That you have persistently defaulted in payment of installments for the months of July 2026 and August 2026. Consequently, My Client has recalled the entire loan facility.

3. That you are hereby called upon to pay the entire outstanding balance of Rs. 4,82,400/- (comprising principal balance, accrued regular interest, and penal interest calculated at 36% per annum compounded monthly from default date) within 7 (Seven) days of receipt of this notice.

4. That towards partial discharge of your liability, you issued Cheque No. 492011 dated 28th August 2026 drawn on HDFC Bank for an amount of Rs. 50,000/-, which upon presentation was dishonoured by your banker with the remark "FUNDS INSUFFICIENT" vide return memo dated 2nd September 2026.

5. Take notice that if you fail to repay the entire demanded amount of Rs. 4,82,400/- within 7 days, My Client has given me peremptory instructions to initiate criminal proceedings under Section 138 of the Negotiable Instruments Act, 1881 as well as Section 420 of the Indian Penal Code, 1860 for cheating and criminal breach of trust, which will result in non-bailable warrants and immediate criminal arrest by the police authorities.

Adv. Arvind S. Mathur
Patiala House Courts, New Delhi`;

const LOAN_AGREEMENT_SAMPLE = `LOAN SANCTION LETTER & FACILITY AGREEMENT SUMMARY
Ref: AFC/PL/2025/88219
Date of Sanction: 14 January 2025
Borrower: Mr. Rajesh Kumar Verma
Lender: M/s Apex Finvest Capital Ltd.

1. FACILITY & DISBURSEMENT
Sanctioned Principal Amount: Rs. 4,50,000/-. Monthly EMI: Rs. 16,850/-.

4. DELAYED PAYMENTS & PENAL CHARGES
Clause 4.2: "the Borrower shall be liable to pay penal charges at the rate of 18% per annum on the overdue EMI amount for the actual duration of delay. In accordance with RBI Fair Lending Practice norms, penal charges shall not be capitalized or added to the principal balance."

9. ACCELERATION & LOAN RECALL
Clause 9.1: "An Event of Default with respect to non-payment shall be deemed to occur only when the Borrower fails to pay three (3) consecutive monthly installments and fails to cure such non-payment within thirty (30) days of formal written cure notice."

14. DISPUTE RESOLUTION & REMEDIES
Clause 14.1: "All disputes, differences, claims, or recovery proceedings arising out of or under this Agreement shall be subject to civil remedies under the Arbitration and Conciliation Act, 1996 or through competent Civil Courts having jurisdiction in New Delhi."`;

export const FindingsScreen: React.FC<FindingsScreenProps> = ({
  data,
  onProceedToAct,
  onReset,
}) => {
  const [selectedClaimId, setSelectedClaimId] = useState<string>(data.claims[0]?.id || "");
  const [viewMode, setViewMode] = useState<"analysis" | "documents">("documents");

  const containerRef = useRef<HTMLDivElement | null>(null);
  const claimRefs = useRef<Record<string, HTMLElement | null>>({});
  const [targetClauseEl, setTargetClauseEl] = useState<HTMLElement | null>(null);

  const activeClaim = data.claims.find((c) => c.id === selectedClaimId) || data.claims[0];

  const getVerdictBadge = (verdict: ClaimVerdict["verdict"]) => {
    switch (verdict) {
      case "valid":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3" /> Valid Demand
          </span>
        );
      case "overstated":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <AlertTriangle className="w-3 h-3" /> Overstated
          </span>
        );
      case "unsupported":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-orange-100 text-orange-900 border border-orange-300">
            <XCircle className="w-3 h-3" /> Unsupported by Contract
          </span>
        );
      case "unenforceable":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-red-100 text-red-900 border border-red-300">
            <ShieldAlert className="w-3 h-3" /> Unenforceable / Illegal
          </span>
        );
    }
  };

  const getVerdictColor = (verdict: ClaimVerdict["verdict"]) => {
    switch (verdict) {
      case "valid":
        return "#10b981";
      case "overstated":
        return "#f59e0b";
      case "unsupported":
        return "#f97316";
      case "unenforceable":
        return "#ef4444";
    }
  };

  return (
    <div ref={containerRef} className="flex flex-col w-full space-y-6 relative">
      {/* Top Banner & Metadata Strip */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[var(--border)] pb-4 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
              Cross-Examination Audit
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-gray-100 font-mono text-gray-700">
              HASH: {data.document_hash.substring(0, 10)}...
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif-legal text-[var(--foreground)] mt-0.5">
            {data.notice_metadata.sender}
          </h2>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
            Received: {data.notice_metadata.notice_date} via {data.notice_metadata.mode_of_service} · Demanded Amount:{" "}
            <strong>{formatCurrency(data.notice_metadata.alleged_amount)}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* View Mode Toggle */}
          <div className="flex items-center rounded-lg border border-[var(--border)] p-0.5 bg-gray-50 mr-2">
            <button
              onClick={() => setViewMode("documents")}
              className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                viewMode === "documents"
                  ? "bg-white text-gray-900 shadow-2xs font-semibold"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <SplitSquareVertical className="w-3 h-3" /> Bilateral View
            </button>
            <button
              onClick={() => setViewMode("analysis")}
              className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                viewMode === "analysis"
                  ? "bg-white text-gray-900 shadow-2xs font-semibold"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <BookOpen className="w-3 h-3" /> Deep Analysis
            </button>
          </div>

          <button
            onClick={onReset}
            className="text-xs px-3 py-1.5 rounded border border-[var(--border)] text-[var(--muted-foreground)] hover:text-black cursor-pointer"
          >
            ← Upload Other
          </button>
          <button
            onClick={onProceedToAct}
            className="text-xs px-4 py-1.5 rounded bg-[var(--foreground)] text-[var(--background)] font-medium hover:bg-black transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            Action Suite & Clock
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Hero Headline / In-Language Callout */}
      {data.translations?.hi && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-amber-950 font-serif-legal">
              {data.translations.hi.summary_headline}
            </h4>
            <p className="text-xs text-amber-900 leading-relaxed">
              {data.translations.hi.plain_summary}
            </p>
          </div>
        </div>
      )}

      {/* Dynamic SVG Connector connecting active claim to contract clause */}
      {viewMode === "documents" && (
        <SvgConnector
          sourceEl={claimRefs.current[selectedClaimId] || null}
          targetEl={targetClauseEl}
          containerRef={containerRef}
          verdictColor={getVerdictColor(activeClaim.verdict)}
        />
      )}

      {/* Main Dual-Pane Cross Examination View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Verdict Rail (Claims List) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
              Demands on Trial ({data.claims.length})
            </span>
            <span className="text-[11px] text-[var(--muted-foreground)]">Click to highlight</span>
          </div>

          <div className="space-y-2.5">
            {data.claims.map((claim, idx) => {
              const isSelected = claim.id === selectedClaimId;
              return (
                <div
                  key={claim.id}
                  ref={(el) => {
                    claimRefs.current[claim.id] = el;
                  }}
                  onClick={() => setSelectedClaimId(claim.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left relative ${
                    isSelected
                      ? "border-[var(--foreground)] bg-white shadow-md ring-1 ring-[var(--foreground)]/10"
                      : "border-[var(--border)] bg-white/70 hover:bg-white hover:border-gray-300 shadow-2xs"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-mono font-bold text-gray-500">
                      #{idx + 1} · {claim.claim_type.replace(/_/g, " ")}
                    </span>
                    {getVerdictBadge(claim.verdict)}
                  </div>

                  <p className="text-xs font-serif-legal text-gray-900 line-clamp-2 italic">
                    &ldquo;{claim.notice_quote}&rdquo;
                  </p>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-[var(--muted-foreground)] pt-2 border-t border-gray-100">
                    <span className="truncate max-w-[180px] font-medium text-gray-700">
                      {claim.agreement_clause || "Statutory Ground"}
                    </span>
                    <span className="text-amber-700 font-semibold text-[10px]">Inspect Clause →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Area: Dynamic Bilateral Document View OR Deep Analysis View */}
        <div className="lg:col-span-8">
          {viewMode === "documents" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Notice Pane with in-document highlight */}
              <DocumentViewer
                title="The Threatening Notice"
                documentType="notice"
                content={LOAN_NOTICE_SAMPLE}
                highlightedText={activeClaim.notice_quote}
                verdict={activeClaim.verdict}
              />

              {/* Agreement Pane with in-document highlight & auto-scroll target */}
              <DocumentViewer
                title="Your Signed Agreement"
                documentType="agreement"
                content={LOAN_AGREEMENT_SAMPLE}
                highlightedText={activeClaim.agreement_quote}
                verdict={activeClaim.verdict}
                onTargetElementRef={(el) => setTargetClauseEl(el)}
              />
            </div>
          ) : (
            /* Deep Analysis Card View */
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 shadow-xs space-y-5">
              <div className="border-b border-gray-100 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-semibold text-gray-500 uppercase">
                    Claim Cross-Examination
                  </span>
                  {getVerdictBadge(activeClaim.verdict)}
                </div>
                <h3 className="text-base font-bold text-gray-900 font-serif-legal">
                  {activeClaim.analysis}
                </h3>
              </div>

              {/* Side-by-Side Verbatim Quotations */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-lg bg-red-50/50 border-l-4 border-red-500 border border-red-100 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-red-900">
                    <span>The Notice Demanded:</span>
                    <span className="text-[10px] uppercase font-mono">Verbatim Extract</span>
                  </div>
                  <p className="text-xs font-serif-legal text-red-950 italic leading-relaxed">
                    &ldquo;{activeClaim.notice_quote}&rdquo;
                  </p>
                </div>

                {activeClaim.agreement_quote ? (
                  <div className="p-3.5 rounded-lg bg-blue-50/50 border-l-4 border-blue-600 border border-blue-100 space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-blue-900">
                      <span>Your Agreement Clause Stipulates:</span>
                      <span className="text-[10px] uppercase font-mono font-bold text-blue-800">
                        {activeClaim.agreement_clause}
                      </span>
                    </div>
                    <p className="text-xs font-serif-legal text-blue-950 leading-relaxed">
                      &ldquo;{activeClaim.agreement_quote}&rdquo;
                    </p>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-lg bg-gray-50 border-l-4 border-gray-400 border border-gray-200 text-xs text-gray-600 italic">
                    No contract clause matches this claim; claim is evaluated strictly against governing Indian statutory law.
                  </div>
                )}
              </div>

              {/* Governing Indian Statute Citation */}
              <div className="bg-gray-50/80 rounded-lg p-3.5 border border-[var(--border)] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                  <Scale className="w-4 h-4 text-indigo-700" />
                  <span>Governing Indian Authority & Statute</span>
                </div>
                <p className="text-xs text-gray-800 font-semibold">
                  {activeClaim.statute_citation}
                </p>
                <div className="text-[11px] text-gray-600 bg-white p-2.5 rounded border border-gray-200">
                  <strong>Statute Pack Reference:</strong> {activeClaim.statute_pack_id}
                </div>
              </div>

              {/* Suggested Written Remedy */}
              <div className="bg-emerald-50/60 rounded-lg p-3.5 border border-emerald-200 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                  <FileCheck2 className="w-4 h-4 text-emerald-700" />
                  <span>Recommended Rebuttal Strategy</span>
                </div>
                <p className="text-xs text-emerald-950 leading-relaxed">
                  {activeClaim.remedy}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
