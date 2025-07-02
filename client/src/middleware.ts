import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  const activationToken = request.cookies.get("activation_token")?.value;
  const activationEmail = request.cookies.get("activation_email")?.value;
  const { pathname } = request.nextUrl;

  // If user has activation token but is not on activation page, redirect to activation
  if (activationToken && activationEmail && pathname !== "/activation") {
    return NextResponse.redirect(new URL("/activation", request.url));
  }

  // If user is authenticated and tries to access login/register, redirect based on role
  if (
    accessToken &&
    (pathname.startsWith("/login") || pathname.startsWith("/register"))
  ) {
    // For now, redirect to dashboard. Role-based redirection will be handled in the login form
    // since middleware doesn't have access to user data without making an API call
    return NextResponse.redirect(new URL("/dashboard", request.url));
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
