import { NextResponse, type NextRequest } from "next/server";
import { deliverLead, verifyTurnstile } from "@/lib/lead";

/**
 * Native form endpoint. Accepts JSON or form-encoded bodies. Spam protection:
 * honeypot field ("website"), time trap (form rendered < 3s before submit),
 * optional Cloudflare Turnstile. Answers { ok, redirect } for the client form
 * and redirects to /thank-you/ for no-JS submissions.
 */
const MIN_FILL_MS = 3000;
const LABELS: Record<string, string> = {
  first_name: "First name",
  last_name: "Last name",
  name: "Full name",
  phone: "Phone",
  email: "Email",
  preferred_time: "Preferred time",
  service: "Service of interest",
  message: "Message",
  consent: "Consent",
};

export async function POST(req: NextRequest) {
  const ct = req.headers.get("content-type") || "";
  let data: Record<string, string> = {};
  if (ct.includes("application/json")) {
    data = (await req.json().catch(() => ({}))) as Record<string, string>;
  } else {
    const fd = await req.formData().catch(() => null);
    if (fd) for (const [k, v] of fd.entries()) data[k] = typeof v === "string" ? v : "";
  }
  const wantsJson = ct.includes("application/json") || req.headers.get("accept")?.includes("application/json");
  const reply = (ok: boolean, status: number, message: string) => {
    if (wantsJson) return NextResponse.json({ ok, message, redirect: "/thank-you/" }, { status });
    return NextResponse.redirect(new URL(ok ? "/thank-you/" : "/appointment/?error=1", req.url), 303);
  };

  // Spam checks (answer "ok" to bots so they stop retrying)
  if (data.website) return reply(true, 200, "Thanks");
  const rendered = Number(data._t || 0);
  if (rendered && Date.now() - rendered < MIN_FILL_MS) return reply(true, 200, "Thanks");
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
  if (!(await verifyTurnstile(data["cf-turnstile-response"] || null, ip))) return reply(false, 400, "Verification failed. Please try again.");

  // Validation
  const phone = (data.phone || "").replace(/\D/g, "");
  const email = (data.email || "").trim();
  const name = (data.first_name || data.name || "").trim();
  if (!name) return reply(false, 400, "Please enter your name.");
  if (phone.length < 10) return reply(false, 400, "Please enter a valid phone number.");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return reply(false, 400, "Please enter a valid email address.");
  if (!data.consent) return reply(false, 400, "Please confirm you agree to be contacted.");

  const fields: Record<string, string> = {};
  for (const [k, label] of Object.entries(LABELS)) if (data[k] != null && data[k] !== "") fields[label] = k === "consent" ? "Yes" : String(data[k]).trim();
  const utm: Record<string, string> = {};
  for (const [k, v] of Object.entries(data)) if (/^utm_/i.test(k) && v) utm[k] = String(v).slice(0, 200);

  const result = await deliverLead({
    form: data._form || "Appointment request",
    page: data._page || req.headers.get("referer") || "",
    fields,
    utm,
    submittedAt: new Date().toISOString(),
    ip: ip || undefined,
    userAgent: req.headers.get("user-agent") || undefined,
  });

  if (!result.delivered) {
    return reply(false, 502, "We couldn't send your request just now. Please call (661) 254-5200 and we'll help you right away.");
  }
  return reply(true, 200, "Thanks");
}
