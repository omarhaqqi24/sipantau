import { NextRequest, NextResponse } from 'next/server'

const BACKEND_TIMEOUT = 10000 // 10 detik

export async function GET(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value
    || req.headers.get('authorization')?.replace('Bearer ', '')

  try {
    const { searchParams } = new URL(req.url)
    const pasar_id = searchParams.get('pasar_id') || '1'
    const komoditas_id = searchParams.get('komoditas_id') || '1'

    const headers: HeadersInit = { 'Accept': 'application/json' }
    if (token) headers['Authorization'] = `Bearer ${token}`

    const url = `${process.env.BACKEND_URL}/api/predict?pasar_id=${pasar_id}&komoditas_id=${komoditas_id}`
    console.log('[/api/predict] Fetching:', url)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), BACKEND_TIMEOUT)

    const response = await fetch(url, {
      method: 'GET',
      headers,
      signal: controller.signal,
    })
    clearTimeout(timeoutId)

    const data = await response.json()
    console.log('[/api/predict] Response:', JSON.stringify(data).substring(0, 200))
    return NextResponse.json(data, { status: response.status })
  } catch (error: unknown) {
    const err = error as NodeJS.ErrnoException
    console.error('[/api/predict] Error:', err?.message)

    if (err?.name === 'AbortError') {
      return NextResponse.json(
        { success: false, message: 'Server prediksi tidak merespons. Coba lagi nanti.' },
        { status: 504 }
      )
    }

    return NextResponse.json({ success: false, message: 'Gagal mengambil data prediksi.' }, { status: 500 })
  }
}
