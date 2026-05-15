import { NextRequest, NextResponse } from 'next/server'

// Route yang memerlukan autentikasi
const PROTECTED_ROUTES = [
  '/dashboard-dinas-pertanian',
  '/dashboard-tpid',
  '/input-harga',
  '/input-harga-pasar',
  '/input-kebutuhan',
  '/input-komoditas',
  '/pilih-harga',
  '/pilih-harga-pasar',
  '/pilih-kebutuhan',
  '/pilih-komoditas',
  '/breakdown',
  '/checking-station',
  '/rekomendasi',
  '/price-chart',
  '/pasar',
]

// Route login yang tidak boleh diakses jika sudah login
const LOGIN_ROUTES = [
  '/login-sebagai',
  '/login-dinas-pertanian',
  '/login-tim-pengendalian',
]

// Roles yang diarahkan ke dashboard dinas pertanian
const DINAS_ROLES = ['admin', 'dinas_pertanian', 'dinas_perdagangan', 'dinas_ketahanan_pangan']

// Roles yang diarahkan ke dashboard TPID (khusus tpid saja, admin sudah masuk DINAS)
const TPID_ONLY_ROLES = ['tpid']

function getDashboardByRole(role: string): string {
  if (DINAS_ROLES.includes(role)) {
    return '/dashboard-dinas-pertanian'
  }
  if (TPID_ONLY_ROLES.includes(role)) {
    return '/dashboard-tpid'
  }
  // Default fallback
  return '/dashboard-tim-pengendalian'
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get('auth_token')?.value
  const role = req.cookies.get('user_role')?.value || ''

  // 1. Cek route yang memerlukan autentikasi
  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route))

  if (isProtected && !token) {
    const loginUrl = new URL('/login-sebagai', req.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 2. Cek login routes - jika sudah login, redirect ke dashboard sesuai role
  const isLoginRoute = LOGIN_ROUTES.some((route) => pathname.startsWith(route))

  if (isLoginRoute && token) {
    const dashboardUrl = new URL(getDashboardByRole(role), req.url)
    return NextResponse.redirect(dashboardUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard-dinas-pertanian/:path*',
    '/dashboard-tpid/:path*',
    '/input-harga/:path*',
    '/input-harga-pasar/:path*',
    '/input-kebutuhan/:path*',
    '/input-komoditas/:path*',
    '/pilih-harga/:path*',
    '/pilih-harga-pasar/:path*',
    '/pilih-kebutuhan/:path*',
    '/pilih-komoditas/:path*',
    '/breakdown/:path*',
    '/checking-station/:path*',
    '/rekomendasi/:path*',
    '/price-chart/:path*',
    '/pasar/:path*',
    '/login-sebagai/:path*',
    '/login-dinas-pertanian/:path*',
    '/login-tim-pengendalian/:path*',
  ],
}
