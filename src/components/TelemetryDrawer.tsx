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
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 bg-[var(--foreground)] text-[var(--background)] border border-gray-700/30 px-3 py-1.5 rounded-full shadow-lg text-[11px] font-mono flex items-center gap-2 hover:bg-black transition-all cursor-pointer no-print"
      >
        <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span>Gemini 3.8 Flash Trace</span>
        <span className="bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded text-[10px]">
          {telemetry.totalTokens.toLocaleString()} tokens
        </span>
      </button>

      {/* Observability Modal / Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[var(--border)] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-sm text-gray-900">Execution Trace & Token Economics</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1 rounded-md cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Jawaab leverages Gemini&apos;s 1M-token context window to cross-examine both multi-page documents and the entire verified Statute Pack in a <strong>single model call</strong> without vector database overhead.
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-gray-500">Active Model</span>
                <div className="font-bold font-mono text-gray-900 truncate">{telemetry.model}</div>
              </div>

              <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-gray-500">Total Tokens Ingested</span>
                <div className="font-bold font-mono text-indigo-700">
                  {telemetry.totalTokens.toLocaleString()} tokens
                </div>
              </div>

              <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-gray-500">Execution Latency</span>
                <div className="font-bold font-mono text-emerald-700 flex items-center gap-1">
                  <span>{telemetry.latencyMs} ms</span>
                  {telemetry.cacheHit && (
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 rounded">CACHE HIT</span>
                  )}
                </div>
              </div>

              <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-gray-500">Estimated Cost</span>
                <div className="font-bold font-mono text-amber-700 flex items-center gap-1">
                  <Coins className="w-3 h-3 text-amber-500" />
                  <span>${telemetry.estimatedCostUsd.toFixed(5)} (~₹0.02)</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs space-y-1 text-blue-950">
              <div className="flex items-center gap-1.5 font-bold">
                <Database className="w-3.5 h-3.5 text-blue-700" />
                <span>Zero-RAG Engineering Discipline</span>
              </div>
              <p className="text-[11px] text-blue-900 leading-relaxed">
                By injecting the 15-rule Statute Pack directly into the prompt context, we eliminate chunking loss, embedding latency, and vector search drift.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 bg-[var(--foreground)] text-[var(--background)] text-xs font-medium rounded-lg hover:bg-black cursor-pointer"
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
