"use client";

import React from "react";
import { ShieldAlert, PhoneCall, ExternalLink, ArrowLeft } from "lucide-react";

interface RefusalModalProps {
  refusalData: {
    refusal_reason: string;
    helpline_routing: Array<{
      name: string;
      number: string;
      description: string;
      link: string;
    }>;
  };
  onBack: () => void;
}

export const RefusalModal: React.FC<RefusalModalProps> = ({
  refusalData,
  onBack,
}) => {
  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="refusal-title"
      className="max-w-2xl mx-auto my-6 bg-white border border-purple-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6"
    >
      <div className="flex items-center gap-3 text-purple-900 border-b border-purple-100 pb-4">
        <div aria-hidden="true" className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 shrink-0">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-800">
            Responsible AI Safety Boundary Triggered
          </span>
          <h1 id="refusal-title" className="text-xl font-bold font-serif-legal text-gray-950">
            Matter Excluded from Automated Processing
          </h1>
        </div>
      </div>

      <div className="bg-purple-50/70 rounded-xl p-4 text-xs text-purple-950 leading-relaxed border border-purple-200">
        <strong>Safety Rationale:</strong> {refusalData.refusal_reason}
      </div>

      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-stone-800">
          Immediate Emergency &amp; Legal Aid Resources
        </h2>

        <div className="grid grid-cols-1 gap-3">
          {refusalData.helpline_routing.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-gray-200 hover:border-purple-300 transition-colors bg-gray-50/50 flex items-start justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-gray-900">{item.name}</h3>
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-100 text-purple-900">
                    Dial: {item.number}
                  </span>
                </div>
                <p className="text-xs text-stone-700">{item.description}</p>
              </div>

              <a
                href={item.link}
                target="_blank"
                rel="noreferrer"
                aria-label={`Connect with ${item.name} at ${item.number} (opens in new tab)`}
                className="shrink-0 p-2 rounded-lg bg-white border border-gray-200 hover:bg-purple-50 text-purple-800 transition-colors flex items-center gap-1 text-xs font-medium focus-visible:ring-2 focus-visible:ring-purple-500"
              >
                <PhoneCall aria-hidden="true" className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Connect</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          aria-label="Return to safe preloaded cases"
          className="text-xs px-4 py-2 rounded-lg border border-gray-300 text-stone-800 hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-500"
        >
          <ArrowLeft aria-hidden="true" className="w-3.5 h-3.5" /> Return to Safe Cases
        </button>
        <span className="text-[11px] text-stone-600">
          Section 12 Legal Services Authorities Act, 1987
        </span>
      </div>
    </div>
  );
};
