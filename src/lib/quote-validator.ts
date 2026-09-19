export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^\w\s]/g, "")
    .trim();
}

export function isQuoteVerifiable(quote: string, sourceText: string): boolean {
  if (!quote || quote.trim().length === 0) return false;
  if (!sourceText || sourceText.trim().length === 0) return false;

  const normalizedQuote = normalizeText(quote);
  const normalizedSource = normalizeText(sourceText);

  // Exact substring check
  if (normalizedSource.includes(normalizedQuote)) {
    return true;
  }

  // Sliding window fuzzy check for OCR / punctuation differences (>=80% tokens matched in sequence)
  const quoteTokens = normalizedQuote.split(" ");
  if (quoteTokens.length <= 4) {
    return normalizedSource.includes(normalizedQuote);
  }

  // Check if at least 80% contiguous slice is present
  const sliceLen = Math.floor(quoteTokens.length * 0.8);
  for (let i = 0; i <= quoteTokens.length - sliceLen; i++) {
    const subSlice = quoteTokens.slice(i, i + sliceLen).join(" ");
    if (normalizedSource.includes(subSlice)) {
      return true;
    }
  }

  return false;
}
