import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { test } from "node:test";
import { checkPreviewLink, NOT_SET_UP } from "./preview.ts";

// The link TTR OS builds (ttr-portal lib/connectors/sanity.ts, previewUrl).
const SECRET = "s".repeat(40);
const NOW = Date.UTC(2026, 10, 23);
const exp = String(Math.floor(NOW / 1000) + 30 * 86_400);
const sign = (path: string, e: string, secret = SECRET) => createHmac("sha256", secret).update(`${path}\n${e}`).digest("hex");

test("a link signed by TTR OS opens its path", () => {
  assert.deepEqual(checkPreviewLink({ path: "/dental-implants-cost/", exp, sig: sign("/dental-implants-cost/", exp) }, SECRET, NOW), { ok: true, path: "/dental-implants-cost/" });
});

test("preview is off with no secret", () => {
  assert.deepEqual(checkPreviewLink({ path: "/", exp, sig: sign("/", exp) }, "", NOW), { ok: false, why: NOT_SET_UP });
});

test("wrong secret, other path or edited expiry are refused", () => {
  assert.equal(checkPreviewLink({ path: "/", exp, sig: sign("/", exp, "x".repeat(40)) }, SECRET, NOW).ok, false);
  assert.equal(checkPreviewLink({ path: "/about/", exp, sig: sign("/", exp) }, SECRET, NOW).ok, false);
  const later = String(Number(exp) + 1);
  assert.equal(checkPreviewLink({ path: "/", exp: later, sig: sign("/", exp) }, SECRET, NOW).ok, false);
  assert.equal(checkPreviewLink({ path: "/", exp, sig: null }, SECRET, NOW).ok, false);
});

test("expired or too far ahead are refused", () => {
  const past = String(Math.floor(NOW / 1000) - 1);
  assert.deepEqual(checkPreviewLink({ path: "/", exp: past, sig: sign("/", past) }, SECRET, NOW), { ok: false, why: "Link expired" });
  const far = String(Math.floor(NOW / 1000) + 40 * 86_400);
  assert.equal(checkPreviewLink({ path: "/", exp: far, sig: sign("/", far) }, SECRET, NOW).ok, false);
});

test("never redirects off the site", () => {
  for (const path of ["//evil.example/", "https://evil.example/", "/\\evil.example", "about/"]) {
    assert.equal(checkPreviewLink({ path, exp, sig: sign(path, exp) }, SECRET, NOW).ok, false, path);
  }
});
