// Sliding Window In-Memory Rate Limiter for AI Endpoints
// Adheres to /backend-security-coder and /ai-agents-architect principles:
// 1. IP-based throttling (10 requests/minute per client)
// 2. Global rate cap (protects 500 RPD daily quota)
// 3. Graceful degradation headers (X-RateLimit-Remaining, Retry-After)

interface RateLimitRecord {
  timestamps: number[];
}

const ipRequestMap = new Map<string, RateLimitRecord>();
const WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 10; // Max 10 requests per client per minute
const GLOBAL_DAILY_CAP = 450; // Safety cap below 500 RPD ceiling

let globalDailyCounter = 0;
let lastResetDate = new Date().toDateString();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds?: number;
  reason?: string;
}

export function checkRateLimit(clientIp: string): RateLimitResult {
  const now = Date.now();
  const currentDate = new Date().toDateString();

  // Reset global daily counter at midnight
  if (currentDate !== lastResetDate) {
    globalDailyCounter = 0;
    lastResetDate = currentDate;
  }

  // 1. Global Daily Circuit Breaker (Denial-of-Wallet & Quota Protection)
  if (globalDailyCounter >= GLOBAL_DAILY_CAP) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: 3600,
      reason: "Global daily AI analysis quota reached. Protected by Jawaab circuit breaker.",
    };
  }

  // 2. Client IP Sliding Window Limiter
  let record = ipRequestMap.get(clientIp);
  if (!record) {
    record = { timestamps: [] };
    ipRequestMap.set(clientIp, record);
  }

  // Prune timestamps older than window
  record.timestamps = record.timestamps.filter((ts) => now - ts < WINDOW_MS);

  if (record.timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    const oldestTimestamp = record.timestamps[0];
    const retryAfterSeconds = Math.ceil((oldestTimestamp + WINDOW_MS - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, retryAfterSeconds),
      reason: `Client rate limit exceeded. Max ${MAX_REQUESTS_PER_WINDOW} requests/minute.`,
    };
  }

  // Allow request and record timestamp
  record.timestamps.push(now);
  globalDailyCounter++;

  // Clean up inactive IPs periodically
  if (ipRequestMap.size > 5000) {
    for (const [ip, r] of ipRequestMap.entries()) {
      if (r.timestamps.length === 0 || now - r.timestamps[r.timestamps.length - 1] > WINDOW_MS * 5) {
        ipRequestMap.delete(ip);
      }
    }
  }

  return {
    allowed: true,
    remaining: MAX_REQUESTS_PER_WINDOW - record.timestamps.length,
  };
}
