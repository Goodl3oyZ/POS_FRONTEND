import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
// Get the pathname of the request
const path = request.nextUrl.pathname;

// Define public paths that don't require authentication
const isPublicPath = path === "/login" || path === "/register";

// Get the token from cookies
const token = request.cookies.get("auth-token")?.value || "";

// Redirect logic
if (isPublicPath && token) {
// If user is already logged in and tries to access public path
return NextResponse.redirect(new URL("/", request.url));
}

if (!isPublicPath && !token) {
// If user is not logged in and tries to access protected path
return NextResponse.redirect(new URL("/login", request.url));
}
}

// Configure which paths should trigger the middleware
export const config = {
matcher: [
/*
* Match all request paths except:
* 1. /api/* (API routes)
* 2. /_next/* (Next.js static files)
* 3. /favicon.ico, /sitemap.xml (public files)
*/
"/((?!api|_next|favicon.ico|sitemap.xml).*)",
],
};
