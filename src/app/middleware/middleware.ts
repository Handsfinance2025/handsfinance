// middleware.ts (create this file at the root of your project, or inside `pages/` if you prefer)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from '../lib/authUtils'; // Adjust path if your middleware is not at the root

const JWT_SECRET = process.env.JWT_SECRET;

// Define paths that are public (don't require authentication)
const PUBLIC_FILE = /\.(.*)$/; // Allow static files
const PUBLIC_PATHS = ['/user/auth', '/api/auth/login']; // Add other public paths like '/', '/about'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow requests for static files and public paths
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    PUBLIC_FILE.test(pathname) ||
    PUBLIC_PATHS.some(p => pathname.startsWith(p))
  ) {
    return NextResponse.next();
  }

  // Check for JWT
  const token = req.cookies.get('auth_token')?.value;

  if (!token) {
    // Redirect to auth page if no token and trying to access a protected route
    const url = req.nextUrl.clone();
    url.pathname = '/user/auth';
    url.searchParams.set('redirect', pathname); // Pass original path to redirect back after auth
    return NextResponse.redirect(url);
  }

  // Verify JWT
  if (!JWT_SECRET) {
    console.error("JWT_SECRET is not set in middleware. Cannot verify token.");
    // Handle this critical error appropriately, maybe redirect to an error page or auth page
    const url = req.nextUrl.clone();
    url.pathname = '/user/auth';
    url.searchParams.set('error', 'server_config_error');
    return NextResponse.redirect(url);
  }
  
  const decodedToken = verifyJWT(token);

  if (!decodedToken) {
    // Invalid token, clear cookie and redirect to auth page
    const url = req.nextUrl.clone();
    url.pathname = '/user/auth';
    url.searchParams.set('redirect', pathname);
    url.searchParams.set('error', 'invalid_token');
    
    const response = NextResponse.redirect(url);
    response.cookies.delete('auth_token'); // Clear the invalid token
    return response;
  }

  // Token is valid, add decoded user info to request headers for easy access in API routes or getServerSideProps
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-user-id', decodedToken.sub as string);
  requestHeaders.set('x-telegram-id', decodedToken.tid as string);
  if (decodedToken.username) requestHeaders.set('x-username', decodedToken.username as string);
  
  // If you need to pass more complex objects, stringify them
  // requestHeaders.set('x-user', JSON.stringify(decodedToken));


  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Specify which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes) - Handled separately if needed, or let middleware run
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     *
     * We want middleware to run on most paths to protect them,
     * but we explicitly allow public paths and static files at the beginning of the middleware function.
     * API routes like /api/auth/login are public. Other API routes might be protected.
     * If you want to protect specific API routes, you can adjust the logic or add more paths to PUBLIC_PATHS.
     */
    // '/((?!api|_next/static|_next/image|favicon.ico).*)', // More complex regex
    '/((?!_next/static|_next/image|favicon.ico).*)', // Simpler, covers most cases. API routes will be matched.
  ],
};
