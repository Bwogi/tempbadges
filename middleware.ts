import { authMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Export Clerk's middleware with our custom configuration
export default authMiddleware({
  publicRoutes: ["/api/employees", "/viewer"],
  beforeAuth: (req) => {
    // If someone tries to access the API endpoint directly in a browser
    if (req.nextUrl.pathname === '/api/employees' && 
        req.method === 'GET' && 
        req.headers.get('accept')?.includes('text/html')) {
      return NextResponse.redirect(new URL('/viewer', req.url));
    }
    return NextResponse.next();
  }
});

// Configure middleware to run on all routes
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};