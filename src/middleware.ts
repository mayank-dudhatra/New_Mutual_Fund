// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const TOKEN_NAME = 'authToken';

export function middleware(request: NextRequest) {
  const token = request.cookies.get(TOKEN_NAME)?.value;
  const { pathname } = request.nextUrl;

  // Define protected routes that require authentication
  const protectedPaths = ['/home', '/funds', '/scheme', '/watchlist', '/profile'];

  const isProtected = protectedPaths.some(path => pathname.startsWith(path));

  // If trying to access a protected route without a token, redirect to login
  if (isProtected && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If a logged-in user tries to access the landing, login, or register page, redirect to the new home page
  if (['/', '/login', '/register'].includes(pathname) && token) {
     const homeUrl = new URL('/home', request.url);
     return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

// Update the matcher to include the new home and profile routes
export const config = {
  matcher: [
    '/',
    '/home/:path*',
    '/funds/:path*',
    '/scheme/:path*',
    '/watchlist/:path*',
    '/profile/:path*',
    '/login',
    '/register',
  ],
};