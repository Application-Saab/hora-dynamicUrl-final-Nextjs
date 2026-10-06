import { NextResponse } from "next/server";

export function middleware(request) {
  const pathname = request.nextUrl.pathname;

  const normalizedPathname = pathname
    .split("/")
    .map((segment) => {
      if (!segment) return "";

      return decodeURIComponent(segment)
        .trim()
        .replace(/\s+/g, "-")
        .toLowerCase();
    })
    .join("/");

  if (pathname === normalizedPathname) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = normalizedPathname;

  return NextResponse.redirect(url, 301);
}

export const config = {
  matcher: [
    /*
     * Middleware will only run on application routes.
     *
     * Skip:
     * - /api/*
     * - /_next/static/*
     * - /_next/image/*
     * - /favicon.ico
     * - common static files
     */
    "/((?!api(?:/|$)|_next(?:/|$)|favicon\\.ico$|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|css|js|mjs|map|json|txt|xml|woff|woff2|ttf|eot|otf|mp4|webm|mov|avi|pdf)$).*)",
  ],
};