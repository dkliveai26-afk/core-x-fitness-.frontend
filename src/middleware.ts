import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/admin-constants";

export default clerkMiddleware(async (auth, req) => {
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

  // Check Admin Routes
  if (lowerPath === "/admin" || lowerPath === "/admin/") {
    const adminToken = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const url = req.nextUrl.clone();
    url.pathname = adminToken ? "/admin/dashboard" : "/admin/login";
    return NextResponse.redirect(url);
  }

  // Protected Admin Routes Check
  if (lowerPath.startsWith("/admin/") && lowerPath !== "/admin/login") {
    const adminToken = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!adminToken) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  // If already logged in as admin and visiting /admin/login -> redirect to /admin/dashboard
  if (lowerPath === "/admin/login") {
    const adminToken = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (adminToken) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/dashboard";
      return NextResponse.redirect(url);
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
