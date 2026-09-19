import { normalizeText, isQuoteVerifiable } from "@/lib/quote-validator";

describe("normalizeText", () => {
  it("lowercases the string", () => {
    expect(normalizeText("Hello World")).toBe("hello world");
  });

  it("collapses multiple whitespace into single space", () => {
    expect(normalizeText("foo   bar\t\nbaz")).toBe("foo bar baz");
  });

  it("strips punctuation", () => {
    expect(normalizeText("Hello, World! It's fine.")).toBe("hello world its fine");
  });

  it("trims leading and trailing space", () => {
    expect(normalizeText("  hello  ")).toBe("hello");
  });

  it("handles empty string", () => {
    expect(normalizeText("")).toBe("");
  });
});

describe("isQuoteVerifiable", () => {
  const SOURCE =
    "The borrower shall repay the principal amount of ten lakh rupees within thirty days of the date of this notice as per the terms agreed.";

  describe("exact match", () => {
    it("returns true for exact substring", () => {
      expect(isQuoteVerifiable("ten lakh rupees", SOURCE)).toBe(true);
    });

    it("returns true for full sentence match", () => {
      expect(
        isQuoteVerifiable(
          "The borrower shall repay the principal amount of ten lakh rupees",
          SOURCE
        )
      ).toBe(true);
    });

    it("is case-insensitive", () => {
      expect(isQuoteVerifiable("TEN LAKH RUPEES", SOURCE)).toBe(true);
    });
  });

  describe("fuzzy match (>=80% contiguous tokens)", () => {
    it("returns true when >= 80% tokens of a long quote match contiguously", () => {
      // 5-word quote where 4/5 match = 80%
      const longQuote =
        "The borrower shall repay the principal amount XXXNOTINTEXT";
      // 9 tokens, 80% = 7 tokens needed; first 8 tokens match
      const preciseQuote =
        "The borrower shall repay the principal amount of ten lakh rupees within thirty days XXXFAKE";
      expect(isQuoteVerifiable(preciseQuote, SOURCE)).toBe(true);
    });

    it("returns false when quote tokens are nowhere in source", () => {
      expect(
        isQuoteVerifiable(
          "completely unrelated legal jargon not present anywhere in the source document at all",
          SOURCE
        )
      ).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("returns false for empty quote", () => {
      expect(isQuoteVerifiable("", SOURCE)).toBe(false);
    });

    it("returns false for whitespace-only quote", () => {
      expect(isQuoteVerifiable("   ", SOURCE)).toBe(false);
    });

    it("returns false for empty source", () => {
      expect(isQuoteVerifiable("borrower", "")).toBe(false);
    });

    it("returns false when both are empty", () => {
      expect(isQuoteVerifiable("", "")).toBe(false);
    });

    it("handles short quote (<=4 tokens) with exact check", () => {
      // Short quotes fall through to exact check only
      expect(isQuoteVerifiable("ten lakh", SOURCE)).toBe(true);
    });
  });
});
