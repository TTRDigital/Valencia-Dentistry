// Run: npm test  (node --test with type stripping; no extra dependencies)
import { test } from "node:test";
import assert from "node:assert/strict";
import { ttrOsBody, TTR_OS_PUBLIC_SITE_KEY } from "./ttr-os.ts";

test("builds the TTR OS form payload from a contact form submission", () => {
  const body = ttrOsBody({
    siteKey: "",
    form: "Contact form",
    page: "https://www.valenciasmileexpert.com/contact/?utm_source=google",
    referrer: "https://www.google.com/",
    landing: "https://www.valenciasmileexpert.com/dental-implants/?utm_source=google&utm_medium=cpc",
    values: {
      first_name: " Jane ",
      last_name: "Smith",
      phone: "(661) 555-0100",
      email: "jane@example.com",
      service: "Dental implants",
      preferred_time: "Morning",
      message: "Hi",
      consent: "on",
      website: "",
      _t: "123",
    },
  });
  assert.deepEqual(Object.fromEntries(body), {
    k: TTR_OS_PUBLIC_SITE_KEY,
    p: "/contact/",
    r: "https://www.google.com/",
    u: "https://www.valenciasmileexpert.com/dental-implants/?utm_source=google&utm_medium=cpc",
    f_first_name: "Jane",
    f_last_name: "Smith",
    f_name: "Jane Smith",
    f_phone: "(661) 555-0100",
    f_email: "jane@example.com",
    f_service: "Dental implants",
    f_preferred_time: "Morning",
    f_message: "Hi",
    f_consent: "yes",
    f_form: "Contact form",
  });
  assert.match(body.toString(), /^k=Sb6ar7iYfoIg6TakR5qtbA&p=%2Fcontact%2F&/);
});

test("uses TTR_SITE_KEY when given and omits empty optional fields", () => {
  const body = ttrOsBody({ siteKey: "custom", form: "Appointment request", page: "", values: { name: "Sam Lee", phone: "6615550100", consent: "Yes" } });
  assert.deepEqual(Object.fromEntries(body), {
    k: "custom",
    p: "/",
    f_name: "Sam Lee",
    f_phone: "6615550100",
    f_consent: "yes",
    f_form: "Appointment request",
  });
});
