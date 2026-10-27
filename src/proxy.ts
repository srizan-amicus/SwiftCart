import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const startTime = performance.now();
  const { pathname, search } = request.nextUrl;
  const method = request.method;

  let response: NextResponse;

  const isProtectedRoute =
    pathname === "/checkout" ||
    pathname.startsWith("/checkout/") ||
    pathname === "/orders" ||
    pathname.startsWith("/orders/");

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  if (isProtectedRoute && !accessToken && !refreshToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("returnTo", `${pathname}${search}`);

    response = NextResponse.redirect(loginUrl);
  } else {
    response = NextResponse.next();
  }

  const duration = (performance.now() - startTime).toFixed(2);

  console.log(`[Proxy] ${method} ${pathname} - ${duration}ms`);

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2)$).*)",
  ],
};
