"use client";

import React, { useState } from "react";
import { IntakeScreen } from "@/components/IntakeScreen";
import { AnalyzingWait } from "@/components/AnalyzingWait";
import { FindingsScreen } from "@/components/FindingsScreen";
import { ActionSuite } from "@/components/ActionSuite";
import { RefusalModal } from "@/components/RefusalModal";
import { TelemetryDrawer } from "@/components/TelemetryDrawer";
import { AnalysisResult } from "@/types";

type ViewState = "intake" | "analyzing" | "findings" | "act" | "refusal";

export default function Home() {
  const [view, setView] = useState<ViewState>("intake");
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  const [refusalData, setRefusalData] = useState<any>(null);
  const [pendingCaseId, setPendingCaseId] = useState<string>("case_1_loan");

  const startAnalysis = async (payload: {
    case_id?: string;
    notice_text?: string;
    agreement_text?: string;
    jurisdiction?: string;
    language?: string;
  }) => {
    setView("analyzing");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (json.is_refusal) {
        setRefusalData(json);
        // Wait sequence will trigger transition to refusal
        setPendingCaseId("refusal");
      } else {
        setAnalysisData(json.data);
        setPendingCaseId("findings");
      }
    } catch (err) {
      console.error("Failed to run analysis:", err);
      alert("Failed to analyze documents. Falling back to default case.");
      setView("intake");
    }
  };

  const handleCaseSelect = (caseId: string) => {
    startAnalysis({ case_id: caseId });
  };

  const handleCustomSubmit = (
    notice: string,
    agreement: string,
    state: string,
    lang: string
  ) => {
    startAnalysis({
      notice_text: notice,
      agreement_text: agreement,
      jurisdiction: state,
      language: lang,
    });
  };

  return (
    <div className="w-full flex flex-col flex-1">
      {view === "intake" && (
        <IntakeScreen
          onSelectCase={handleCaseSelect}
          onCustomSubmit={handleCustomSubmit}
        />
      )}

      {view === "analyzing" && (
        <AnalyzingWait
          onComplete={() => {
            if (pendingCaseId === "refusal") {
              setView("refusal");
            } else {
              setView("findings");
            }
          }}
        />
      )}

      {view === "findings" && analysisData && (
        <FindingsScreen
          data={analysisData}
          onProceedToAct={() => setView("act")}
          onReset={() => setView("intake")}
        />
      )}

      {view === "act" && analysisData && (
        <ActionSuite
          data={analysisData}
          onBackToFindings={() => setView("findings")}
        />
      )}

      {view === "refusal" && refusalData && (
        <RefusalModal
          refusalData={refusalData}
          onBack={() => setView("intake")}
        />
      )}

      {analysisData?.telemetry && (
        <TelemetryDrawer telemetry={analysisData.telemetry} />
      )}
    </div>
  );
}
