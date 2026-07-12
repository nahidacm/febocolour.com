import "server-only";
import { headers } from "next/headers";

// In-process fixed-window limiter — fine for v1's single-Node-process deployment.
// Move to Redis (or similar shared store) if the app ever runs as multiple instances,
// since these counters wouldn't be shared across processes.
type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}, CLEANUP_INTERVAL_MS).unref();

export type RateLimitResult = { allowed: boolean; retryAfterSeconds?: number };

export function checkRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }
  if (bucket.count >= limit) {
    return { allowed: false, retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  bucket.count += 1;
  return { allowed: true };
}

export async function getClientIp(): Promise<string> {
  const headerList = await headers();
  return headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}
