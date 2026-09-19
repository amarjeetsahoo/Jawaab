import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jawaab — The Legal Notice Decoder",
  description: "Cross-examine threatening legal notices against your own contracts with verified Indian statutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased selection:bg-amber-100 selection:text-amber-900">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-stone-900 focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-semibold"
        >
          Skip to main content
        </a>

        <header role="banner" className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-sm px-6 py-3.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <a href="/" aria-label="Jawaab Legal Notice Cross-Examiner Home" className="flex items-center space-x-2.5">
                <div aria-hidden="true" className="w-8 h-8 rounded bg-[var(--foreground)] text-[var(--background)] flex items-center justify-center font-bold text-lg font-serif">
                  J
                </div>
                <div className="flex flex-col">
                  <span className="font-bold tracking-tight text-base leading-none">
                    Jawaab <span className="text-xs font-normal text-[var(--muted-foreground)] ml-1">जवाब</span>
                  </span>
                  <span className="text-[11px] text-[var(--muted-foreground)] font-medium">
                    The Legal Notice Cross-Examiner
                  </span>
                </div>
              </a>
            </div>

            <nav aria-label="Main Navigation" className="flex items-center space-x-3">
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-900 border border-emerald-300">
                <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-emerald-600 mr-1.5 animate-pulse"></span>
                Statute Pack v1.0 Active (Verified)
              </span>
              <a
                href="#how-it-works"
                aria-label="View legal verification methodology"
                className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors px-2 py-1 focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
              >
                Methodology
              </a>
              <a
                href="https://nalsa.gov.in"
                target="_blank"
                rel="noreferrer"
                aria-label="National Legal Services Authority Helpline: 15100 (opens in new tab)"
                className="text-xs font-medium text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-300 rounded px-2.5 py-1 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                NALSA Helpline: 15100
              </a>
            </nav>
          </div>
        </header>

        <main id="main-content" role="main" tabIndex={-1} className="max-w-7xl mx-auto px-4 sm:px-6 py-6 min-h-[calc(100vh-65px)] flex flex-col focus:outline-none">
          {children}
        </main>

        <footer role="contentinfo" className="border-t border-[var(--border)] bg-[var(--background)] py-6 text-center text-xs text-[var(--muted-foreground)]">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>
              <strong>Disclaimer:</strong> Jawaab provides automated legal information, document cross-examination, and audit preparation. It is not a substitute for formal legal counsel from an enrolled advocate.
            </p>
            <p className="text-[11px] text-stone-600 font-medium">
              Built for Google AI Hackathon · 2 Calls, Zero RAG
            </p>
          </div>
        </footer>
        <SpeedInsights />
      </body>
    </html>
  );
}
