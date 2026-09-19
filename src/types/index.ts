export type VerdictType = "valid" | "overstated" | "unsupported" | "unenforceable";

export interface StatuteRule {
  id: string;
  domain: string;
  claim_type: string;
  verdict: VerdictType;
  statute: string;
  section: string;
  authority: string;
  verified_by: string;
  verified_on: string;
  response_window_days: number | null;
  plain_language: string;
  remedy_action?: string;
  escalate_to_human: boolean;
}

export interface ClaimVerdict {
  id: string;
  claim_type: string;
  verdict: VerdictType;
  notice_quote: string;
  agreement_quote: string | null;
  agreement_clause: string | null;
  statute_pack_id: string;
  statute_citation: string;
  analysis: string;
  remedy: string;
}

export interface DeadlineAnalysis {
  effective_receipt_date: string;
  statutory_response_deadline: string;
  statutory_response_days_allowed: number;
  notice_claimed_deadline: string;
  urgency_level: "ink" | "amber" | "red";
  limitation_expiry_date: string;
  limitation_months_remaining: number;
  deadline_explanation: string;
}

export interface NoticeMetadata {
  sender: string;
  recipient: string;
  notice_date: string;
  mode_of_service: string;
  alleged_amount: number;
  claimed_deadline_days: number;
}

export interface LawyerHandoffPack {
  key_issues_framed: string[];
  questions_for_advocate: string[];
  free_legal_aid_eligibility: string;
}

export interface DoNothingForecast {
  reply_sent: string;
  stay_silent: string;
}

export interface ExecutionTelemetry {
  model: string;
  totalTokens: number;
  promptTokens: number;
  candidateTokens: number;
  latencyMs: number;
  estimatedCostUsd: number;
  cacheHit: boolean;
}

export interface AnalysisResult {
  case_id: string;
  document_hash: string;
  domain: string;
  notice_metadata: NoticeMetadata;
  deadline_analysis: DeadlineAnalysis;
  claims: ClaimVerdict[];
  do_nothing_forecast: DoNothingForecast;
  lawyer_handoff_pack: LawyerHandoffPack;
  telemetry?: ExecutionTelemetry;
  translations?: {
    hi?: {
      summary_headline: string;
      plain_summary: string;
      hero_deadline_text: string;
    };
  };
}
