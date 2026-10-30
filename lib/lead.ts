import "server-only";

/**
 * Delivers a website form submission to GoHighLevel (GHL_WEBHOOK_URL, flat
 * JSON) and optionally by email (RESEND_API_KEY + LEAD_EMAIL_TO). Nothing is
 * built into the repo: without GHL_WEBHOOK_URL the lead is logged with a
 * clear warning so it is never lost silently.
 */
export type Lead = {
  form: string;
  page: string;
  fields: Record<string, string>; // label -> value, in form order
  utm: Record<string, string>;
  submittedAt: string;
  ip?: string;
  userAgent?: string;
};

const clean = (v?: string) => v?.trim().replace(/^["']|["']$/g, "").trim() || "";

export function phoneE164(raw = "") {
  const d = raw.replace(/\D/g, "");
  if (d.length === 10) return `+1${d}`;
  if (d.length === 11 && d.startsWith("1")) return `+${d}`;
  return raw.trim();
}

async function post(url: string, init: RequestInit) {
  let last: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, { ...init, signal: AbortSignal.timeout(8000), cache: "no-store" });
      if (res.ok) return;
      last = new Error(`${new URL(url).host} answered ${res.status}: ${(await res.text().catch(() => "")).slice(0, 200)}`);
      if (res.status !== 429 && res.status < 500) break;
    } catch (err) {
      last = err;
    }
    await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
  }
  throw last;
}

function pick(fields: Record<string, string>, re: RegExp, not?: RegExp) {
  const key = Object.keys(fields).find((k) => re.test(k) && !not?.test(k));
  return key ? fields[key] : "";
}

/** Builds the webhook payload (exported so tests and the README can show it). */
export function payloadFor(lead: Lead) {
  const f = lead.fields;
  const first = pick(f, /first/i);
  const last = pick(f, /last/i);
  const fullName = pick(f, /^(full )?name$/i) || [first, last].filter(Boolean).join(" ");
  const [fallbackFirst, ...fallbackRest] = fullName.trim().split(/\s+/);
  const phone = pick(f, /phone/i);
  return {
    source: "Website form",
    form: lead.form,
    tags: ["website-lead", lead.form.toLowerCase().replace(/\s+/g, "-")],
    submitted_at: lead.submittedAt,
    name: fullName,
    first_name: first || fallbackFirst || "",
    last_name: last || fallbackRest.join(" "),
    email: pick(f, /e-?mail/i),
    phone: phoneE164(phone),
    phone_raw: phone,
    service: pick(f, /service|treatment|interest/i),
    preferred_time: pick(f, /time|when|preferred/i, /service/i),
    message: pick(f, /message|comments|notes|question/i),
    comments: pick(f, /message|comments|notes|question/i),
    consent: pick(f, /consent|agree/i),
    page_url: lead.page,
    ...Object.fromEntries(Object.entries(lead.utm).map(([k, v]) => [k.toLowerCase(), v])),
    fields: f,
  };
}

export async function deliverLead(lead: Lead): Promise<{ delivered: boolean; configured: boolean }> {
  const tasks: Promise<void>[] = [];
  const webhook = clean(process.env.GHL_WEBHOOK_URL);
  const payload = payloadFor(lead);

  if (/^https?:\/\//.test(webhook)) {
    tasks.push(post(webhook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }));
  }

  const resendKey = clean(process.env.RESEND_API_KEY);
  const to = clean(process.env.LEAD_EMAIL_TO);
  if (resendKey && to) {
    const rows = Object.entries(lead.fields).map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0"><b>${esc(k)}</b></td><td>${esc(v)}</td></tr>`).join("");
    tasks.push(
      post("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: clean(process.env.LEAD_EMAIL_FROM) || "Valencia Smile Expert Website <onboarding@resend.dev>",
          to: to.split(/[,;]\s*/),
          reply_to: payload.email || undefined,
          subject: `New ${lead.form} submission${payload.name ? ` from ${payload.name}` : ""}`,
          html: `<p>New submission on <a href="${esc(lead.page)}">${esc(lead.page)}</a></p><table>${rows}</table>`,
        }),
      }),
    );
  }

  if (!tasks.length) {
    console.warn("[lead] NO DELIVERY CONFIGURED (set GHL_WEBHOOK_URL). Lead kept in logs:", JSON.stringify(payload));
    return { delivered: false, configured: false };
  }
  const results = await Promise.allSettled(tasks);
  const failed = results.filter((r): r is PromiseRejectedResult => r.status === "rejected");
  for (const r of failed) console.error("[lead] delivery failed:", r.reason, "Lead:", JSON.stringify(payload));
  return { delivered: failed.length < results.length, configured: true };
}

function esc(s: string) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export async function verifyTurnstile(token: string | null, ip?: string | null) {
  const secret = clean(process.env.TURNSTILE_SECRET_KEY);
  if (!secret) return true;
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, response: token, remoteip: ip || undefined }),
      signal: AbortSignal.timeout(6000),
    });
    const json = (await res.json()) as { success?: boolean };
    return Boolean(json.success);
  } catch {
    return true; // Cloudflare unreachable: do not lose the lead
  }
}
