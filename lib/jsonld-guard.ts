/**
 * TTR rule: no Review, Rating or AggregateRating structured data on any client
 * site. Visible stars and testimonials on the page are fine; only the JSON-LD
 * is affected. Every JSON-LD block goes through stripRatings (lib/seo.tsx,
 * JsonLd), so a node added later, or text from the CMS, cannot put them back.
 */
const BANNED_TYPES = new Set(["Review", "Rating", "AggregateRating", "EmployerAggregateRating", "CriticReview", "UserReview", "EmployerReview"]);
const BANNED_KEYS = new Set(["aggregateRating", "review", "reviews", "reviewRating", "contentRating", "starRating"]);

function isBannedNode(v: unknown): boolean {
  if (!v || typeof v !== "object" || Array.isArray(v)) return false;
  const t = (v as Record<string, unknown>)["@type"];
  const types = Array.isArray(t) ? t : [t];
  return types.some((x) => typeof x === "string" && BANNED_TYPES.has(x.replace(/^https?:\/\/schema\.org\//, "")));
}

export function stripRatings<T>(data: T): T {
  if (Array.isArray(data)) return data.filter((v) => !isBannedNode(v)).map(stripRatings) as T;
  if (data && typeof data === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(data as Record<string, unknown>)) {
      if (BANNED_KEYS.has(k) || isBannedNode(v)) continue;
      out[k] = stripRatings(v);
    }
    return out as T;
  }
  return data;
}
