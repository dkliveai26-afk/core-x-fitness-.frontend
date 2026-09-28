import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/admin-constants";

/**
 * Edge-safe token validity checker (structure & expiration check)
 */
function isTokenStructureValid(token?: string): boolean {
  if (!token || typeof token !== 'string') return false;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) base64 += '=';
    // Edge runtime provides atob
    const jsonStr = atob(base64);
    const payload = JSON.parse(jsonStr);
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return false; // Expired
    }
    return Boolean(payload.id && payload.email);
  } catch {
    return false;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const lowerPath = pathname.toLowerCase();

  // Normalize uppercase /Admin to lowercase /admin
  if (pathname !== lowerPath && (lowerPath === "/admin" || lowerPath.startsWith("/admin/"))) {
    const url = req.nextUrl.clone();
    url.pathname = lowerPath;
    return NextResponse.redirect(url, 308);
  }

  // Normalize /dite to /diet
  if (lowerPath === "/dite") {
    const url = req.nextUrl.clone();
    url.pathname = "/diet";
    return NextResponse.redirect(url, 308);
  }

  // Normalization for known public routes
  const knownPages = ["/about", "/plans", "/gallery", "/diet", "/contact", "/sign-in", "/sign-up"];
  if (pathname !== lowerPath && knownPages.includes(lowerPath)) {
    const url = req.nextUrl.clone();
    url.pathname = lowerPath;
    return NextResponse.redirect(url, 308);
  }

  const rawToken = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const hasValidToken = isTokenStructureValid(rawToken);

  // Check Admin Root Route (/admin or /admin/)
  if (lowerPath === "/admin" || lowerPath === "/admin/") {
    const url = req.nextUrl.clone();
    url.pathname = hasValidToken ? "/admin/dashboard" : "/admin/login";
    const res = NextResponse.redirect(url);
    if (rawToken && !hasValidToken) {
      res.cookies.delete(ADMIN_COOKIE_NAME);
    }
    return res;
  }

  // Protected Admin Routes (/admin/dashboard, /admin/plans, /admin/bookings, etc.)
  if (lowerPath.startsWith("/admin/") && lowerPath !== "/admin/login") {
    if (!hasValidToken) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      const res = NextResponse.redirect(url);
      if (rawToken) {
        res.cookies.delete(ADMIN_COOKIE_NAME);
      }
      return res;
    }
  }

  // If already logged in with valid token and visiting /admin/login -> redirect to /admin/dashboard
  if (lowerPath === "/admin/login") {
    if (hasValidToken) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/dashboard";
      return NextResponse.redirect(url);
    } else if (rawToken) {
      // Clear expired or invalid token
      const res = NextResponse.next();
      res.cookies.delete(ADMIN_COOKIE_NAME);
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
