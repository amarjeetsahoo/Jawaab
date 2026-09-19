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
      <div className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 mb-8 shadow-xs">
        <div className="flex items-center justify-between mb-3.5">
          <span className="text-xs font-bold tracking-wider uppercase text-[var(--muted-foreground)] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            1-Click Pre-Loaded Cases (Instant Zero-Latency Demo)
          </span>
          <span className="text-[11px] text-[var(--muted-foreground)]">Verified against bare acts</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => onSelectCase("case_1_loan")}
            className="flex flex-col text-left p-3.5 rounded-lg border border-[var(--border)] hover:border-amber-400 hover:bg-amber-50/40 transition-all group cursor-pointer bg-white"
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                Loan & Cheque
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h4 className="font-semibold text-sm text-gray-900 mt-1">₹4.8L Non-Bank Loan Recall</h4>
            <p className="text-xs text-[var(--muted-foreground)] mt-1 line-clamp-2">
              Claims 36% penal interest, immediate arrest, & IPC 420 vs. Sanction Letter capping interest at 18%.
            </p>
          </button>

          <button
            onClick={() => onSelectCase("case_2_rent")}
            className="flex flex-col text-left p-3.5 rounded-lg border border-[var(--border)] hover:border-blue-400 hover:bg-blue-50/40 transition-all group cursor-pointer bg-white"
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                Tenancy & Eviction
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h4 className="font-semibold text-sm text-gray-900 mt-1">Illegal 7-Day Eviction Notice</h4>
            <p className="text-xs text-[var(--muted-foreground)] mt-1 line-clamp-2">
              Landlord forfeits ₹1.5L deposit and threatens lock-changing vs. 30-day statutory notice in Lease.
            </p>
          </button>

          <button
            onClick={() => onSelectCase("case_3_refusal")}
            className="flex flex-col text-left p-3.5 rounded-lg border border-purple-200 hover:border-purple-400 hover:bg-purple-50/40 transition-all group cursor-pointer bg-white"
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className="text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded">
                Responsible AI
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <h4 className="font-semibold text-sm text-gray-900 mt-1">Custody Threat (Safety Refusal)</h4>
            <p className="text-xs text-[var(--muted-foreground)] mt-1 line-clamp-2">
              Demonstrates ethical refusal of sensitive family matters and immediate routing to NALSA & emergency helplines.
            </p>
          </button>
        </div>
      </div>

      {/* Bilateral Upload Section */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
              <div className="w-6 h-6 rounded bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h3 className="font-semibold text-sm text-[var(--foreground)]">The Threatening Notice</h3>
            </div>
            <label className="text-[11px] text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-2 py-0.5 rounded cursor-pointer transition-colors flex items-center gap-1">
              <UploadCloud className="w-3 h-3" /> Upload File
              <input
                type="file"
                accept=".txt,.md,.pdf"
                className="hidden"
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
            value={noticeText}
            onChange={(e) => setNoticeText(e.target.value)}
            placeholder="Paste text of the legal notice here or drag & drop a file..."
            className="w-full h-44 p-3 text-xs rounded-lg border border-[var(--border)] bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono resize-none"
          />

          <div className="mt-3 flex items-center justify-between text-xs text-[var(--muted-foreground)]">
            <span className="flex items-center gap-1">
              <UploadCloud className="w-3.5 h-3.5" /> Drag & drop or paste notice
            </span>
            <span>{noticeText.length} chars</span>
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
              <div className="w-6 h-6 rounded bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h3 className="font-semibold text-sm text-[var(--foreground)]">Your Signed Contract</h3>
            </div>
            <label className="text-[11px] text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2 py-0.5 rounded cursor-pointer transition-colors flex items-center gap-1">
              <UploadCloud className="w-3 h-3" /> Upload File
              <input
                type="file"
                accept=".txt,.md,.pdf"
                className="hidden"
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
            value={agreementText}
            onChange={(e) => setAgreementText(e.target.value)}
            placeholder="Paste text of your agreement or drag & drop a contract file..."
            className="w-full h-44 p-3 text-xs rounded-lg border border-[var(--border)] bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono resize-none"
          />

          <div className="mt-3 flex items-center justify-between text-xs text-[var(--muted-foreground)]">
            <span className="flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" /> Bilateral Cross-Examination
            </span>
            <span>{agreementText.length} chars</span>
          </div>
        </div>
      </div>

      {/* Jurisdiction & Language Bar */}
      <div className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="flex flex-col">
            <label className="text-[11px] font-semibold text-[var(--muted-foreground)] uppercase">
              State Jurisdiction
            </label>
            <select
              value={jurisdiction}
              onChange={(e) => setJurisdiction(e.target.value)}
              className="text-xs bg-gray-50 border border-[var(--border)] rounded px-2.5 py-1.5 focus:outline-none font-medium text-gray-800"
            >
              <option value="DL">Delhi (NCT)</option>
              <option value="KA">Karnataka (Bengaluru)</option>
              <option value="MH">Maharashtra (Mumbai)</option>
              <option value="UP">Uttar Pradesh</option>
              <option value="TN">Tamil Nadu</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-[11px] font-semibold text-[var(--muted-foreground)] uppercase">
              Explanation Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="text-xs bg-gray-50 border border-[var(--border)] rounded px-2.5 py-1.5 focus:outline-none font-medium text-gray-800"
            >
              <option value="hi">हिंदी (Hindi)</option>
              <option value="en">English</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="bn">বাংলা (Bengali)</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => {
            if (!noticeText.trim()) {
              onSelectCase("case_1_loan");
            } else {
              onCustomSubmit(noticeText, agreementText, jurisdiction, language);
            }
          }}
          className="w-full sm:w-auto px-6 py-2.5 bg-[var(--foreground)] text-[var(--background)] font-medium text-xs rounded-lg hover:bg-black transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          Cross-Examine Documents
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
