"use client";

import React, { useState } from "react";
import { FileText, ShieldAlert, Sparkles, ArrowRight, UploadCloud, AlertCircle } from "lucide-react";

interface IntakeScreenProps {
  onSelectCase: (caseId: string) => void;
  onCustomSubmit: (notice: string, agreement: string, state: string, lang: string) => void;
}

export const IntakeScreen: React.FC<IntakeScreenProps> = ({
  onSelectCase,
  onCustomSubmit,
}) => {
  const [noticeText, setNoticeText] = useState("");
  const [agreementText, setAgreementText] = useState("");
  const [jurisdiction, setJurisdiction] = useState("DL");
  const [language, setLanguage] = useState("hi");

  return (
    <div className="flex flex-col items-center justify-center py-6 max-w-5xl mx-auto w-full">
      {/* Header Banner */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
          Cross-examine legal threats against your signed contracts
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--foreground)] font-serif-legal">
          Put your legal notice on trial.
        </h1>
        <p className="text-sm sm:text-base text-[var(--muted-foreground)] max-w-2xl mx-auto">
          Senders routinely exaggerate demands because they expect you haven&apos;t read your contract. Upload both documents to expose overstated claims, unlawful arrest threats, and calculate your real statutory deadlines.
        </p>
      </div>

      {/* 1-Click Demo Scenarios (Judge-Friendly) */}
      <section aria-labelledby="preloaded-cases-heading" className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 mb-8 shadow-xs">
        <div className="flex items-center justify-between mb-3.5">
          <h2 id="preloaded-cases-heading" className="text-xs font-bold tracking-wider uppercase text-stone-700 flex items-center gap-1.5">
            <Sparkles aria-hidden="true" className="w-3.5 h-3.5 text-amber-600" />
            1-Click Pre-Loaded Cases (Instant Zero-Latency Demo)
          </h2>
          <span className="text-[11px] text-stone-600 font-medium">Verified against bare acts</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => onSelectCase("case_1_loan")}
            aria-label="Load demo case: ₹4.8 Lakh Non-Bank Loan Recall"
            className="flex flex-col text-left p-3.5 rounded-lg border border-[var(--border)] hover:border-amber-500 hover:bg-amber-50/40 transition-all group cursor-pointer bg-white focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className="text-xs font-bold text-red-900 bg-red-50 border border-red-300 px-2 py-0.5 rounded">
                Loan &amp; Cheque
              </span>
              <ArrowRight aria-hidden="true" className="w-3.5 h-3.5 text-stone-500 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-semibold text-sm text-stone-900 mt-1">₹4.8L Non-Bank Loan Recall</h3>
            <p className="text-xs text-stone-700 mt-1 line-clamp-2">
              Claims 36% penal interest, immediate arrest, &amp; IPC 420 vs. Sanction Letter capping interest at 18%.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onSelectCase("case_2_rent")}
            aria-label="Load demo case: Illegal 7-Day Eviction Notice"
            className="flex flex-col text-left p-3.5 rounded-lg border border-[var(--border)] hover:border-blue-500 hover:bg-blue-50/40 transition-all group cursor-pointer bg-white focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className="text-xs font-bold text-blue-900 bg-blue-50 border border-blue-300 px-2 py-0.5 rounded">
                Tenancy &amp; Eviction
              </span>
              <ArrowRight aria-hidden="true" className="w-3.5 h-3.5 text-stone-500 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-semibold text-sm text-stone-900 mt-1">Illegal 7-Day Eviction Notice</h3>
            <p className="text-xs text-stone-700 mt-1 line-clamp-2">
              Landlord forfeits ₹1.5L deposit and threatens lock-changing vs. 30-day statutory notice in Lease.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onSelectCase("case_3_refusal")}
            aria-label="Load demo case: Custody Threat (Safety Refusal Guardrail)"
            className="flex flex-col text-left p-3.5 rounded-lg border border-purple-300 hover:border-purple-500 hover:bg-purple-50/40 transition-all group cursor-pointer bg-white focus-visible:ring-2 focus-visible:ring-purple-500"
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className="text-xs font-bold text-purple-900 bg-purple-50 border border-purple-300 px-2 py-0.5 rounded">
                Responsible AI
              </span>
              <ArrowRight aria-hidden="true" className="w-3.5 h-3.5 text-stone-500 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-semibold text-sm text-stone-900 mt-1">Custody Threat (Safety Refusal)</h3>
            <p className="text-xs text-stone-700 mt-1 line-clamp-2">
              Demonstrates ethical refusal of sensitive family matters and immediate routing to NALSA &amp; emergency helplines.
            </p>
          </button>
        </div>
      </section>

      {/* Bilateral Upload Section */}
      <section aria-label="Upload documents for cross-examination" className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Pane 1: Threatening Notice */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (event) => setNoticeText((event.target?.result as string) || "");
              reader.readAsText(file);
            }
          }}
          className="flex flex-col bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 shadow-xs transition-colors hover:border-red-300"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div aria-hidden="true" className="w-6 h-6 rounded bg-red-100 text-red-900 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <label htmlFor="notice-text-input" className="font-semibold text-sm text-[var(--foreground)] cursor-pointer">
                The Threatening Notice
              </label>
            </div>
            <label
              htmlFor="notice-file-upload"
              className="text-[11px] text-red-900 bg-red-50 hover:bg-red-100 border border-red-300 px-2 py-0.5 rounded cursor-pointer transition-colors flex items-center gap-1 focus-within:ring-2 focus-within:ring-red-500"
            >
              <UploadCloud aria-hidden="true" className="w-3 h-3" /> Upload File
              <input
                id="notice-file-upload"
                type="file"
                accept=".txt,.md,.pdf"
                aria-label="Upload legal notice file"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => setNoticeText((event.target?.result as string) || "");
                    reader.readAsText(file);
                  }
                }}
              />
            </label>
          </div>

          <textarea
            id="notice-text-input"
            name="notice-text"
            value={noticeText}
            onChange={(e) => setNoticeText(e.target.value)}
            aria-label="Threatening legal notice text"
            placeholder="Paste text of the legal notice here or drag & drop a file..."
            className="w-full h-44 p-3 text-xs rounded-lg border border-[var(--border)] bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono resize-none text-stone-900"
          />

          <div className="mt-3 flex items-center justify-between text-xs text-stone-600">
            <span className="flex items-center gap-1">
              <UploadCloud aria-hidden="true" className="w-3.5 h-3.5" /> Drag &amp; drop or paste notice
            </span>
            <span aria-live="polite">{noticeText.length} chars</span>
          </div>
        </div>

        {/* Pane 2: Recipient's Own Contract */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (event) => setAgreementText((event.target?.result as string) || "");
              reader.readAsText(file);
            }
          }}
          className="flex flex-col bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 shadow-xs transition-colors hover:border-blue-300"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div aria-hidden="true" className="w-6 h-6 rounded bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <label htmlFor="agreement-text-input" className="font-semibold text-sm text-[var(--foreground)] cursor-pointer">
                Your Signed Contract
              </label>
            </div>
            <label
              htmlFor="agreement-file-upload"
              className="text-[11px] text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-300 px-2 py-0.5 rounded cursor-pointer transition-colors flex items-center gap-1 focus-within:ring-2 focus-within:ring-blue-500"
            >
              <UploadCloud aria-hidden="true" className="w-3 h-3" /> Upload File
              <input
                id="agreement-file-upload"
                type="file"
                accept=".txt,.md,.pdf"
                aria-label="Upload signed contract or evidence file"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => setAgreementText((event.target?.result as string) || "");
                    reader.readAsText(file);
                  }
                }}
              />
            </label>
          </div>

          <textarea
            id="agreement-text-input"
            name="agreement-text"
            value={agreementText}
            onChange={(e) => setAgreementText(e.target.value)}
            aria-label="Your signed contract or counter-evidence text"
            placeholder="Paste text of your agreement or drag & drop a contract file..."
            className="w-full h-44 p-3 text-xs rounded-lg border border-[var(--border)] bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono resize-none text-stone-900"
          />

          <div className="mt-3 flex items-center justify-between text-xs text-stone-600">
            <span className="flex items-center gap-1">
              <FileText aria-hidden="true" className="w-3.5 h-3.5" /> Bilateral Cross-Examination
            </span>
            <span aria-live="polite">{agreementText.length} chars</span>
          </div>
        </div>
      </section>

      {/* Jurisdiction & Language Bar */}
      <section aria-label="Jurisdiction and analysis options" className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="flex flex-col">
            <label htmlFor="jurisdiction-select" className="text-[11px] font-semibold text-stone-700 uppercase">
              State Jurisdiction
            </label>
            <select
              id="jurisdiction-select"
              name="jurisdiction"
              value={jurisdiction}
              onChange={(e) => setJurisdiction(e.target.value)}
              aria-label="Select state legal jurisdiction"
              className="text-xs bg-gray-50 border border-[var(--border)] rounded px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-gray-900"
            >
              <option value="DL">Delhi (NCT)</option>
              <option value="KA">Karnataka (Bengaluru)</option>
              <option value="MH">Maharashtra (Mumbai)</option>
              <option value="UP">Uttar Pradesh</option>
              <option value="TN">Tamil Nadu</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="language-select" className="text-[11px] font-semibold text-stone-700 uppercase">
              Explanation Language
            </label>
            <select
              id="language-select"
              name="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              aria-label="Select explanation language"
              className="text-xs bg-gray-50 border border-[var(--border)] rounded px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-gray-900"
            >
              <option value="hi">हिंदी (Hindi)</option>
              <option value="en">English</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="bn">বাংলা (Bengali)</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (!noticeText.trim()) {
              onSelectCase("case_1_loan");
            } else {
              onCustomSubmit(noticeText, agreementText, jurisdiction, language);
            }
          }}
          aria-label="Cross-examine legal notice against signed contract"
          className="w-full sm:w-auto px-6 py-2.5 bg-stone-950 text-white font-medium text-xs rounded-lg hover:bg-black transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          Cross-Examine Documents
          <ArrowRight aria-hidden="true" className="w-3.5 h-3.5" />
        </button>
      </section>
    </div>
  );
};
