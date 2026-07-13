import { NextRequest, NextResponse } from 'next/server'

const BACKEND_TIMEOUT = 10000

export async function GET(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value
    || req.headers.get('authorization')?.replace('Bearer ', '')

  if (!token) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const start_date = searchParams.get('start_date')
    const end_date = searchParams.get('end_date')
    const page = searchParams.get('page') || '1'

    const params = new URLSearchParams({ page })
    if (start_date) params.set('start_date', start_date)
    if (end_date) params.set('end_date', end_date)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), BACKEND_TIMEOUT)

    const response = await fetch(`${process.env.BACKEND_URL}/api/activities/period?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      signal: controller.signal,
    })
    clearTimeout(timeoutId)

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error: unknown) {
    const err = error as NodeJS.ErrnoException
    console.error('[/api/activities/period] Error:', err?.message)

    if (err?.name === 'AbortError') {
      return NextResponse.json(
        { success: false, message: 'Server tidak merespons. Coba lagi nanti.' },
        { status: 504 }
      )
    }

    return NextResponse.json({ success: false, message: 'Gagal mengambil data aktivitas periode.' }, { status: 500 })
  }
}
