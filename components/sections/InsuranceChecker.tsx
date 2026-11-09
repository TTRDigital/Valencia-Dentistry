"use client";

import { useState } from "react";
import { site } from "@/lib/site";
import { Icon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

type Plan = "ppo" | "hmo" | "none";

/**
 * Insurance checker in three steps: plan type, carrier, result. It only states what the practice
 * already says publicly (most PPO plans accepted, these carriers, benefits verified, financing);
 * anything else is "call us and we'll check", never a yes or no we can't stand behind.
 */
export function InsuranceWidget() {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [carrier, setCarrier] = useState<string | null>(null);
  const step = !plan ? 0 : plan === "ppo" && !carrier ? 1 : 2;
  const reset = () => { setPlan(null); setCarrier(null); };
  const steps = ["Plan type", "Your carrier", "Your result"];
  const choice = (active: boolean) => cn("flex min-h-24 flex-col items-center justify-center gap-1 rounded-xl border bg-white p-5 text-center transition-colors hover:border-olive-600", active ? "border-olive-600 ring-2 ring-olive-600/20" : "border-ink-900/10");
  return (
    <>
            <div className="rounded-2xl bg-warm p-5 ring-1 ring-ink-900/5 sm:p-8">
              <ol className="grid grid-cols-3 gap-2" aria-label="Steps">
                {steps.map((label, i) => (
                  <li key={label} className="flex flex-col gap-2" aria-current={i === step ? "step" : undefined}>
                    <span className={cn("h-1 rounded-full", i <= step ? "bg-olive-600" : "bg-ink-900/10")} />
                    <span className={cn("text-xs font-semibold uppercase tracking-[0.1em]", i === step ? "text-olive-700" : "text-grey-600")}>{i + 1}. {label}</span>
                  </li>
                ))}
              </ol>

              <div className="mt-7" aria-live="polite">
                {step === 0 && (
                  <>
                    <p className="font-semibold text-ink-900">What kind of dental plan do you have?</p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <button type="button" className={choice(false)} onClick={() => setPlan("ppo")}><span className="text-xl font-semibold text-ink-900">PPO</span><span className="text-sm text-grey-600">Preferred provider</span></button>
                      <button type="button" className={choice(false)} onClick={() => setPlan("hmo")}><span className="text-xl font-semibold text-ink-900">HMO</span><span className="text-sm text-grey-600">Health maintenance</span></button>
                      <button type="button" className={choice(false)} onClick={() => setPlan("none")}><span className="text-xl font-semibold text-ink-900">None</span><span className="text-sm text-grey-600">No insurance</span></button>
                    </div>
                  </>
                )}
                {step === 1 && (
                  <>
                    <p className="font-semibold text-ink-900">Who is your PPO plan with?</p>
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {[...site.insurers.map((i) => i.name), "Another carrier"].map((name) => (
                        <button key={name} type="button" className={cn(choice(false), "min-h-16 text-[0.9375rem] font-semibold text-ink-900")} onClick={() => setCarrier(name)}>{name}</button>
                      ))}
                    </div>
                  </>
                )}
                {step === 2 && (
                  <div className="rounded-xl bg-white p-6 ring-1 ring-ink-900/10">
                    {plan === "ppo" && carrier !== "Another carrier" ? (
                      <>
                        <p className="flex items-center gap-2 text-lg font-semibold text-olive-700"><Icon.check className="h-5 w-5" /> Good news</p>
                        <p className="mt-2 text-ink-900">We accept most {carrier} PPO plans. We verify your benefits before your visit, so you know what is covered before treatment starts.</p>
                      </>
                    ) : plan === "ppo" ? (
                      <>
                        <p className="text-lg font-semibold text-ink-900">We accept cash and most major PPO plans</p>
                        <p className="mt-2 text-grey-700">Call us with your plan details and we will check your coverage before your visit.</p>
                      </>
                    ) : plan === "hmo" ? (
                      <>
                        <p className="text-lg font-semibold text-ink-900">Let us check your HMO plan</p>
                        <p className="mt-2 text-grey-700">HMO plans vary. Call us with your plan details and we will tell you exactly where you stand.</p>
                      </>
                    ) : (
                      <>
                        <p className="text-lg font-semibold text-ink-900">No insurance? No problem.</p>
                        <p className="mt-2 text-grey-700">We offer flexible financing so cost never stands between you and care. Ask us about your options.</p>
                      </>
                    )}
                    <div className="mt-5 grid gap-3 sm:flex sm:flex-wrap">
                      <a href={site.bookingUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Book an appointment <Icon.arrow className="h-4 w-4" /></a>
                      <a href={`tel:${site.phone.tel}`} className="btn border border-ink-900/20 text-ink-900"><Icon.phone className="h-4 w-4" /> {site.phone.display}</a>
                    </div>
                  </div>
                )}
                {step > 0 && <button type="button" onClick={reset} className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-grey-700 underline-offset-4 hover:underline">Start over</button>}
              </div>
            </div>
            <p className="mt-3 text-xs text-grey-600">Coverage varies by employer group and plan. We confirm your benefits before treatment.</p>
    </>
  );
}
