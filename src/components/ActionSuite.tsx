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
          type="button"
          onClick={onBackToFindings}
          aria-label="Back to bilateral cross-examination view"
          className="text-xs px-3 py-1.5 rounded border border-[var(--border)] text-stone-800 hover:text-black flex items-center gap-1.5 cursor-pointer bg-white focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          <ArrowLeft aria-hidden="true" className="w-3.5 h-3.5" /> Back to Cross-Examination
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleAudio}
            aria-label={isPlayingAudio ? "Stop spoken Hindi briefing audio" : "Listen to summary in spoken Hindi using text to speech"}
            className={`text-xs px-3 py-1.5 rounded font-medium flex items-center gap-1.5 border transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500 ${
              isPlayingAudio
                ? "bg-amber-100 text-amber-950 border-amber-300"
                : "bg-white text-stone-800 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {isPlayingAudio ? (
              <>
                <VolumeX aria-hidden="true" className="w-3.5 h-3.5 text-red-600" /> Stop Spoken Hindi
              </>
            ) : (
              <>
                <Volume2 aria-hidden="true" className="w-3.5 h-3.5 text-amber-800" /> Listen in Hindi (TTS)
              </>
            )}
          </button>
        </div>
      </div>

      <header className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold font-serif-legal text-[var(--foreground)]">
          Action Suite: Strategic Rebuttal &amp; Next Steps
        </h1>
        <p className="text-xs text-stone-600">
          Statutory countdown calendar, evidence-backed rebuttal drafts, and District Legal Aid (DLSA) advocate briefs.
        </p>
      </header>

      {/* Navigation Tabs */}
      <div role="tablist" aria-label="Action suite tools" className="flex border-b border-[var(--border)] space-x-6 overflow-x-auto">
        <button
          type="button"
          role="tab"
          id="tab-clock"
          aria-controls="panel-clock"
          aria-selected={activeTab === "clock"}
          onClick={() => setActiveTab("clock")}
          className={`pb-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-amber-500 ${
            activeTab === "clock"
              ? "border-[var(--foreground)] text-[var(--foreground)]"
              : "border-transparent text-stone-600 hover:text-black"
          }`}
        >
          <Clock aria-hidden="true" className="w-4 h-4" /> 1. The Deadline Clock
        </button>

        <button
          type="button"
          role="tab"
          id="tab-reply"
          aria-controls="panel-reply"
          aria-selected={activeTab === "reply"}
          onClick={() => setActiveTab("reply")}
          className={`pb-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-amber-500 ${
            activeTab === "reply"
              ? "border-[var(--foreground)] text-[var(--foreground)]"
              : "border-transparent text-stone-600 hover:text-black"
          }`}
        >
          <FileText aria-hidden="true" className="w-4 h-4" /> 2. Reply Drafts
        </button>

        <button
          type="button"
          role="tab"
          id="tab-lawyer"
          aria-controls="panel-lawyer"
          aria-selected={activeTab === "lawyer"}
          onClick={() => setActiveTab("lawyer")}
          className={`pb-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-amber-500 ${
            activeTab === "lawyer"
              ? "border-[var(--foreground)] text-[var(--foreground)]"
              : "border-transparent text-stone-600 hover:text-black"
          }`}
        >
          <Briefcase aria-hidden="true" className="w-4 h-4" /> 3. Lawyer Handoff Pack
        </button>

        <button
          type="button"
          role="tab"
          id="tab-forecast"
          aria-controls="panel-forecast"
          aria-selected={activeTab === "forecast"}
          onClick={() => setActiveTab("forecast")}
          className={`pb-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-amber-500 ${
            activeTab === "forecast"
              ? "border-[var(--foreground)] text-[var(--foreground)]"
              : "border-transparent text-stone-600 hover:text-black"
          }`}
        >
          <AlertCircle aria-hidden="true" className="w-4 h-4" /> 4. Do-Nothing Forecast
        </button>
      </div>

      {/* Tab 1: The Deadline Clock */}
      {activeTab === "clock" && (
        <section
          id="panel-clock"
          role="tabpanel"
          tabIndex={0}
          aria-labelledby="tab-clock"
          className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 shadow-xs focus:outline-none"
        >
          <div className="md:col-span-5 flex flex-col items-center justify-center p-4 border-r border-gray-100">
            {/* Countdown Ring */}
            <div
              role="img"
              aria-label={`Countdown ring showing ${data.deadline_analysis.statutory_response_days_allowed} days to respond`}
              className="relative w-44 h-44 flex items-center justify-center"
            >
              <svg aria-hidden="true" className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
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
                <span className="text-[11px] uppercase font-bold text-stone-600 tracking-wider">
                  Days to Respond
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownloadCalendar}
              aria-label="Export response deadline to calendar as ICS file"
              className="mt-6 px-4 py-2 bg-stone-950 text-white text-xs font-medium rounded-lg hover:bg-black transition-colors flex items-center gap-2 cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              <Calendar aria-hidden="true" className="w-3.5 h-3.5" /> Export to Calendar (.ics)
            </button>
          </div>

          <div className="md:col-span-7 space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                Statutory Limitation vs Advocate Bluff
              </span>
              <h2 className="text-lg font-bold font-serif-legal text-gray-900 mt-1">
                You have until {data.deadline_analysis.statutory_response_deadline} to respond.
              </h2>
              <p className="text-xs text-stone-700 mt-1 leading-relaxed">
                {data.deadline_analysis.deadline_explanation}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-red-50/70 border border-red-200 rounded-lg">
                <div className="text-[10px] uppercase font-bold text-red-900">Notice Claimed Window</div>
                <div className="text-base font-bold text-red-950 mt-0.5">
                  {data.notice_metadata.claimed_deadline_days} Days
                </div>
                <div className="text-[11px] text-red-900 mt-1">Expiry: {data.deadline_analysis.notice_claimed_deadline}</div>
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg">
                <div className="text-[10px] uppercase font-bold text-emerald-900">True Statutory Window</div>
                <div className="text-base font-bold text-emerald-950 mt-0.5">
                  {data.deadline_analysis.statutory_response_days_allowed} Days
                </div>
                <div className="text-[11px] text-emerald-900 mt-1">Expiry: {data.deadline_analysis.statutory_response_deadline}</div>
              </div>
            </div>

            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs space-y-1">
              <span className="font-bold text-gray-900">Limitation Period (Court Action Window):</span>
              <p className="text-stone-700">
                The sender has <strong>{data.deadline_analysis.limitation_months_remaining} months</strong> (until{" "}
                {data.deadline_analysis.limitation_expiry_date}) to file a civil suit in court under the Limitation Act, 1963. They cannot rush you into an unlawful waiver.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Tab 2: Reply Drafts */}
      {activeTab === "reply" && (
        <section
          id="panel-reply"
          role="tabpanel"
          tabIndex={0}
          aria-labelledby="tab-reply"
          className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 shadow-xs space-y-4 focus:outline-none"
        >
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div role="radiogroup" aria-label="Reply register tone" className="flex items-center gap-2">
              <button
                type="button"
                role="radio"
                aria-checked={replyTone === "formal"}
                onClick={() => setReplyTone("formal")}
                className={`text-xs px-3 py-1 rounded font-medium cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500 ${
                  replyTone === "formal"
                    ? "bg-stone-950 text-white"
                    : "bg-gray-100 text-stone-800 hover:bg-gray-200"
                }`}
              >
                Formal Legal Notice Reply
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={replyTone === "whatsapp"}
                onClick={() => setReplyTone("whatsapp")}
                className={`text-xs px-3 py-1 rounded font-medium cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                  replyTone === "whatsapp"
                    ? "bg-emerald-800 text-white"
                    : "bg-gray-100 text-stone-800 hover:bg-gray-200"
                }`}
              >
                Informal WhatsApp Tone
              </button>
            </div>

            <button
              type="button"
              onClick={() => copyToClipboard(replyTone === "formal" ? formalReplyDraft : whatsappDraft)}
              aria-label="Copy generated reply draft to clipboard"
              className="text-xs px-3 py-1.5 rounded border border-gray-300 text-stone-800 hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              {copiedReply ? <Check aria-hidden="true" className="w-3.5 h-3.5 text-emerald-600" /> : <Copy aria-hidden="true" className="w-3.5 h-3.5" />}
              {copiedReply ? "Copied!" : "Copy to Clipboard"}
            </button>
          </div>

          <label htmlFor="reply-draft-textarea" className="sr-only">
            Generated Rebuttal Draft Text
          </label>
          <textarea
            id="reply-draft-textarea"
            name="reply-draft-text"
            readOnly
            aria-label="Generated legal reply draft text"
            value={replyTone === "formal" ? formalReplyDraft : whatsappDraft}
            rows={14}
            className="w-full p-4 rounded-lg bg-gray-50 border border-gray-200 text-xs font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed resize-none"
          />
        </section>
      )}

      {/* Tab 3: Lawyer Handoff Pack */}
      {activeTab === "lawyer" && (
        <section
          id="panel-lawyer"
          role="tabpanel"
          tabIndex={0}
          aria-labelledby="tab-lawyer"
          className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 shadow-xs space-y-6 focus:outline-none"
        >
          <div className="border-b border-gray-100 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold font-serif-legal text-gray-900">
                1-Page Lawyer Handoff Brief
              </h2>
              <p className="text-xs text-stone-600 mt-0.5">
                Don&apos;t waste your paid advocate consult explaining facts. Hand over this pre-framed brief.
              </p>
            </div>

            <div className="flex items-center gap-2 no-print">
              <button
                type="button"
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
                aria-label="Download pre-framed legal brief in markdown format"
                className="text-xs px-3 py-1.5 rounded border border-gray-300 text-stone-800 hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer font-medium focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                <Download aria-hidden="true" className="w-3.5 h-3.5" /> Download Brief (.md)
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                aria-label="Print or save legal brief as PDF"
                className="text-xs px-4 py-1.5 rounded bg-stone-950 text-white hover:bg-black flex items-center gap-1.5 cursor-pointer font-medium shadow-xs focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                <FileText aria-hidden="true" className="w-3.5 h-3.5" /> Print / Save as PDF
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 mb-2">
                1. Core Issues Framed for Legal Counsel
              </h3>
              <ul className="space-y-2 text-xs text-stone-700">
                {data.lawyer_handoff_pack.key_issues_framed.map((issue, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="font-bold text-amber-800">[{i + 1}]</span>
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 mb-2">
                2. Specific Questions to Ask the Advocate
              </h3>
              <ul className="space-y-2 text-xs text-stone-700">
                {data.lawyer_handoff_pack.questions_for_advocate.map((q, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <HelpCircle aria-hidden="true" className="w-3.5 h-3.5 text-indigo-700 mt-0.5 shrink-0" />
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-lg text-xs space-y-1">
              <span className="font-bold text-blue-950">Free Legal Aid Eligibility:</span>
              <p className="text-blue-950 leading-relaxed">
                {data.lawyer_handoff_pack.free_legal_aid_eligibility}
              </p>
            </div>

            {/* Claim Audit Summary for the Advocate */}
            <div className="pt-3 border-t border-gray-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 mb-2">
                3. Claim-by-Claim Audit Trail
              </h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden text-xs">
                <table className="w-full text-left" aria-label="Claim-by-claim audit table">
                  <thead className="bg-gray-50 border-b border-gray-200 text-[11px] uppercase font-bold text-stone-700">
                    <tr>
                      <th scope="col" className="p-2.5">Claim Type</th>
                      <th scope="col" className="p-2.5">Verdict</th>
                      <th scope="col" className="p-2.5">Contract Basis</th>
                      <th scope="col" className="p-2.5">Statute / Citation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.claims.map((c) => (
                      <tr key={c.id} className="hover:bg-gray-50/50">
                        <td className="p-2.5 font-medium text-stone-900">{c.claim_type.replace(/_/g, " ")}</td>
                        <td className="p-2.5 font-bold uppercase text-[10px]">
                          <span
                            className={
                              c.verdict === "valid"
                                ? "text-emerald-800"
                                : c.verdict === "unenforceable"
                                ? "text-red-800"
                                : "text-amber-800"
                            }
                          >
                            {c.verdict}
                          </span>
                        </td>
                        <td className="p-2.5 text-stone-700">{c.agreement_clause || "Statutory ground"}</td>
                        <td className="p-2.5 text-stone-900 font-medium">{c.statute_citation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tab 4: Do-Nothing Forecast */}
      {activeTab === "forecast" && (
        <section
          id="panel-forecast"
          role="tabpanel"
          tabIndex={0}
          aria-labelledby="tab-forecast"
          className="grid grid-cols-1 md:grid-cols-2 gap-4 focus:outline-none"
        >
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-5 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm">
              <Check aria-hidden="true" className="w-4 h-4 text-emerald-700" />
              <h2 className="text-sm font-bold text-emerald-950">If You Send a Rebuttal</h2>
            </div>
            <p className="text-xs text-emerald-950 leading-relaxed">
              {data.do_nothing_forecast.reply_sent}
            </p>
          </div>

          <div className="bg-red-50/60 border border-red-200 rounded-xl p-5 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-red-950 font-bold text-sm">
              <AlertCircle aria-hidden="true" className="w-4 h-4 text-red-700" />
              <h2 className="text-sm font-bold text-red-950">If You Stay Silent / Do Nothing</h2>
            </div>
            <p className="text-xs text-red-950 leading-relaxed">
              {data.do_nothing_forecast.stay_silent}
            </p>
          </div>
        </section>
      )}
    </div>
  );
};
