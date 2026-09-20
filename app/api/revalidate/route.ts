import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

// Sanity → Vercel revalidation webhook.
// On publish, Sanity POSTs here; we bust the cache for the affected article and
// the /insights index so edits appear within seconds instead of waiting for ISR.
//
// Auth: a shared secret, accepted either as ?secret= or an x-revalidate-secret
// header, compared to SANITY_REVALIDATE_SECRET. No signature library needed.

function authorised(req: NextRequest): boolean {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) return false; // fail closed if not configured
  const provided =
    req.nextUrl.searchParams.get("secret") ||
    req.headers.get("x-revalidate-secret");
  return provided === secret;
}

// Pull the post slug from the webhook payload (projection or full document).
function slugFrom(body: unknown): string | null {
  const b = body as { slug?: unknown } | null;
  if (!b || typeof b !== "object") return null;
  const s = b.slug as { current?: string } | string | undefined;
  if (typeof s === "string") return s;
  if (s && typeof s.current === "string") return s.current;
  return null;
}

export async function POST(req: NextRequest) {
  if (!authorised(req)) {
    return NextResponse.json({ revalidated: false, message: "Invalid secret" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const slug = slugFrom(body);

  // The index is dynamic today, but revalidating it is harmless and future-proof.
  revalidatePath("/insights");
  if (slug) revalidatePath(`/insights/${slug}`);

  return NextResponse.json({
    revalidated: true,
    paths: slug ? ["/insights", `/insights/${slug}`] : ["/insights"],
    now: Date.now(),
  });
}

// Manual trigger for testing: GET with ?secret= refreshes the index.
export async function GET(req: NextRequest) {
  if (!authorised(req)) {
    return NextResponse.json({ revalidated: false, message: "Invalid secret" }, { status: 401 });
  }
  revalidatePath("/insights");
  return NextResponse.json({ revalidated: true, paths: ["/insights"], now: Date.now() });
}
