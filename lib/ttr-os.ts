/**
 * TTR OS lead capture: builds the form-encoded body for
 * POST https://portal.ttrdigitalmarketing.com/api/site/form (answers 204).
 * Pure (no server-only import) so it can be unit tested with node:test.
 */
export const TTR_OS_FORM_URL = "https://portal.ttrdigitalmarketing.com/api/site/form";
// Public site key: it already ships to every visitor in the TTR OS tracker tag.
export const TTR_OS_PUBLIC_SITE_KEY = "Sb6ar7iYfoIg6TakR5qtbA";

export const TTR_OS_FIELDS = ["first_name", "last_name", "name", "phone", "email", "service", "preferred_time", "message", "consent"] as const;

export type TtrOsInput = {
  siteKey?: string;
  form: string;
  /** Full URL (or path) of the page the form was submitted on. */
  page: string;
  referrer?: string;
  /** Landing page URL with its utm query, if known. */
  landing?: string;
  /** Raw form values keyed by input name (first_name, phone, ...). */
  values: Record<string, string | undefined>;
};

function pathOf(page: string) {
  if (!page) return "/";
  try {
    const u = new URL(page, "https://x.invalid");
    return u.pathname || "/";
  } catch {
    return page;
  }
}

export function ttrOsBody(input: TtrOsInput): URLSearchParams {
  const v = input.values;
  const s = (x?: string) => (x == null ? "" : String(x).trim());
  const body = new URLSearchParams();
  body.set("k", s(input.siteKey) || TTR_OS_PUBLIC_SITE_KEY);
  body.set("p", pathOf(s(input.page)));
  if (s(input.referrer)) body.set("r", s(input.referrer));
  if (s(input.landing)) body.set("u", s(input.landing));
  for (const name of TTR_OS_FIELDS) {
    let val = s(v[name]);
    if (name === "name" && !val) val = [s(v.first_name), s(v.last_name)].filter(Boolean).join(" ");
    if (name === "consent" && val) val = "yes";
    if (val) body.set(`f_${name}`, val);
  }
  body.set("f_form", s(input.form));
  return body;
}
