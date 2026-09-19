import type { Metadata } from "next";
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600;700&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased selection:bg-amber-100 selection:text-amber-900">
        <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-sm px-6 py-3.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <a href="/" className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded bg-[var(--foreground)] text-[var(--background)] flex items-center justify-center font-bold text-lg font-serif">
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

            <div className="flex items-center space-x-3">
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                Statute Pack v1.0 Active (Verified)
              </span>
              <a
                href="#how-it-works"
                className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors px-2 py-1"
              >
                Methodology
              </a>
              <a
                href="https://nalsa.gov.in"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded px-2.5 py-1 transition-colors"
              >
                NALSA Helpline: 15100
              </a>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 min-h-[calc(100vh-65px)] flex flex-col">
          {children}
        </main>

        <footer className="border-t border-[var(--border)] bg-[var(--background)] py-6 text-center text-xs text-[var(--muted-foreground)]">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>
              <strong>Disclaimer:</strong> Jawaab provides automated legal information, document cross-examination, and audit preparation. It is not a substitute for formal legal counsel from an enrolled advocate.
            </p>
            <p className="text-[11px] text-gray-400">
              Built for Google AI Hackathon · 2 Calls, Zero RAG
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
