import { DeadlineAnalysis } from "@/types";

export function calculateDeadlines(
  noticeDateStr: string,
  modeOfService: string = "Speed Post",
  domain: string = "loan",
  claimedDays: number = 7
): DeadlineAnalysis {
  const noticeDate = new Date(noticeDateStr);
  if (isNaN(noticeDate.getTime())) {
    throw new Error(`Invalid notice date format: ${noticeDateStr}`);
  }

  // Speed post presumption of service under Indian law: +3 days
  const serviceOffset = modeOfService.toLowerCase().includes("hand") ? 0 : 3;
  const receiptDate = new Date(noticeDate);
  receiptDate.setDate(receiptDate.getDate() + serviceOffset);

  // Statutory window calculation
  let statutoryDays = 15; // default NI Act / commercial notice window
  if (domain === "rent") {
    statutoryDays = 30; // Model Tenancy Act / TPA default
  }

  const statutoryDeadline = new Date(receiptDate);
  statutoryDeadline.setDate(statutoryDeadline.getDate() + statutoryDays);

  const claimedDeadline = new Date(noticeDate);
  claimedDeadline.setDate(claimedDeadline.getDate() + claimedDays);

  // Limitation period: 3 years for civil loan recovery under Limitation Act, 1963 (Schedule Article 19 & 55)
  const limitationExpiry = new Date(noticeDate);
  limitationExpiry.setFullYear(limitationExpiry.getFullYear() + 3);

  const now = new Date();
  const daysRemaining = Math.ceil(
    (statutoryDeadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  let urgency: "ink" | "amber" | "red" = "ink";
  if (daysRemaining <= 7) {
    urgency = "red";
  } else if (daysRemaining <= 30) {
    urgency = "amber";
  }

  const limitationMonths = Math.max(
    0,
    Math.round((limitationExpiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30.4))
  );

  const explanation =
    domain === "rent"
      ? `Under Section 106 of the Transfer of Property Act, 1882, residential tenancy termination requires a mandatory 30-day statutory notice. The landlord's ${claimedDays}-day demand cannot truncate statutory law.`
      : `Under Section 138(c) of the Negotiable Instruments Act, 1881, the recipient has a statutory window of 15 days from notice receipt to pay or reply. The advocate's demand of ${claimedDays} days has no force in criminal law.`;

  return {
    effective_receipt_date: receiptDate.toISOString().split("T")[0],
    statutory_response_deadline: statutoryDeadline.toISOString().split("T")[0],
    statutory_response_days_allowed: statutoryDays,
    notice_claimed_deadline: claimedDeadline.toISOString().split("T")[0],
    urgency_level: urgency,
    limitation_expiry_date: limitationExpiry.toISOString().split("T")[0],
    limitation_months_remaining: limitationMonths,
    deadline_explanation: explanation,
  };
}

export function generateIcsCalendar(
  title: string,
  description: string,
  deadlineDateStr: string
): string {
  const dateObj = new Date(deadlineDateStr);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  const dateStr = `${year}${month}${day}`;

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Jawaab//Legal Notice Deadline//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `SUMMARY:DEADLINE: ${title}`,
    `DESCRIPTION:${description.replace(/\n/g, "\\n")}`,
    `DTSTART;VALUE=DATE:${dateStr}`,
    `DTEND;VALUE=DATE:${dateStr}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
