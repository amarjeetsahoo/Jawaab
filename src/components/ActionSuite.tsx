"use client";

import React, { useState } from "react";
import { AnalysisResult } from "@/types";
import {
  Calendar,
  Volume2,
  VolumeX,
  FileText,
  Briefcase,
  Copy,
  Check,
  Download,
  AlertCircle,
  HelpCircle,
  Clock,
  ArrowLeft,
} from "lucide-react";
import { generateIcsCalendar } from "@/lib/deadline-math";

interface ActionSuiteProps {
  data: AnalysisResult;
  onBackToFindings: () => void;
}

export const ActionSuite: React.FC<ActionSuiteProps> = ({
  data,
  onBackToFindings,
}) => {
  const [activeTab, setActiveTab] = useState<"clock" | "reply" | "lawyer" | "forecast">("clock");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedReply, setCopiedReply] = useState(false);
  const [replyTone, setReplyTone] = useState<"formal" | "whatsapp">("formal");

  // Web Speech API / TTS handler
  const handleToggleAudio = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      const textToSpeak =
        data.translations?.hi?.plain_summary ||
        data.deadline_analysis.deadline_explanation;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  // Calendar .ics download handler
  const handleDownloadCalendar = () => {
    const icsContent = generateIcsCalendar(
      `Legal Notice Response Deadline (${data.case_id})`,
      data.deadline_analysis.deadline_explanation,
      data.deadline_analysis.statutory_response_deadline
    );
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `jawaab_deadline_${data.case_id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Formal Reply Text
  const formalReplyDraft = `WITHOUT PREJUDICE

Date: ${new Date().toISOString().split("T")[0]}
To: ${data.notice_metadata.sender}

RE: REPLY TO LEGAL NOTICE DATED ${data.notice_metadata.notice_date} ON BEHALF OF ${data.notice_metadata.recipient.toUpperCase()}

Sir/Madam,

Under instructions from my client, I hereby reply to your notice under reference as follows:

1. That the contents of your notice, save and except what are specifically admitted herein, are denied in toto as misconstrued and contrary to the executed agreement between the parties.

2. That your demand recalling the entire facility / demanding summary vacation in 7 days is legally untenable and premature. As per the governing terms:
${data.claims
  .map(
    (c, i) =>
      `   (${i + 1}) Regarding ${c.claim_type.replace(/_/g, " ")}: ${c.analysis} (Governed by ${c.statute_citation}).`
  )
  .join("\n\n")}

3. That your notice threatens criminal arrest and penal citations which have no application to a bona fide civil transaction. Such coercive threats violate authoritative Supreme Court guidelines.

4. My client remains ready and willing to resolve legitimate contractual obligations strictly in conformity with the sanctioned terms and statutory provisions.

Yours faithfully,
For ${data.notice_metadata.recipient}`;

  // WhatsApp Informal Negotiation Script
  const whatsappDraft = `Hello, this is regarding the legal notice sent on behalf of ${data.notice_metadata.sender}. 

I have reviewed our signed agreement. The 7-day recall and 36% penal interest demands do not align with our agreed terms (which cap charges and require proper notice). Furthermore, civil non-payment cannot be subject to police arrest threats under Supreme Court guidelines.

I am ready to settle the genuine overdue amount in accordance with our contract schedule. Please provide an itemized, corrected statement of account so we can resolve this smoothly without unnecessary litigation.`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedReply(true);
    setTimeout(() => setCopiedReply(false), 2000);
  };

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
        <button
          onClick={onBackToFindings}
          className="text-xs px-3 py-1.5 rounded border border-[var(--border)] text-[var(--muted-foreground)] hover:text-black flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Cross-Examination
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleAudio}
            className={`text-xs px-3 py-1.5 rounded font-medium flex items-center gap-1.5 border transition-all cursor-pointer ${
              isPlayingAudio
                ? "bg-amber-100 text-amber-900 border-amber-300"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {isPlayingAudio ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-red-600" /> Stop Spoken Hindi
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-amber-700" /> Listen in Hindi (TTS)
              </>
            )}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[var(--border)] space-x-6">
        <button
          onClick={() => setActiveTab("clock")}
          className={`pb-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === "clock"
              ? "border-[var(--foreground)] text-[var(--foreground)]"
              : "border-transparent text-[var(--muted-foreground)] hover:text-black"
          }`}
        >
          <Clock className="w-4 h-4" /> 1. The Deadline Clock
        </button>

        <button
          onClick={() => setActiveTab("reply")}
          className={`pb-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === "reply"
              ? "border-[var(--foreground)] text-[var(--foreground)]"
              : "border-transparent text-[var(--muted-foreground)] hover:text-black"
          }`}
        >
          <FileText className="w-4 h-4" /> 2. Reply Drafts
        </button>

        <button
          onClick={() => setActiveTab("lawyer")}
          className={`pb-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === "lawyer"
              ? "border-[var(--foreground)] text-[var(--foreground)]"
              : "border-transparent text-[var(--muted-foreground)] hover:text-black"
          }`}
        >
          <Briefcase className="w-4 h-4" /> 3. Lawyer Handoff Pack
        </button>

        <button
          onClick={() => setActiveTab("forecast")}
          className={`pb-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === "forecast"
              ? "border-[var(--foreground)] text-[var(--foreground)]"
              : "border-transparent text-[var(--muted-foreground)] hover:text-black"
          }`}
        >
          <AlertCircle className="w-4 h-4" /> 4. Do-Nothing Forecast
        </button>
      </div>

      {/* Tab 1: The Deadline Clock */}
      {activeTab === "clock" && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 shadow-xs">
          <div className="md:col-span-5 flex flex-col items-center justify-center p-4 border-r border-gray-100">
            {/* Countdown Ring */}
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="text-gray-100 stroke-current"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="text-amber-500 stroke-current"
                  strokeWidth="8"
                  strokeDasharray="264"
                  strokeDashoffset="66"
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-extrabold font-mono tracking-tight text-gray-900">
                  {data.deadline_analysis.statutory_response_days_allowed}
                </span>
                <span className="text-[11px] uppercase font-bold text-gray-500 tracking-wider">
                  Days to Respond
                </span>
              </div>
            </div>

            <button
              onClick={handleDownloadCalendar}
              className="mt-6 px-4 py-2 bg-[var(--foreground)] text-[var(--background)] text-xs font-medium rounded-lg hover:bg-black transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Calendar className="w-3.5 h-3.5" /> Export to Calendar (.ics)
            </button>
          </div>

          <div className="md:col-span-7 space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                Statutory Limitation vs Advocate Bluff
              </span>
              <h3 className="text-lg font-bold font-serif-legal text-gray-900 mt-1">
                You have until {data.deadline_analysis.statutory_response_deadline} to respond.
              </h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                {data.deadline_analysis.deadline_explanation}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-red-50/70 border border-red-200 rounded-lg">
                <div className="text-[10px] uppercase font-bold text-red-700">Notice Claimed Window</div>
                <div className="text-base font-bold text-red-950 mt-0.5">
                  {data.notice_metadata.claimed_deadline_days} Days
                </div>
                <div className="text-[11px] text-red-800 mt-1">Expiry: {data.deadline_analysis.notice_claimed_deadline}</div>
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg">
                <div className="text-[10px] uppercase font-bold text-emerald-700">True Statutory Window</div>
                <div className="text-base font-bold text-emerald-950 mt-0.5">
                  {data.deadline_analysis.statutory_response_days_allowed} Days
                </div>
                <div className="text-[11px] text-emerald-800 mt-1">Expiry: {data.deadline_analysis.statutory_response_deadline}</div>
              </div>
            </div>

            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs space-y-1">
              <span className="font-bold text-gray-900">Limitation Period (Court Action Window):</span>
              <p className="text-gray-600">
                The sender has <strong>{data.deadline_analysis.limitation_months_remaining} months</strong> (until{" "}
                {data.deadline_analysis.limitation_expiry_date}) to file a civil suit in court under the Limitation Act, 1963. They cannot rush you into an unlawful waiver.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Reply Drafts */}
      {activeTab === "reply" && (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setReplyTone("formal")}
                className={`text-xs px-3 py-1 rounded font-medium cursor-pointer ${
                  replyTone === "formal"
                    ? "bg-[var(--foreground)] text-[var(--background)]"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Formal Legal Notice Reply
              </button>
              <button
                onClick={() => setReplyTone("whatsapp")}
                className={`text-xs px-3 py-1 rounded font-medium cursor-pointer ${
                  replyTone === "whatsapp"
                    ? "bg-emerald-700 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Informal WhatsApp Tone
              </button>
            </div>

            <button
              onClick={() => copyToClipboard(replyTone === "formal" ? formalReplyDraft : whatsappDraft)}
              className="text-xs px-3 py-1.5 rounded border border-gray-300 text-gray-800 hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer"
            >
              {copiedReply ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedReply ? "Copied!" : "Copy to Clipboard"}
            </button>
          </div>

          <textarea
            readOnly
            value={replyTone === "formal" ? formalReplyDraft : whatsappDraft}
            rows={14}
            className="w-full p-4 rounded-lg bg-gray-50 border border-gray-200 text-xs font-mono text-gray-900 focus:outline-none leading-relaxed resize-none"
          />
        </div>
      )}

      {/* Tab 3: Lawyer Handoff Pack */}
      {activeTab === "lawyer" && (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 shadow-xs space-y-6">
          <div className="border-b border-gray-100 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold font-serif-legal text-gray-900">
                1-Page Lawyer Handoff Brief
              </h3>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                Don&apos;t waste your paid advocate consult explaining facts. Hand over this pre-framed brief.
              </p>
            </div>

            <div className="flex items-center gap-2 no-print">
              <button
                onClick={() => {
                  const mdContent = `# JAWAAB LEGAL BRIEF FOR ADVOCATE CONSULTATION
Case Reference: ${data.case_id}
Audit Hash: ${data.document_hash}
Date of Generation: ${new Date().toISOString().split("T")[0]}

## 1. PARTIES & NOTICE METADATA
- SENDER: ${data.notice_metadata.sender}
- RECIPIENT: ${data.notice_metadata.recipient}
- NOTICE DATE: ${data.notice_metadata.notice_date}
- SERVICE MODE: ${data.notice_metadata.mode_of_service}
- DEMANDED AMOUNT: ₹${data.notice_metadata.alleged_amount.toLocaleString("en-IN")}
- CLAIMED DEADLINE: ${data.notice_metadata.claimed_deadline_days} Days

## 2. STATUTORY DEADLINE TIMELINE
- Effective Receipt Date: ${data.deadline_analysis.effective_receipt_date}
- Statutory Response Expiry: ${data.deadline_analysis.statutory_response_deadline} (Allowed: ${data.deadline_analysis.statutory_response_days_allowed} days)
- Limitation Act Expiry: ${data.deadline_analysis.limitation_expiry_date} (${data.deadline_analysis.limitation_months_remaining} months remaining)

## 3. SUMMARY OF DISPUTED CLAIMS
${data.claims
  .map(
    (c, i) =>
      `### Claim ${i + 1}: ${c.claim_type.toUpperCase()} [VERDICT: ${c.verdict.toUpperCase()}]
- Notice Quote: "${c.notice_quote}"
- Agreement Quote: "${c.agreement_quote || "N/A"}" (${c.agreement_clause || "Statutory"})
- Authority Cited: ${c.statute_citation}
- Analysis: ${c.analysis}
- Suggested Rebuttal: ${c.remedy}
`
  )
  .join("\n")}

## 4. KEY ISSUES FRAMED FOR COUNSEL
${data.lawyer_handoff_pack.key_issues_framed.map((x, i) => `${i + 1}. ${x}`).join("\n")}

## 5. SPECIFIC QUESTIONS FOR ADVOCATE
${data.lawyer_handoff_pack.questions_for_advocate.map((x, i) => `${i + 1}. ${x}`).join("\n")}

## 6. FREE LEGAL AID ELIGIBILITY
${data.lawyer_handoff_pack.free_legal_aid_eligibility}
`;
                  const blob = new Blob([mdContent], { type: "text/markdown;charset=utf-8" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `lawyer_handoff_brief_${data.case_id}.md`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                }}
                className="text-xs px-3 py-1.5 rounded border border-gray-300 text-gray-800 hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer font-medium"
              >
                <Download className="w-3.5 h-3.5" /> Download Brief (.md)
              </button>

              <button
                onClick={() => window.print()}
                className="text-xs px-4 py-1.5 rounded bg-[var(--foreground)] text-[var(--background)] hover:bg-black flex items-center gap-1.5 cursor-pointer font-medium shadow-xs"
              >
                <FileText className="w-3.5 h-3.5" /> Print / Save as PDF
              </button>
            </div>
          </div>

          {/* Printable Letterhead (Only visible during print) */}
          <div className="hidden print:block border-b-2 border-black pb-3 mb-4">
            <h1 className="text-xl font-bold font-serif">JAWAAB · LEGAL NOTICE AUDIT BRIEF</h1>
            <div className="text-[10pt] text-gray-700 flex justify-between mt-1">
              <span>Recipient: <strong>{data.notice_metadata.recipient}</strong></span>
              <span>Notice Date: <strong>{data.notice_metadata.notice_date}</strong></span>
              <span>Demanded: <strong>₹{data.notice_metadata.alleged_amount.toLocaleString("en-IN")}</strong></span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 mb-2">
                1. Core Issues Framed for Legal Counsel
              </h4>
              <ul className="space-y-2 text-xs text-gray-700">
                {data.lawyer_handoff_pack.key_issues_framed.map((issue, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="font-bold text-amber-700">[{i + 1}]</span>
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 mb-2">
                2. Specific Questions to Ask the Advocate
              </h4>
              <ul className="space-y-2 text-xs text-gray-700">
                {data.lawyer_handoff_pack.questions_for_advocate.map((q, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <HelpCircle className="w-3.5 h-3.5 text-indigo-600 mt-0.5 shrink-0" />
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-lg text-xs space-y-1">
              <span className="font-bold text-blue-950">Free Legal Aid Eligibility:</span>
              <p className="text-blue-900 leading-relaxed">
                {data.lawyer_handoff_pack.free_legal_aid_eligibility}
              </p>
            </div>

            {/* Claim Audit Summary for the Advocate */}
            <div className="pt-3 border-t border-gray-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 mb-2">
                3. Claim-by-Claim Audit Trail
              </h4>
              <div className="border border-gray-200 rounded-lg overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-200 text-[11px] uppercase font-bold text-gray-600">
                    <tr>
                      <th className="p-2.5">Claim Type</th>
                      <th className="p-2.5">Verdict</th>
                      <th className="p-2.5">Contract Basis</th>
                      <th className="p-2.5">Statute / Citation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.claims.map((c) => (
                      <tr key={c.id} className="hover:bg-gray-50/50">
                        <td className="p-2.5 font-medium">{c.claim_type.replace(/_/g, " ")}</td>
                        <td className="p-2.5 font-bold uppercase text-[10px]">
                          <span
                            className={
                              c.verdict === "valid"
                                ? "text-emerald-700"
                                : c.verdict === "unenforceable"
                                ? "text-red-700"
                                : "text-amber-700"
                            }
                          >
                            {c.verdict}
                          </span>
                        </td>
                        <td className="p-2.5 text-gray-600">{c.agreement_clause || "Statutory ground"}</td>
                        <td className="p-2.5 text-gray-800 font-medium">{c.statute_citation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Do-Nothing Forecast */}
      {activeTab === "forecast" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-5 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>If You Send a Rebuttal</span>
            </div>
            <p className="text-xs text-emerald-950 leading-relaxed">
              {data.do_nothing_forecast.reply_sent}
            </p>
          </div>

          <div className="bg-red-50/60 border border-red-200 rounded-xl p-5 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-red-900 font-bold text-sm">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span>If You Stay Silent / Do Nothing</span>
            </div>
            <p className="text-xs text-red-950 leading-relaxed">
              {data.do_nothing_forecast.stay_silent}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
