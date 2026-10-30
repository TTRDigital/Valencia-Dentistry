"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

type Errors = Partial<Record<string, string>>;

const SERVICES = ["New patient exam ($59 special)", "Cleaning & checkup", "Dental implants", "Veneers / cosmetic", "Invisalign", "Crowns or bridges", "Tooth extraction / wisdom teeth", "TMJ / jaw pain", "Emergency / tooth pain", "Something else"];
const TIMES = ["Morning (8am – 11am)", "Midday (11am – 2pm)", "Afternoon (2pm – 5pm)", "First available"];

/**
 * Native appointment/contact form: accessible labels, inline validation,
 * honeypot + time trap, optional Turnstile. Works without JavaScript
 * (plain POST to /api/lead/ → redirect to /thank-you/).
 */
export function LeadForm({ formName = "Appointment request", compact, services = true, className }: { formName?: string; compact?: boolean; services?: boolean; className?: string }) {
  const id = useId();
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [serverMsg, setServerMsg] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const tRef = useRef<HTMLInputElement>(null);
  const pageRef = useRef<HTMLInputElement>(null);
  const utmRef = useRef<HTMLDivElement>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  // Render-time values written straight into hidden inputs (works for no-JS submissions too).
  useEffect(() => {
    if (tRef.current) tRef.current.value = String(Date.now());
    if (pageRef.current) pageRef.current.value = window.location.href;
    const u: Record<string, string> = {};
    const params = new URLSearchParams(window.location.search);
    for (const [k, v] of params) if (/^utm_/i.test(k)) u[k] = v;
    try {
      const stored = sessionStorage.getItem("utm");
      if (!Object.keys(u).length && stored) Object.assign(u, JSON.parse(stored));
      if (Object.keys(u).length) sessionStorage.setItem("utm", JSON.stringify(u));
    } catch { /* storage unavailable */ }
    const box = utmRef.current;
    if (box) {
      box.replaceChildren();
      for (const [k, v] of Object.entries(u)) { const i = document.createElement("input"); i.type = "hidden"; i.name = k; i.value = v; box.appendChild(i); }
    }
  }, []);

  useEffect(() => {
    if (!siteKey || document.getElementById("cf-turnstile")) return;
    const s = document.createElement("script");
    s.id = "cf-turnstile";
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    s.async = true;
    document.head.appendChild(s);
  }, [siteKey]);

  function validate(fd: FormData): Errors {
    const e: Errors = {};
    if (!String(fd.get("first_name") || "").trim()) e.first_name = "Please enter your first name.";
    if (!String(fd.get("last_name") || "").trim()) e.last_name = "Please enter your last name.";
    const phone = String(fd.get("phone") || "").replace(/\D/g, "");
    if (phone.length < 10) e.phone = "Please enter a 10-digit phone number.";
    const email = String(fd.get("email") || "").trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "That email address doesn't look right.";
    if (!fd.get("consent")) e.consent = "Please confirm you're happy for us to contact you.";
    return e;
  }

  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const form = ev.currentTarget;
    const fd = new FormData(form);
    const e = validate(fd);
    setErrors(e);
    if (Object.keys(e).length) {
      const first = form.querySelector<HTMLElement>("[aria-invalid='true']");
      first?.focus();
      return;
    }
    setStatus("sending");
    setServerMsg("");
    const body: Record<string, string> = {};
    for (const [k, v] of fd.entries()) body[k] = String(v);
    try {
      const res = await fetch("/api/lead/", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(body) });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string; redirect?: string };
      if (res.ok && json.ok) {
        window.location.assign(json.redirect || "/thank-you/");
        return;
      }
      setStatus("error");
      setServerMsg(json.message || `We couldn't send your request. Please call ${site.phone.display}.`);
    } catch {
      setStatus("error");
      setServerMsg(`We couldn't send your request. Please call ${site.phone.display}.`);
    }
  }

  const field = (name: string, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}, hint?: string) => {
    const err = errors[name];
    const fid = `${id}-${name}`;
    return (
      <div className={cn(props.className)}>
        <label htmlFor={fid} className="mb-1.5 block text-sm font-semibold text-navy-900">{label}{props.required && <span className="text-danger" aria-hidden="true"> *</span>}</label>
        <input
          id={fid}
          name={name}
          aria-invalid={err ? "true" : undefined}
          aria-describedby={err ? `${fid}-err` : hint ? `${fid}-hint` : undefined}
          onChange={() => err && setErrors((x) => ({ ...x, [name]: undefined }))}
          {...props}
          className={cn("block min-h-12 w-full rounded-xl border bg-white px-4 py-3 text-navy-900 placeholder:text-grey-400 focus:border-steel-600 focus:ring-2 focus:ring-steel-600/25", err ? "border-danger" : "border-grey-300")}
        />
        {hint && !err && <p id={`${fid}-hint`} className="mt-1 text-xs text-grey-600">{hint}</p>}
        {err && <p id={`${fid}-err`} className="mt-1 text-sm text-danger" role="alert">{err}</p>}
      </div>
    );
  };

  return (
    <form ref={formRef} action="/api/lead/" method="post" onSubmit={onSubmit} noValidate className={cn("grid gap-4", className)} aria-label={formName}>
      <input type="hidden" name="_form" value={formName} />
      <input ref={pageRef} type="hidden" name="_page" defaultValue="" />
      <input ref={tRef} type="hidden" name="_t" defaultValue="" />
      <div ref={utmRef} hidden />
      {/* Honeypot: hidden from people, filled by bots */}
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor={`${id}-website`}>Website</label>
        <input id={`${id}-website`} type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {field("first_name", "First name", { required: true, autoComplete: "given-name", placeholder: "Jane" })}
        {field("last_name", "Last name", { required: true, autoComplete: "family-name", placeholder: "Smith" })}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {field("phone", "Phone", { required: true, type: "tel", inputMode: "tel", autoComplete: "tel", placeholder: "(661) 555-0100" })}
        {field("email", "Email", { type: "email", inputMode: "email", autoComplete: "email", placeholder: "jane@example.com" })}
      </div>
      <div className={cn("grid gap-4", services && "sm:grid-cols-2")}>
        {services && (
          <div>
            <label htmlFor={`${id}-service`} className="mb-1.5 block text-sm font-semibold text-navy-900">Service of interest</label>
            <select id={`${id}-service`} name="service" className="block min-h-12 w-full rounded-xl border border-grey-300 bg-white px-4 py-3 text-navy-900 focus:border-steel-600 focus:ring-2 focus:ring-steel-600/25" defaultValue="">
              <option value="">Select a service</option>
              {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        )}
        <div>
          <label htmlFor={`${id}-time`} className="mb-1.5 block text-sm font-semibold text-navy-900">Preferred time</label>
          <select id={`${id}-time`} name="preferred_time" className="block min-h-12 w-full rounded-xl border border-grey-300 bg-white px-4 py-3 text-navy-900 focus:border-steel-600 focus:ring-2 focus:ring-steel-600/25" defaultValue="">
            <option value="">No preference</option>
            {TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>
      {!compact && (
        <div>
          <label htmlFor={`${id}-message`} className="mb-1.5 block text-sm font-semibold text-navy-900">Message</label>
          <textarea id={`${id}-message`} name="message" rows={4} placeholder="Tell us what's going on, or any questions you have." className="block w-full rounded-xl border border-grey-300 bg-white px-4 py-3 text-navy-900 placeholder:text-grey-400 focus:border-steel-600 focus:ring-2 focus:ring-steel-600/25" />
        </div>
      )}
      <div>
        <label className="flex items-start gap-3 text-sm text-grey-700">
          <input type="checkbox" name="consent" value="yes" aria-invalid={errors.consent ? "true" : undefined} aria-describedby={errors.consent ? `${id}-consent-err` : undefined} onChange={() => errors.consent && setErrors((x) => ({ ...x, consent: undefined }))} className="mt-0.5 h-5 w-5 shrink-0 rounded border-grey-300 text-steel-600 focus:ring-steel-600" />
          <span>I agree to be contacted by {site.name} by phone, text or email about my request. <span className="text-grey-600">Message and data rates may apply. This form is not for emergencies; if you are in pain, please call {site.phone.display}.</span></span>
        </label>
        {errors.consent && <p id={`${id}-consent-err`} className="mt-1 text-sm text-danger" role="alert">{errors.consent}</p>}
      </div>
      {siteKey && <div className="cf-turnstile" data-sitekey={siteKey} data-theme="light" />}
      {status === "error" && (
        <div role="alert" className="rounded-xl border border-danger/30 bg-red-50 px-4 py-3 text-sm text-danger">
          {serverMsg} <a href={`tel:${site.phone.tel}`} className="font-semibold underline">Call {site.phone.display}</a>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-4 pt-1">
        <button type="submit" className="btn btn-primary btn-lg" disabled={status === "sending"} aria-busy={status === "sending"}>
          {status === "sending" ? "Sending…" : "Request appointment"}
        </button>
        <p className="text-sm text-grey-600">Prefer to book instantly? <a href={site.bookingUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-steel-600 underline-offset-4 hover:underline">Use online booking</a></p>
      </div>
    </form>
  );
}
