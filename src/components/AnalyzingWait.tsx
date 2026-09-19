"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, CircleDashed, ShieldCheck } from "lucide-react";

interface AnalyzingWaitProps {
  onComplete: () => void;
}

const STAGES = [
  { id: 1, text: "Ingesting document tokens & legal notice structure...", duration: 800 },
  { id: 2, text: "Extracting advocate demands, penal interest, and arrest threats...", duration: 900 },
  { id: 3, text: "Cross-referencing sanction clauses against verified Statute Pack...", duration: 1000 },
  { id: 4, text: "Calculating statutory response limitation and calendar countdown...", duration: 700 },
];

export const AnalyzingWait: React.FC<AnalyzingWaitProps> = ({ onComplete }) => {
  const [currentStage, setCurrentStage] = useState(1);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (currentStage <= STAGES.length) {
      timeout = setTimeout(() => {
        if (currentStage < STAGES.length) {
          setCurrentStage((prev) => prev + 1);
        } else {
          onComplete();
        }
      }, STAGES[currentStage - 1].duration);
    }
    return () => clearTimeout(timeout);
  }, [currentStage, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-lg mx-auto text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-6 text-amber-800 shadow-sm animate-pulse">
        <ShieldCheck className="w-8 h-8 text-amber-700" />
      </div>

      <h2 className="text-2xl font-bold font-serif-legal text-[var(--foreground)] tracking-tight mb-2">
        Cross-Examining Documents
      </h2>
      <p className="text-xs text-[var(--muted-foreground)] mb-8">
        Running single-call zero-RAG audit against 15 verified Indian statutes
      </p>

      {/* Progress Timeline */}
      <div className="w-full space-y-3.5 text-left border border-[var(--border)] bg-[var(--card)] rounded-xl p-5 shadow-xs">
        {STAGES.map((stage) => {
          const isDone = currentStage > stage.id;
          const isCurrent = currentStage === stage.id;

          return (
            <div
              key={stage.id}
              className={`flex items-start gap-3 transition-opacity duration-300 ${
                isCurrent || isDone ? "opacity-100" : "opacity-35"
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              ) : isCurrent ? (
                <CircleDashed className="w-4 h-4 text-amber-600 animate-spin mt-0.5 shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-gray-300 mt-0.5 shrink-0" />
              )}
              <div className="flex-1">
                <span
                  className={`text-xs font-medium ${
                    isCurrent
                      ? "text-[var(--foreground)] font-semibold"
                      : isDone
                      ? "text-gray-700"
                      : "text-[var(--muted-foreground)]"
                  }`}
                >
                  {stage.text}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-[11px] text-[var(--muted-foreground)]">
        Gemini 3.8 Flash Context: 1,048,576 tokens · Zero Vector DB latency
      </div>
    </div>
  );
};
