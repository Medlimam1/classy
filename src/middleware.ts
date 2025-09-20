import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

/**
 * Middleware to protect /admin routes. Requires NEXTAUTH_SECRET to be set so
 * getToken can read the JWT and its role claim.
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Only protect admin routes
  if (!pathname.startsWith('/admin') && !/^\/[a-zA-Z]{2}\/admin/.test(pathname)) {
    return NextResponse.next()
  }

  // Try to read token (will read JWT from cookie)
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  const role = token?.role as string | undefined

  if (role === 'ADMIN') {
    return NextResponse.next()
  }

  // Determine locale from path: if path is /{locale}/admin..., redirect to /{locale}/auth/login
  const parts = pathname.split('/')
  let locale = 'en'
  if (parts.length > 1 && parts[1].length === 2) {
    locale = parts[1]
  }

  const loginUrl = new URL(`/${locale}/auth/login`, req.url)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/admin/:path*', '/:locale/admin/:path*'],
}
