import { NextRequest, NextResponse } from "next/server";

/* ─── Rate Limiter (in-memory, per-IP) ─── */
const WINDOW_MS = 60_000;
const MAX_REQ = 120; // 120 req/min per IP
const ADMIN_MAX = 30;
const API_MAX = 60;

interface Bucket {
  count: number;
  reset: number;
}

const buckets = new Map<string, Bucket>();

function cleanBuckets() {
  const now = Date.now();
  for (const [k, v] of buckets) {
    if (now > v.reset) buckets.delete(k);
  }
}

setInterval(cleanBuckets, 30_000);

function rateLimit(ip: string, limit: number): { ok: boolean; remaining: number } {
  const now = Date.now();
  const bucket = buckets.get(ip);
  if (!bucket || now > bucket.reset) {
    buckets.set(ip, { count: 1, reset: now + WINDOW_MS });
    return { ok: true, remaining: limit - 1 };
  }
  bucket.count++;
  if (bucket.count > limit) {
    return { ok: false, remaining: 0 };
  }
  return { ok: true, remaining: limit - bucket.count };
}

/* ─── Bot / Suspicious UA detection ─── */
const BLOCKED_UA = /curl|wget|python-requests|scrapy|httpclient|go-http|java\//i;

/* ─── Path-based fingerprint flood detection ─── */
const floodMap = new Map<string, number[]>();

function isFlood(ip: string): boolean {
  const now = Date.now();
  const times = floodMap.get(ip) || [];
  const recent = times.filter((t) => now - t < 1000);
  recent.push(now);
  floodMap.set(ip, recent.slice(-50));
  return recent.length > 20; // 20 req/sec = likely DDoS
}

export function middleware(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const ua = req.headers.get("user-agent") || "";
  const path = req.nextUrl.pathname;

  /* Block known bad UAs (except health check) */
  if (path !== "/api/health" && BLOCKED_UA.test(ua)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  /* DDoS flood detection */
  if (isFlood(ip)) {
    return new NextResponse("Too Many Requests", {
      status: 429,
      headers: { "Retry-After": "30" },
    });
  }

  /* Route-specific rate limits */
  let limit = MAX_REQ;
  if (path.startsWith("/admin")) limit = ADMIN_MAX;
  else if (path.startsWith("/api")) limit = API_MAX;

  const { ok, remaining } = rateLimit(`${ip}:${path.split("/")[1]}`, limit);
  if (!ok) {
    return new NextResponse("Too Many Requests", {
      status: 429,
      headers: {
        "Retry-After": "60",
        "X-RateLimit-Remaining": "0",
      },
    });
  }

  const res = NextResponse.next();
  res.headers.set("X-RateLimit-Remaining", String(remaining));

  /* CSRF-style origin check for mutating API calls */
  if (
    path.startsWith("/api") &&
    ["POST", "PUT", "DELETE", "PATCH"].includes(req.method)
  ) {
    const origin = req.headers.get("origin");
    const host = req.headers.get("host");
    if (origin && host && !origin.includes(host)) {
      return new NextResponse("Forbidden – CSRF", { status: 403 });
    }
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
