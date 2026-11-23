import { draftMode } from "next/headers";
import { checkPreviewLink, NOT_SET_UP, PREVIEW_HEADERS, previewSecret } from "@/lib/preview";

/**
 * Draft preview for TTR OS (lib/preview.ts): a valid, unexpired signed link
 * turns on draft mode and redirects to the page, which then shows Sanity's
 * unpublished changes. Visitors never get here without a signed link.
 */
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  const check = checkPreviewLink({ path: q.get("path"), exp: q.get("exp"), sig: q.get("sig") }, previewSecret());
  if (!check.ok) {
    const status = check.why === NOT_SET_UP ? 503 : 401;
    return new Response(check.why, { status, headers: { ...PREVIEW_HEADERS, "Content-Type": "text/plain; charset=utf-8" } });
  }
  (await draftMode()).enable();
  return new Response(null, { status: 307, headers: { ...PREVIEW_HEADERS, Location: check.path } });
}
