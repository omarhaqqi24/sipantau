import { NextRequest, NextResponse } from 'next/server'

const BACKEND_TIMEOUT = 10000 // 10 detik

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const email: string = body.email || ''
  const password: string = body.password || ''

  console.log('[Login Proxy] Request masuk:', { email, password: '***' })

  try {
    const backendUrl = `${process.env.BACKEND_URL}/api/login`
    console.log('[Login Proxy] Mencoba URL:', backendUrl)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), BACKEND_TIMEOUT)

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      signal: controller.signal,
    })
    clearTimeout(timeoutId)

    const data = await response.json()
    console.log('[Login Proxy] Response status:', response.status)
    console.log('[Login Proxy] Response data:', JSON.stringify(data))

    // Teruskan response asli dari backend (termasuk status 401 untuk wrong credentials)
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
        { 
          success: false, 
          message: 'Server tidak merespons dalam waktu yang ditentukan. Coba lagi nanti.',
          errorType: 'timeout'
        },
        { status: 504 }
      )
    }

    // Koneksi error (network issue)
    return NextResponse.json(
      { 
        success: false, 
        message: `Gagal terhubung ke server. Periksa koneksi Anda.`,
        errorType: 'network'
      },
      { status: 503 }
    )
  }
}
