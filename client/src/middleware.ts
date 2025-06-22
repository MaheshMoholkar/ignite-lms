import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  const activationToken = request.cookies.get("activation_token")?.value;
  const activationEmail = request.cookies.get("activation_email")?.value;
  const { pathname } = request.nextUrl;

  // Handle activation page access
  if (pathname === "/activation") {
    // If no activation token, redirect to register
    if (!activationToken) {
      return NextResponse.redirect(new URL("/register", request.url));
    }

    // If no activation email, redirect to register (incomplete activation flow)
    if (!activationEmail) {
      return NextResponse.redirect(new URL("/register", request.url));
    }

    // If user is already authenticated, redirect to home
    if (accessToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Allow access to activation page
    return NextResponse.next();
  }

  // If user has activation token but is not on activation page, redirect to activation
  if (activationToken && activationEmail && pathname !== "/activation") {
    return NextResponse.redirect(new URL("/activation", request.url));
  }

  // If user is authenticated and tries to access login/register, redirect to home
  if (
    accessToken &&
    (pathname.startsWith("/login") || pathname.startsWith("/register"))
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Allow access to all other pages
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
