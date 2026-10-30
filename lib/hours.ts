import { site } from "./site";

/** Minutes since midnight and weekday in the practice's time zone. */
function nowInZone(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: site.timeZone, hour12: false, weekday: "short", hour: "2-digit", minute: "2-digit" }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  const minutes = (Number(get("hour")) % 24) * 60 + Number(get("minute"));
  return { weekday, minutes };
}

export type OpenState = { open: boolean; label: string; next: string };

export function openState(date = new Date()): OpenState {
  const { weekday, minutes } = nowInZone(date);
  const today = site.weekHours[weekday];
  if (today && minutes >= today[0] && minutes < today[1]) {
    return { open: true, label: "Open now", next: `Closes at ${fmt(today[1])}` };
  }
  // next opening
  for (let i = 0; i < 7; i++) {
    const d = (weekday + i) % 7;
    const h = site.weekHours[d];
    if (!h) continue;
    if (i === 0 && minutes >= h[1]) continue;
    const dayName = i === 0 ? "today" : i === 1 ? "tomorrow" : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][d];
    return { open: false, label: "Closed now", next: `Opens ${dayName} at ${fmt(h[0])}` };
  }
  return { open: false, label: "Closed", next: "" };
}

function fmt(m: number) {
  const h = Math.floor(m / 60);
  const mm = m % 60;
  const ampm = h >= 12 ? "pm" : "am";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return mm ? `${hh}:${String(mm).padStart(2, "0")}${ampm}` : `${hh}${ampm}`;
}
