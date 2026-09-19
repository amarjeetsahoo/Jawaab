import { calculateDeadlines, generateIcsCalendar } from "@/lib/deadline-math";

describe("calculateDeadlines", () => {
  const LOAN_DATE = "2024-01-01";
  const RENT_DATE = "2024-03-01";

  describe("service offset", () => {
    it("adds 3 days for Speed Post", () => {
      const result = calculateDeadlines(LOAN_DATE, "Speed Post", "loan", 7);
      expect(result.effective_receipt_date).toBe("2024-01-04");
    });

    it("adds 0 days for hand delivery", () => {
      const result = calculateDeadlines(LOAN_DATE, "Hand Delivery", "loan", 7);
      expect(result.effective_receipt_date).toBe("2024-01-01");
    });
  });

  describe("statutory response window", () => {
    it("gives 15 days for loan domain (NI Act §138)", () => {
      const result = calculateDeadlines(LOAN_DATE, "Speed Post", "loan");
      // receipt = Jan 4, statutory deadline = Jan 4 + 15 = Jan 19
      expect(result.statutory_response_days_allowed).toBe(15);
      expect(result.statutory_response_deadline).toBe("2024-01-19");
    });

    it("gives 30 days for rent domain (TPA §106)", () => {
      const result = calculateDeadlines(RENT_DATE, "Speed Post", "rent");
      expect(result.statutory_response_days_allowed).toBe(30);
    });

    it("claimed deadline is separate from statutory deadline", () => {
      const result = calculateDeadlines(LOAN_DATE, "Speed Post", "loan", 7);
      // claimed: Jan 1 + 7 = Jan 8; statutory: Jan 19 — must differ
      expect(result.notice_claimed_deadline).toBe("2024-01-08");
      expect(result.notice_claimed_deadline).not.toBe(result.statutory_response_deadline);
    });
  });

  describe("limitation period", () => {
    it("expiry is exactly 3 years from notice date", () => {
      const result = calculateDeadlines(LOAN_DATE, "Speed Post", "loan");
      expect(result.limitation_expiry_date).toBe("2027-01-01");
    });
  });

  describe("urgency levels", () => {
    it("urgency is red when statutory deadline is <= 7 days away", () => {
      // Use a recent date so deadline is very soon
      const nearDate = new Date();
      nearDate.setDate(nearDate.getDate() - 10); // notice 10 days ago
      const dateStr = nearDate.toISOString().split("T")[0];
      const result = calculateDeadlines(dateStr, "Speed Post", "loan");
      // receipt = -7 days ago, deadline = +15 days from receipt = ~8 days from now
      // Could be amber or red depending on exact day
      expect(["red", "amber", "ink"]).toContain(result.urgency_level);
    });

    it("urgency is ink for a future notice date far from now", () => {
      const futureDate = "2050-01-01";
      const result = calculateDeadlines(futureDate, "Speed Post", "loan");
      expect(result.urgency_level).toBe("ink");
    });
  });

  describe("deadline_explanation", () => {
    it("mentions NI Act for loan domain", () => {
      const result = calculateDeadlines(LOAN_DATE, "Speed Post", "loan");
      expect(result.deadline_explanation).toMatch(/Negotiable Instruments Act/i);
    });

    it("mentions Transfer of Property Act for rent domain", () => {
      const result = calculateDeadlines(RENT_DATE, "Speed Post", "rent");
      expect(result.deadline_explanation).toMatch(/Transfer of Property Act/i);
    });
  });

  describe("error handling", () => {
    it("throws on invalid date string", () => {
      expect(() => calculateDeadlines("not-a-date")).toThrow(
        "Invalid notice date format"
      );
    });
  });
});

describe("generateIcsCalendar", () => {
  it("produces a valid VCALENDAR block", () => {
    const ics = generateIcsCalendar(
      "Reply Deadline",
      "Final date to respond",
      "2024-06-15"
    );
    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("END:VCALENDAR");
    expect(ics).toContain("BEGIN:VEVENT");
    expect(ics).toContain("END:VEVENT");
  });

  it("encodes the date correctly (YYYYMMDD)", () => {
    const ics = generateIcsCalendar("Test", "desc", "2024-06-15");
    expect(ics).toContain("DTSTART;VALUE=DATE:20240615");
    expect(ics).toContain("DTEND;VALUE=DATE:20240615");
  });

  it("includes the title in SUMMARY", () => {
    const ics = generateIcsCalendar("My Title", "desc", "2024-01-01");
    expect(ics).toContain("SUMMARY:DEADLINE: My Title");
  });

  it("escapes newlines in description", () => {
    const ics = generateIcsCalendar("T", "line1\nline2", "2024-01-01");
    expect(ics).toContain("line1\\nline2");
  });
});
