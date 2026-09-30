import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Redirect the production Vercel alias to the canonical host so it can never be
// indexed as duplicate content. Only the exact production alias is redirected;
// preview deploys (other *.vercel.app hosts) are left alone so they stay usable.
const PROD_VERCEL_HOST = "commview-green.vercel.app";
const CANONICAL_HOST = "www.commview.co.uk";

export function middleware(req: NextRequest) {
  if (req.headers.get("host") === PROD_VERCEL_HOST) {
    const url = new URL(req.url);
    url.protocol = "https:";
    url.host = CANONICAL_HOST;
    url.port = "";
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = {
  // Every route except Next internals and the API (API stays reachable on both
  // hosts; only pages matter for indexing).
  matcher: ["/((?!api|_next).*)"],
};
