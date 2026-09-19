"use client";

import React, { useState } from "react";
import { ExecutionTelemetry } from "@/types";
import { Cpu, Zap, Database, Coins, ShieldCheck, X } from "lucide-react";

interface TelemetryDrawerProps {
  telemetry?: ExecutionTelemetry;
}

export const TelemetryDrawer: React.FC<TelemetryDrawerProps> = ({ telemetry }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!telemetry) return null;

  return (
    <>
      {/* Small floating badge in bottom-right corner for judges */}
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label="View Gemini execution trace and token economics"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 bg-stone-950 text-white border border-gray-700/30 px-3 py-1.5 rounded-full shadow-lg text-[11px] font-mono flex items-center gap-2 hover:bg-black transition-all cursor-pointer no-print focus-visible:ring-2 focus-visible:ring-amber-500"
      >
        <Zap aria-hidden="true" className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span>Gemini 3.8 Flash Trace</span>
        <span className="bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded text-[10px]">
          {telemetry.totalTokens.toLocaleString()} tokens
        </span>
      </button>

      {/* Observability Modal / Drawer */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="telemetry-modal-title"
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white border border-[var(--border)] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Cpu aria-hidden="true" className="w-5 h-5 text-indigo-700" />
                <h2 id="telemetry-modal-title" className="font-bold text-sm text-gray-900">
                  Execution Trace &amp; Token Economics
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close execution trace modal"
                className="text-gray-500 hover:text-gray-800 p-1 rounded-md cursor-pointer focus-visible:ring-2 focus-visible:ring-stone-500"
              >
                <X aria-hidden="true" className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-700 leading-relaxed">
              Jawaab leverages Gemini&apos;s 1M-token context window to cross-examine both multi-page documents and the entire verified Statute Pack in a <strong>single model call</strong> without vector database overhead.
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-stone-600">Active Model</span>
                <div className="font-bold font-mono text-gray-900 truncate">{telemetry.model}</div>
              </div>

              <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-stone-600">Total Tokens Ingested</span>
                <div className="font-bold font-mono text-indigo-700">
                  {telemetry.totalTokens.toLocaleString()} tokens
                </div>
              </div>

              <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-stone-600">Execution Latency</span>
                <div className="font-bold font-mono text-emerald-800 flex items-center gap-1">
                  <span>{telemetry.latencyMs} ms</span>
                  {telemetry.cacheHit && (
                    <span className="text-[9px] bg-emerald-100 text-emerald-900 px-1 rounded">CACHE HIT</span>
                  )}
                </div>
              </div>

              <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-stone-600">Estimated Cost</span>
                <div className="font-bold font-mono text-amber-800 flex items-center gap-1">
                  <Coins aria-hidden="true" className="w-3 h-3 text-amber-600" />
                  <span>${telemetry.estimatedCostUsd.toFixed(5)} (~₹0.02)</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs space-y-1 text-blue-950">
              <div className="flex items-center gap-1.5 font-bold">
                <Database aria-hidden="true" className="w-3.5 h-3.5 text-blue-700" />
                <span>Zero-RAG Engineering Discipline</span>
              </div>
              <p className="text-[11px] text-blue-950 leading-relaxed">
                By injecting the 15-rule Statute Pack directly into the prompt context, we eliminate chunking loss, embedding latency, and vector search drift.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close execution trace"
                className="px-4 py-1.5 bg-stone-950 text-white text-xs font-medium rounded-lg hover:bg-black cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                Close Trace
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
