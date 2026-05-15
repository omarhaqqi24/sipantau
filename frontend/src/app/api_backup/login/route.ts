import { NextRequest, NextResponse } from 'next/server'

const BACKEND_TIMEOUT = 10000 // 10 detik

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email') || ''
  const password = searchParams.get('password') || ''

  console.log('[Login Proxy] Request masuk:', { email, password: '***' })

  try {
    const params = new URLSearchParams({ email, password })
    const backendUrl = `${process.env.BACKEND_URL}/api/login?${params.toString()}`
    console.log('[Login Proxy] Mencoba URL:', backendUrl)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), BACKEND_TIMEOUT)

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal,
    })
    clearTimeout(timeoutId)

    const data = await response.json()
    console.log('[Login Proxy] Response status:', response.status)
    console.log('[Login Proxy] Response data:', JSON.stringify(data))

    return NextResponse.json(data, { status: response.status })
  } catch (error: unknown) {
    const err = error as NodeJS.ErrnoException
    console.error('[Login Proxy] ===== ERROR DETAIL =====')
    console.error('[Login Proxy] message:', err?.message)
    console.error('[Login Proxy] code:', err?.code)
    console.error('[Login Proxy] cause:', err?.cause)
    console.error('[Login Proxy] stack:', err?.stack)

    // Cek apakah timeout (abort)
    if (err?.name === 'AbortError') {
      return NextResponse.json(
        { success: false, message: 'Server tidak merespons dalam waktu yang ditentukan. Coba lagi nanti.' },
        { status: 504 }
      )
    }

    return NextResponse.json(
      { success: false, message: `Server error: ${err?.code || err?.message || 'Unknown'}` },
      { status: 500 }
    )
  }
}
