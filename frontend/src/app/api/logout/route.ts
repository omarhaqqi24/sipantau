import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ success: false, message: 'No authorization header' }, { status: 401 })
    }

    const backendUrl = `${process.env.BACKEND_URL}/api/logout`
    console.log('[Logout Proxy] Mencoba URL:', backendUrl)

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': authHeader,
      },
    })

    if (!response.ok) {
      console.error('[Logout Proxy] Error dari backend:', response.status)
      return NextResponse.json({ success: false, message: 'Failed to logout from backend' }, { status: response.status })
    }

    const data = await response.json().catch(() => ({}))
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('[Logout Proxy] Exception:', error.message)
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 })
  }
}
