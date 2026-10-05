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
  matcher: ["/:path*"],
};