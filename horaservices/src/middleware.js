
import { NextResponse } from "next/server";

const EXCLUDED_ROUTE_KEYWORDS = [
  "party-food-delivery-live-catering-buffet-select-date",
  "party-food-delivery-live-catering-buffet",
  "party-food-delivery-live-catering-buffet-checkout",
  "chef-near-me",
  "book-chef-checkout",
];

export function middleware(request) {
  const pathname = request.nextUrl.pathname;
  const lowerPathname = pathname.toLowerCase();

  const shouldSkipNormalization = EXCLUDED_ROUTE_KEYWORDS.some(
    (route) => lowerPathname.includes(route)
  );

  if (shouldSkipNormalization) {
    return NextResponse.next();
  }

  let normalizedPathname;

  try {
    normalizedPathname = pathname
      .split("/")
      .map((segment) => {
        if (!segment) return "";

        return decodeURIComponent(segment)
          .trim()
          .replace(/\s+/g, "-")
          .toLowerCase();
      })
      .join("/");
  } catch {
    return NextResponse.next();
  }

  if (pathname === normalizedPathname) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = normalizedPathname;
  return NextResponse.redirect(url, 301);
}

export const config = {
  matcher: [
    "/((?!api(?:/|$)|_next(?:/|$)|favicon\\.ico$|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|css|js|mjs|map|json|txt|xml|woff|woff2|ttf|eot|otf|mp4|webm|mov|avi|pdf)$).*)",
  ],
};
