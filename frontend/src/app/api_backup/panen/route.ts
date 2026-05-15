import { NextRequest, NextResponse } from 'next/server'

const BACKEND_TIMEOUT = 10000 // 10 detik

export async function POST(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value
    || req.headers.get('authorization')?.replace('Bearer ', '')

  if (!token) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    console.log('[/api/panen] Mengirim data:', JSON.stringify(body))

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), BACKEND_TIMEOUT)

    const response = await fetch(`${process.env.BACKEND_URL}/api/panen`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
    clearTimeout(timeoutId)

    const data = await response.json()
    console.log('[/api/panen] Response:', data)
    return NextResponse.json(data, { status: response.status })
  } catch (error: unknown) {
    const err = error as NodeJS.ErrnoException
    console.error('[/api/panen] Error:', err?.message)

    if (err?.name === 'AbortError') {
      return NextResponse.json(
        { success: false, message: 'Server tidak merespons. Coba lagi nanti.' },
        { status: 504 }
      )
    }

    return NextResponse.json({ success: false, message: 'Gagal mengirim data panen.' }, { status: 500 })
  }
}
