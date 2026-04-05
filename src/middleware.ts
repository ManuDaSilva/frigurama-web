import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Kept separate from src/lib/auth.ts — middleware runs in the Edge runtime
// and cannot import next/headers. JWT verification is self-contained here.

const COOKIE_NAME = "admin_token";

function getSecret() {
  return new TextEncoder().encode(process.env.AUTH_SECRET ?? "");
}

function redirectToLogin(req: NextRequest): NextResponse {
  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("from", req.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const token = req.cookies.get(COOKIE_NAME)?.value;

  if (!token) return redirectToLogin(req);

  try {
    const { payload } = await jwtVerify(token, getSecret());

    // /admin/users is superadmin-only
    if (
      req.nextUrl.pathname.startsWith("/admin/users") &&
      payload.role !== "superadmin"
    ) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch {
    return redirectToLogin(req);
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/listings/new",
    "/listings/:id/edit",
  ],
};
