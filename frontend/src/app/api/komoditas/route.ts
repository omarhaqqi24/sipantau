import { NextRequest, NextResponse } from 'next/server'

const BACKEND_TIMEOUT = 10000 // 10 detik

export async function GET(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value
    || req.headers.get('authorization')?.replace('Bearer ', '')

  try {
    const headers: HeadersInit = { 'Accept': 'application/json' }
    if (token) headers['Authorization'] = `Bearer ${token}`

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), BACKEND_TIMEOUT)

    const response = await fetch(`${process.env.BACKEND_URL}/api/komoditas`, {
      method: 'GET',
      headers,
      signal: controller.signal,
    })
    clearTimeout(timeoutId)

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error: unknown) {
    const err = error as NodeJS.ErrnoException
    console.error('[/api/komoditas] Error:', err?.message)

    if (err?.name === 'AbortError') {
      return NextResponse.json(
        { success: false, message: 'Server tidak merespons. Coba lagi nanti.' },
        { status: 504 }
      )
    }

    return NextResponse.json({ success: false, message: 'Gagal mengambil data komoditas.' }, { status: 500 })
  }
}
