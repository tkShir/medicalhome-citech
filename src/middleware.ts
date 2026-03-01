import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // /admin/login は認証不要
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  // /admin/* は cookie 確認
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin_token')?.value
    const secret = process.env.ADMIN_SECRET

    if (!secret || token !== secret) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
