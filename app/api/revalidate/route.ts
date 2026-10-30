import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";

/** Sanity publish webhook: POST /api/revalidate/ with SANITY_REVALIDATE_SECRET. */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) return NextResponse.json({ ok: false, message: "Webhook secret is not configured" }, { status: 503 });
  try {
    const { isValidSignature } = await parseBody(req, secret, true);
    if (!isValidSignature) return NextResponse.json({ ok: false, message: "Invalid signature" }, { status: 401 });
    revalidateTag("sanity", "max");
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Revalidate webhook failed", err);
    return NextResponse.json({ ok: false, message: "Error" }, { status: 500 });
  }
}
