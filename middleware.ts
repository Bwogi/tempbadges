import { authMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Export Clerk's middleware with our custom configuration
export default authMiddleware({
  beforeAuth: (req) => {
    // Handle redirects for HTML requests to API endpoints
    const url = req.nextUrl;
    const accept = req.headers.get('accept') || '';
    if (url.pathname === '/api/employees' && accept.includes('text/html')) {
      return NextResponse.redirect(new URL('/employees', req.url));
    }
    return NextResponse.next();
  },
  afterAuth: (auth, req) => {
    // Handle authentication after Clerk processes the request
    if (!auth.userId && !auth.isPublicRoute) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }
    return NextResponse.next();
  },
  // Define public routes that don't require authentication
  publicRoutes: [
    '/sign-in',
    '/sign-up',
    '/sign-in/(.*)',
    '/sign-up/(.*)',
    '/api/employees',
    '/employees',
    '/api/badges',
    '/badge-management',
    '/building-select',
    '/api/employees/(.*)',
    '/api/badges/(.*)',
  ],
  debug: true, // Enable debug mode for development
  clockSkewInMs: 300000, // Allow 5 minutes of clock skew (300 seconds * 1000)
});

// Configure middleware matchers
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};