import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  const activationToken = request.cookies.get("activation_token")?.value;
  const { pathname } = request.nextUrl;

  if (pathname === "/activation") {
    return NextResponse.next();
  }
  if (activationToken) {
    return NextResponse.redirect(new URL("/activation", request.url));
  }

  // If user is authenticated and tries to access login/register, redirect to home
  if (
    accessToken &&
    (pathname.startsWith("/login") || pathname.startsWith("/register"))
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
