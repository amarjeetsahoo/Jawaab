"use client";

import React, { useEffect, useRef } from "react";
import { VerdictType } from "@/types";

interface DocumentViewerProps {
  title: string;
  documentType: "notice" | "agreement";
  content: string;
  highlightedText?: string | null;
  verdict?: VerdictType;
  clauseId?: string | null;
  onTargetElementRef?: (el: HTMLElement | null) => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  title,
  documentType,
  content,
  highlightedText,
  verdict = "valid",
  clauseId,
  onTargetElementRef,
}) => {
  const highlightRef = useRef<HTMLSpanElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll highlighted section into view when active
  useEffect(() => {
    if (highlightRef.current && containerRef.current) {
      highlightRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      if (onTargetElementRef) {
        onTargetElementRef(highlightRef.current);
      }
    } else if (onTargetElementRef) {
      onTargetElementRef(null);
    }
  }, [highlightedText, onTargetElementRef]);

  // Determine highlight styling based on verdict
  const getHighlightClass = () => {
    switch (verdict) {
      case "unenforceable":
        return "bg-red-100 text-red-950 border-l-4 border-red-500 font-semibold px-1 py-0.5 rounded-r";
      case "unsupported":
        return "bg-orange-100 text-orange-950 border-l-4 border-orange-500 font-semibold px-1 py-0.5 rounded-r";
      case "overstated":
        return "bg-amber-100 text-amber-950 border-l-4 border-amber-500 font-semibold px-1 py-0.5 rounded-r";
      case "valid":
      default:
        return "bg-emerald-100 text-emerald-950 border-l-4 border-emerald-500 font-semibold px-1 py-0.5 rounded-r";
    }
  };

  // Helper to split document text and wrap the matching sentence in a highlight span
  const renderHighlightedContent = () => {
    if (!highlightedText || !content.includes(highlightedText)) {
      return (
        <div className="whitespace-pre-wrap font-serif-legal text-xs leading-relaxed text-gray-800">
          {content}
        </div>
      );
    }

    const parts = content.split(highlightedText);
    return (
      <div className="whitespace-pre-wrap font-serif-legal text-xs leading-relaxed text-gray-800">
        {parts[0]}
        <span
          ref={highlightRef}
          id={clauseId || `highlight-${documentType}`}
          className={`transition-all duration-300 ${getHighlightClass()} shadow-xs`}
        >
          {highlightedText}
        </span>
        {parts.slice(1).join(highlightedText)}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden shadow-xs">
      {/* Header bar */}
      <div className="px-4 py-2.5 bg-gray-50 border-b border-[var(--border)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              documentType === "notice" ? "bg-red-500" : "bg-blue-500"
            }`}
          />
          <span className="text-xs font-bold font-mono tracking-tight text-gray-800 uppercase">
            {title}
          </span>
        </div>
        <span className="text-[10px] text-[var(--muted-foreground)] font-mono">
          Interactive Surface
        </span>
      </div>

      {/* Document Scroll Area */}
      <div
        ref={containerRef}
        className="p-5 overflow-y-auto max-h-[420px] bg-white text-justify select-text relative"
      >
        {renderHighlightedContent()}
      </div>
    </div>
  );
};
