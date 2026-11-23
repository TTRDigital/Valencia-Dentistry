import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";

/**
 * Publish webhook: POST /api/revalidate/ signed with SANITY_REVALIDATE_SECRET
 * (header sanity-webhook-signature). Sent by Sanity on publish and by TTR OS
 * after it publishes a page, in the same shape. Published content is cached
 * for 5 minutes (lib/content/sanity.ts); this refreshes it at once.
 */
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) return NextResponse.json({ ok: false, message: "Webhook secret is not configured" }, { status: 503 });
  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string; slug?: string | { current?: string }; path?: string }>(req, secret, true);
    if (!isValidSignature) return NextResponse.json({ ok: false, message: "Invalid signature" }, { status: 401 });
    // Every content query carries the "sanity" tag; pages also share header, footer and related links, so refresh the whole site.
    revalidateTag("sanity", "max");
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true, type: body?._type ?? null });
  } catch (err) {
    console.error("Revalidate webhook failed", err);
    return NextResponse.json({ ok: false, message: "Error" }, { status: 500 });
  }
}
